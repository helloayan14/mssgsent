import { createCohere } from '@ai-sdk/cohere';

import {generateText} from 'ai'
import { CohereError } from 'cohere-ai';
const cohere = createCohere({
    apiKey: process.env.COHERE_API_KEY,
 
}); 



export const maxDuration = 30;

export async function POST() {
     const promptt=  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and generate every time a new response on asking.";
    try {

 
    const response = await generateText({
      model: cohere('command-r-plus'), // Replace with the appropriate model
      prompt: promptt,
    });

    const suggetions = response.text.split('||').map((q) => q.trim());

    return new Response(
      JSON.stringify({messages:suggetions}),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  
  } catch (error) {
    if (error instanceof CohereError){
       const {name ,statusCode,message}=error

       return new Response(
        JSON.stringify({name,statusCode,message}),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
       )
    }else{
        console.error('Error generating response:', error);
        throw error;
    }
  }
}
