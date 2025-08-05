import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { AzureOpenAIEmbeddings, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import dotenv from "dotenv";
import fetch from "cross-fetch";

dotenv.config();

try {
    const text = await fs.readFile('demon-slayer.txt', 'utf8')
    const sbaApikey = process.env.API_KEY
    const sbUrl = process.env.PROJECT_URL
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });
    const output = await splitter.createDocuments([text])
    const supabase = createClient(sbUrl, sbaApikey, { fetch })
    await SupabaseVectorStore.fromDocuments(
        output,
        new AzureOpenAIEmbeddings({
            azure: true,
            azureOpenAIApiKey: process.env.azureOpenAIApiKey,
            azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
            azureOpenAIApiEmbeddingsDeploymentName: "text-embedding-3-large",
            azureOpenAIApiVersion: "2024-04-01-preview",
            maxRetries: 1,

        }), {
        client: supabase,
        tableName: 'documents',
        
    }
    )
        ;
} catch (error) {
    console.log(error)
}


console.log("Uploaded to Supabase");
