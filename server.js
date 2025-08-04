import axios from "axios";
import express, { json } from "express"
import chain from "./index.js";
import cors from "cors"
import { formatConvHistory } from "./utils/formatConvHistory.js";



const app = express();
app.use(cors())
app.use(express.json())

app.post("api/bot", async (req, res) => {
    try {
        const { question, history } = req.body;
        const conversation = formatConvHistory(history);
        
            const response = await chain.invoke({
                question,
                conv_history: conversation
            })

        if (!question) {
            return res.status(400).json({
                message: "Pls Enter your question first"
            })


        }
        res.json({
            response,
        })

    } catch (error) {
        console.log(error)
    }
})

app.listen(3001, "Server chal gya")