import { AzureChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import retriever from "./utils/retriever.js";
import { configDotenv } from "dotenv";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";


configDotenv();

function combineDocuments(docs){
    if(!Array.isArray(docs)) return "";
    return docs.map((doc)=> doc.pageContent).join('/n/n')
}


// document.addEventListener('submit', (e) => {
//     e.preventDefault()
//     progressConversation()
// })

const llm = new AzureChatOpenAI({
    azure: true,
      azureOpenAIApiKey:process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: "gpt-4.0",
      azureOpenAIApiVersion: "2024-04-01-preview",
})

const standaloneQuestionTemplate =  `Given some conversation history (if any) and a question, convert the question to a standalone question. 

question: {question}
standalone question:`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answertemplate  = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context.
 If you really don't know the answer, say "I'm sorry, I don't know the answer 
 to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer.
  Always speak as if you were chatting to a friend.
  context:{context}
  question:{question}
  answer:
  `

const answerPrompt = PromptTemplate.fromTemplate(answertemplate)

const standaloneQuestionChain = RunnableSequence.from([
   standaloneQuestionPrompt,
   llm,
   new StringOutputParser()
])

const retrieverChain = RunnableSequence.from([
    (prev) => prev.standaloneQuestion,
    retriever,
    combineDocuments
])

const answerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser()
])

const chain = RunnableSequence.from([
    {
        standaloneQuestion: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
    },
    {
        context:retrieverChain,
        question:({original_input}) => original_input.question,
        answer: ({original_input}) => original_input.answer
    },

    answerChain
])

// const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm)
//                           .pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments).pipe(answerPrompt)



const response = await  standaloneQuestionChain.invoke({
   question: 'What are the technical requi rements for running Scrimba? I only have a very laptop which is not that powerful ',
   
})

console.log(response)

export default chain;