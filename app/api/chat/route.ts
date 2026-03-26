import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

interface EnhancePromptRequest {
    prompt: string
    context?: {
        fileName?: string
        language?: string
        codeContent?: string
    }
}

async function generateAIResponse(messages: ChatMessage[]) {
    const systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers.`

    const openRouterMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
    ]

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://web-code-0lax.onrender.com",
                "X-Title": "AI IDE",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: openRouterMessages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        })

        const data = await response.json()

        return data.choices[0].message.content
    } catch (error) {
        console.error("OpenRouter error:", error)
        throw new Error("Failed to generate AI response")
    }
}

async function enhancePrompt(request: EnhancePromptRequest) {
    const enhancementPrompt = `Enhance this prompt to be more detailed for a coding assistant:

"${request.prompt}"

Return only the improved prompt.`

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://web-code-0lax.onrender.com",
                "X-Title": "AI IDE",
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: enhancementPrompt }],
                temperature: 0.3,
                max_tokens: 300,
            }),
        })

        const data = await response.json()
        return data.choices[0].message.content
    } catch (error) {
        console.error("Prompt enhancement error:", error)
        return request.prompt
    }
}



export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Handle prompt enhancement
        if (body.action === "enhance") {
            const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest)
            return NextResponse.json({ enhancedPrompt })
        }

        const { message, history } = body;


        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
        }

        const validHistory = Array.isArray(history)
            ? history.filter(
                (msg: any) =>
                    msg &&
                    typeof msg === "object" &&
                    typeof msg.role === "string" &&
                    typeof msg.content === "string" &&
                    ["user", "assistant"].includes(msg.role),
            )
            : []
        const recentHistory = validHistory.slice(-10)
        const messages: ChatMessage[] = [...recentHistory, { role: "user", content: message }]

        const aiResponse = await generateAIResponse(messages)
        if (!aiResponse) {
            throw new Error("Empty response from AI model")
        }

        return NextResponse.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Error in AI chat route:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        return NextResponse.json(
            {
                error: "Failed to generate AI response",
                details: errorMessage,
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        )
    }
}

export async function GET() {
    return NextResponse.json({
        status: "AI Chat API is running",
        timestamp: new Date().toISOString(),
        info: "Use POST method to send chat messages or enhance prompts",
    })
}