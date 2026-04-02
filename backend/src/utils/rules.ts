import { prisma } from "../lib/prisma.js"

export const velocityRule = async(userid: string) => {
  const lastMinute = new Date(Date.now() - 60*1000);
  const countTransactions = await prisma.user.count({
    where:{
      userId: userid,
      createdAt: {
        gte: lastMinute
      }
    }
  })

  if(countTransactions >= 5){
    return{
      risk: 40,
      reason: "High Transaction Velocity"
    }
  }
  return {
    risk: 0,
    reason: null
  }
}

export const geoTrack = async(userid: string, country: string, ) => {
  let riskScore = 0;
  const user = await prisma.user.findUnique({
    where: {
      userId: userid
    }
  })

  if(!user || !user.lastCountry){
    return {
      risk: 0,
      reason: null
    }
  }

  if (user.lastCountry !== country) {
    return {
      risk: 30,
      reason: "Country changed since last transaction"
    }
  }

  return { risk: 0, reason: null }
}