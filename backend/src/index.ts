import express from "express"
const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
    console.log("Server Started")
})
app.listen(3000)