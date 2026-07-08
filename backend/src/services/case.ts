import { prisma } from "../lib/prisma.js";
import { redis } from "../lib/redis.js";
import { fraudAnalysis } from "../types/transaction.js";

export const handleCase = async (
  fraudAnalysis: fraudAnalysis,
  userId: string,
  lastTxn: string,
) => {
  let caseId: string;
  const riskScore = fraudAnalysis.riskScore;
  const caseKey = `user:${userId}:case`;

  const cachedCaseId = await redis.get(caseKey);
  try {
    if (cachedCaseId) {
      caseId = cachedCaseId;

      await prisma.case.update({
        where: { id: caseId },
        data: {
          totalRiskScore: {
            increment: riskScore,
          },
        },
      });
    } else {
      const existingCase = await prisma.case.findUnique({
        where: {
          userId,
        },
      });

      if (existingCase) {
        caseId = existingCase.id;

        await prisma.case.update({
          where: {
            id: caseId,
          },
          data: {
            totalRiskScore: {
              increment: riskScore,
            },
          },
        });

        await redis.set(caseKey, caseId, "EX", 60 * 60 * 24);
      } else {

        const newCase = await prisma.case.create({
          data: {
            userId,
            totalRiskScore: riskScore,
          },
        });

        caseId = newCase.id;

        await redis.set(caseKey, caseId, "EX", 60 * 60 * 24);
      }
    }

    const alert = await prisma.alert.create({
      data: {
        userId,
        caseId,
        transactionId: lastTxn,
        riskScore,
        reasons: fraudAnalysis.reasons,
      },
    });

    await prisma.transaction.update({
      where: {
        transactionId: lastTxn,
      },
      data: {
        caseId,
      },
    });

    return {
      caseId,
      alert,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
