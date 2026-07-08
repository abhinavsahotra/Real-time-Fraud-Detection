import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Router } from "express";
import { IncomingTransaction } from "../types/transaction.js";
import { fraudCheck } from "../services/engine.js";
import { broadcastTransaction } from "../websockets/websockets.js";
import { getUserBehaviour } from "../services/behaviour.js";
import { handleCase } from "../services/case.js";
import { redis } from "../lib/redis.js";
import { getRecentTransactionsRedis } from "../services/redisHelpers.js";

const ingestionRouter = Router();

export const getUserTransactions = async (userId: string, limit: number) => {
  const getTransactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return getTransactions;
};

ingestionRouter.post("/", async (req: Request, res: Response) => {
  try {
    // TODO: ZOD Validation
    const data: IncomingTransaction = req.body;

    // UPSERT USER (create if not exists)
    const user = await prisma.user.upsert({
      where: { userId: data.userId },
      update: {}, // nothing to update yet
      create: {
        userId: data.userId,
        lastCountry: data.country,
      },
    });

    // SAVE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: data.transactionId,
        userId: user.id,
        amount: data.amount,
        currency: data.currency,
        country: data.country,
        ip: data.ip,
        status: "PENDING",
        timestamp: new Date(data.timestamp),
      },
    });

    const redisKey = `user:${user.id}:recent_txns`;
    let last30txns = await getRecentTransactionsRedis(user.id);

    if (last30txns.length < 30) {
      last30txns = await getUserTransactions(user.id, 30);

      const values = [...last30txns]
        .reverse()
        .map((txn) => JSON.stringify(txn));

      if(values.length > 0){
        await redis
        .multi()
        .del(redisKey)
        .lpush(redisKey, ...values)
        .ltrim(redisKey, 0, 29)
        .expire(redisKey, 60 * 60 * 24)
        .exec();
      }
    }

    const userBehaviour = await getUserBehaviour(last30txns);

    const fraudAnalysis = await fraudCheck(data, userBehaviour);
    const riskScore = fraudAnalysis.riskScore;
    let updatedTransaction;
    const status = fraudAnalysis.flagged ? "FLAGGED" : "PENDING";

    if (riskScore > 30)
      try {
        await prisma.$transaction(async (tx) => {
          await handleCase(fraudAnalysis, user.id, transaction.transactionId);
          updatedTransaction = await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              status: status,
              riskScore: fraudAnalysis.riskScore,
              reasons: fraudAnalysis.reasons,
              flagged: fraudAnalysis.flagged,
            },
          });
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error during Alert/Case creation",
        });
      }
    else {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastCountry: data.country },
      });

      updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          riskScore: fraudAnalysis.riskScore,
          reasons: fraudAnalysis.reasons,
          flagged: fraudAnalysis.flagged,
        },
      });
    }
    const cachePayload = {
      amount: updatedTransaction?.amount,
      country: updatedTransaction?.country,
      timestamp: updatedTransaction?.timestamp,
    };
    try {
      await redis
        .multi()
        .lpush(redisKey, JSON.stringify(cachePayload))
        .ltrim(redisKey, 0, 29)
        .expire(redisKey, 60 * 60 * 24)
        .exec();
    } catch (err) {
      console.error("Redis cache update failed", err);
    }

    if (updatedTransaction) {
      broadcastTransaction(updatedTransaction);
    }

    res.json({
      message: "Transaction processed",
      updatedTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to ingest transaction" });
  }
});

ingestionRouter.get("/recent", async (req: Request, res: Response) => {
  try {
    const cachekey = `transactions:recent`;

    const cached = await redis.get(cachekey);

    if(cached){
      return res.json({
        source: "cache",
        transactions: JSON.parse(cached)
      })
    }
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        transactionId: true,
        userId: true,
        amount: true,
        currency: true,
        country: true,
        status: true,
        riskScore: true,
        createdAt: true,
      },
    });

    await redis.set(cachekey, JSON.stringify(transactions), "EX", 30);

    return res.json({
      source: "database",
      transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch recent transactions",
    });
  }
});

export default ingestionRouter;
