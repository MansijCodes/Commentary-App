import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
  const apiKey=process.env.GEMINI_API_KEY as string;

  const prompt ='Give me some random comments asking queries where the queries has some information realted to recent news,sports ,the persons interest or hobby e.t.c. I want 3 to 5 questions.Please separate eacch question by ||.'
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
    const result = await model.generateContent(prompt);
    return Response.json({success:true,message:result.response.text()},{status:200})
  } catch (error) {
    console.log('Error in suggesting message',error);
    return Response.json({success:false,message:'Error in suggesting message'},{status:500})
  }
}


