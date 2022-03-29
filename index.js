import "dotenv/config"
import express from "express";

const app = express();

app.get('/ping', (req, res) => {
    res.send("pong");
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server running on ${port}`);
})