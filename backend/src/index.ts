import express from "express"
import transactionRoutes from "./routes/transaction.js"

const app = express();
app.use(express.json())

app.use("/transactions", transactionRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
})

console.log("server running")
app.listen(3000)