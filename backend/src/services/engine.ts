import { geoTrack, velocityRule } from "../utils/rules.js"

export const fraudCheck = async(userid: string, country: string) => {
  let riskScore = 0
  const reasons: string[] = []

  const velocityCheck = await velocityRule(userid)
  riskScore += velocityCheck.risk
  if(velocityCheck.reason) reasons.push(velocityCheck.reason)

  const geoCheck = await geoTrack(userid, country)
  riskScore += geoCheck.risk
  if(geoCheck.reason) reasons.push(geoCheck.reason)

  const flagged = (riskScore >= 50) ? true : false

  return {
    riskScore,
    reasons,
    flagged
  }
}