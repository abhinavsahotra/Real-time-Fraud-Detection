import { Request,Response } from "express";
import { prisma } from "../lib/prisma.js"
import { Router } from "express";
import { CaseType } from "../types/case.js";

const investigation = Router();

interface Params {
    id: string
}

export function parseCaseStatus(value: unknown): CaseType | null {
    if (typeof value !== "string") return null;

    if (value in CaseType) {
        return CaseType[value as keyof typeof CaseType];
    }

    return null;
}

investigation.get("/", async (req: Request, res: Response) => {
    // shows all open or closed cases
    console.log("investigation route hitted")
    const  query = parseCaseStatus(req.query.status);

    if(!query){
        return res.status(400).json({
            message: "Valid Status is Required"
        })
    }
    try {
        const cases = await prisma.case.findMany({
            where: {status: query}
        })
        return res.json({
            cases
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

investigation.get("/:id", async (req: Request<Params>, res: Response) => {
    // shows case info, all alerts, all transactions, all notes
    const id  = req.params.id;

    try {
        const caseRecord = await prisma.case.findFirst({
            where: {caseId: id}
        })
        console.log(caseRecord)
        const alerts = await prisma.alert.findMany({
            where: {caseId: caseRecord?.id}
        })

        const transactions = await prisma.transaction.findMany({
            where: {caseId: caseRecord?.id}
        })

        return res.json({
            alerts,
            transactions
        })
        console.log(caseRecord?.id)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message": "error"
        })
    }

})

investigation.post("/:id/notes", async (req: Request<Params>, res: Response) => {
    // { "investigator": "rahul@bank.com" }, updated assigned_to = "rahul@bank.com"
    // { "investigator":"rahul@bank.com", "note":"User IP mismatch. Sending KYC request." }

    const id   = req.params.id
    const {investigator, note} = req.body;
    if(!investigator || note) return;

    try {
        const addNote = await prisma.case.update({
        where: {caseId: id},
        data: {assigned_to: investigator, notes: note}
        })

        res.json({
            addNote
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Something went wrong"
        })
    }
})

investigation.post("/:id/status", async (req: Request<Params>, res: Response) => {
    // body => { "status": "CLOSED" }, { "status": "ESCALATED" }
    const id = String(req.params.id);
    const status = parseCaseStatus(req.body.status);

    if(!status) {
        return res.status(400).json({
            "message": "Missing Information"
        })
    }

    try {
        const caseStatus = await prisma.case.update({
        where: {caseId: id},
        data: { status }
        })
        res.json({
            caseStatus
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "Something went wrong"
        })
    }
})

export default investigation