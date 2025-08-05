import axios from "axios";
import express, { json } from "express"
import chain from "./index.js";
import cors from "cors"
import  formatConvHistory  from "./utils/formatConvHistory.js";



const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "https://your-frontend-url.onrender.com"],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));




app.post('/api/chat', async (req, res) => {
    try {
        const { question, history } = req.body;
        
        
        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter your question first"
            });
        }

        const conversation = formatConvHistory(history);
        
        const response = await chain.invoke({
            question: question.trim(),
            conv_history: conversation
        });

        res.json({
            response,
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: "Sorry, something went wrong. Please try again."
        });
    }
});
const PORT = process.env.PORT || 3001
app.listen( PORT , () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    
});