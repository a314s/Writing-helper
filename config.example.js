// API Configuration - EXAMPLE FILE
// INSTRUCTIONS:
// 1. Copy this file and rename it to config.js
// 2. Add your API key (OpenAI or Anthropic) to the appropriate apiKey field
// 3. The config.js file is included in .gitignore to prevent committing your API key

const CONFIG = {
    // API Provider - can be 'anthropic' or 'openai'
    apiProvider: 'openai', // Choose which API provider to use
    
    // Anthropic API settings
    anthropic: {
        apiKey: "", // Add your Anthropic API key here (obtain from https://console.anthropic.com/)
        apiUrl: "https://api.anthropic.com/v1/messages",
        maxTokens: 4000,
        // Latest Claude models
        models: {
            opus: "claude-3-7-opus-20250218",
            sonnet: "claude-3-7-sonnet-20250219",
            haiku: "claude-3-7-haiku-20250307"
        }
    },
    
    // OpenAI API settings
    openai: {
        apiKey: "", // Add your OpenAI API key here (obtain from https://platform.openai.com/)
        apiUrl: "https://api.openai.com/v1/chat/completions",
        maxTokens: 4000,
        // Latest OpenAI models
        models: {
            gpt4o: "gpt-4o",
            gpt4: "gpt-4-turbo",
            gpt35: "gpt-3.5-turbo"
        },
        defaultModel: "gpt-4o" // Default to GPT-4o
    },
    
    // Default system prompts for different stages
    systemPrompts: {
        expandPrompt: "You are an expert storyteller and creative writing assistant. Your task is to expand a brief story prompt into a more detailed concept, adding depth to the themes, setting, and characters. Keep your response concise but rich in storytelling potential.",
        
        generatePlots: "You are an expert storyteller and creative writing assistant. Based on the expanded story concept provided, generate 5 distinct plot suggestions or subplots that could be incorporated into the narrative. Each plot should have a clear title and a brief description. Format your response as a JSON array of objects with 'title' and 'description' fields.",
        
        developChapters: "You are an expert storyteller and creative writing assistant. Based on the expanded story concept and selected plot elements provided, develop a chapter that incorporates these elements into a cohesive narrative. Focus on character development, engaging dialogue, and vivid descriptions. The chapter should advance the overall story while exploring the specific plot elements mentioned."
    },
    
    // Debug mode - set to true to see detailed console logs
    debug: false  // Set to true for development/debugging
};