// app/api/ask-question/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CohereClient } from "cohere-ai";

// Initialize Supabase client
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const cohere = new CohereClient({
  token: "PCg61xfVOohppznPeHndintSGTImVFEEhSqUvJLR",
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { question ,filterEmail } = await request.json();
    // console.log("filterEmail:", filterEmail);

    const embeddingResponse = await cohere.embed({
      texts: [question], // Cohere expects an array of texts
      model: 'embed-english-v3.0', // Specify the embedding model
      inputType: 'search_query', // Adjust the input type if necessary

    });

    // if (Array.isArray(embeddingResponse.embeddings)) {
      const embeddingsArray = embeddingResponse.embeddings as number[][];
      const questionEmbedding = embeddingsArray[0]; // Access the first embedding
      // console.log("questionEmbedding===>",questionEmbedding)


    // Step 1: Convert the question into an embedding
    // const openai = new OpenAI();
    // const embeddingResponse = await openai.embeddings.create({
    //   model: "text-embedding-3-small",
    //   input: question,
    // });

    // const questionEmbedding = embeddingResponse.data[0].embedding;

    // Step 2: Search the vector store for relevant emails using similarity search
    const { data: matchingSections, error } = await supabase.rpc(
      "match_filtered_email_sections",
      {
        query_embedding: questionEmbedding,
        match_threshold: -0.3,
        match_count: 10, // Number of relevant emails to retrieve
        email_address: filterEmail || "sammythefreelancer@gmail.com", // Add the filter for a specific email
      }
    );

    // console.log("Matching sections:", matchingSections);

    if (error) throw new Error(error.message);

    // Combine the relevant sections into a single context
    const context = matchingSections
      .map((section: any) => section.section_content)
      .join("\n\n");

    // console.log("Context:", context);

    // Step 3: Use OpenAI to generate a response using the relevant email content as context
    // const aiResponse = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `To the best of your ability use the context to answer the question.`,
    //     },
    //     {
    //       role: "user",
    //       content: `Using the following information, to answer the question\n\n
    //       Context:\n
    //       ${context}\n\n
    //       Question:\n
    //       ${question}`,
    //     },
    //   ],
    // });

    // const answer = aiResponse.choices[0].message.content;

    const userMessage = `
    Role: user
    content: Using the following information, to answer the question\n\n
          Context:\n
          ${context}\n\n
          Question:\n
          ${question}`;

          const aiResponse = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: userMessage // Send the constructed message as a string
    });
// console.log("aiResponse==>",aiResponse)

const answer = aiResponse.text;


    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: any) {
    console.error("Error in ask-question API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
