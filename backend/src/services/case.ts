import { prisma } from "../lib/prisma.js"
import { fraudAnalysis } from "../types/transaction.js";

export const handleCase = async(fraudAnalysis: fraudAnalysis, userId: string) => {
  const riskScore = fraudAnalysis.riskScore;

  try {
    const userCase = await prisma.case.findFirst({
      where:{
        userId: userId
      }
    })
    const lastTxn = await prisma.transaction.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: "desc" }
    });


    if(userCase) {
      const userAlert = await prisma.alert.create({
        data: {
          userId: userId,
          caseId: userCase.id,
          transactionId: lastTxn!.id,
          riskScore: riskScore,
          reasons: fraudAnalysis.reasons
        }
      })
      await prisma.case.update({
        where: { id: userCase.id },
        data: {
          totalRiskScore: {
            increment: riskScore
          }
        }
      })

      await prisma.transaction.update({
        where: { id: lastTxn!.id },
        data: {
          caseId: userCase.id
        }
      })

      return ({
        userAlert
      })
    }
    else{
      const newCase = await prisma.case.create({
        data: {
          userId: userId,
          transaction: {
            connect: {id: lastTxn!.id}
          }
        }
      })
      const newAlert = await prisma.alert.create({
        data: {
          riskScore: fraudAnalysis.riskScore,
          reasons: fraudAnalysis.reasons,
          caseId: newCase.id,
          userId: userId,
          transactionId: lastTxn!.id,
        }
      })
      return ({
        newCase,
        newAlert
      })
    }
  } catch (error) {
    console.log(error)
    return error;
  }
}