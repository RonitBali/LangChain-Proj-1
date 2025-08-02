import { AzureChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { configDotenv } from "dotenv";
import { RunnableSequence , RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";


configDotenv()

const llm = new AzureChatOpenAI({
    azure: true,
      azureOpenAIApiKey:process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: "gpt-4o",
      azureOpenAIApiVersion: "2024-04-01-preview",
})

const punctuationPrompt = PromptTemplate.fromTemplate(
    `Given a sentence, add punctuation where needed
     sentence:{sentence}
     sentence with punctuation:`
)

const grammarPrompt = PromptTemplate.fromTemplate(
    `Given a sentence and correct the grammer
    sentence:{punctuated_sentence}
    sentence with correct grammar:
    `
)

const translation = PromptTemplate.fromTemplate(
    `Given a sentence and Translate that sentence into {language}
    sentence:{grammatically_correct_sentence}
    translated_sentence:
    `
)

const punctuationChain = RunnableSequence.from([
    punctuationPrompt,
    llm,
    new StringOutputParser()
])

const grammarChain = RunnableSequence.from([
    grammarPrompt,
    llm,
    new StringOutputParser()
])

const translationChain = RunnableSequence.from([
    translation,
    llm,
    new StringOutputParser()
])

const chain = RunnableSequence.from([
    {punctuated_sentence: punctuationChain},
    {grammatically_correct_sentence:grammarChain},
     translationChain
    
    // {punctuated:  prevresult => prevresult}, , not a good way to do this
    
    
])

const response = await chain.invoke({
    sentence:`i dont liked mondays`,
    language: `Japanese`
})

console.log(response);
