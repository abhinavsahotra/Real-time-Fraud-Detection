import { Router } from "express";
import { ingestTransaction } from "../controller/transactionroute.js"
import investigation from "../controller/investigation.js";

const router = Router();

router.use("/cases", investigation);
router.use("/", ingestTransaction);

export default router