// DOM Elements
const apiKeyInput = document.getElementById('api-key');
const modelSelection = document.getElementById('model-selection');
const saveApiConfigBtn = document.getElementById('save-api-config-btn');
const apiConfigSection = document.getElementById('api-config-section');

const initialPromptTextarea = document.getElementById('initial-prompt');
const expandPromptBtn = document.getElementById('expand-prompt-btn');
const expandedPromptContent = document.getElementById('expanded-prompt-content');
const generatePlotsBtn = document.getElementById('generate-plots-btn');
const revisePromptBtn = document.getElementById('revise-prompt-btn');
const plotSuggestionsContainer = document.getElementById('plot-suggestions-container');
const regeneratePlotsBtn = document.getElementById('regenerate-plots-btn');
const developSelectedBtn = document.getElementById('develop-selected-btn');
const chaptersContainer = document.getElementById('chapters-container');
const exportStoryBtn = document.getElementById('export-story-btn');
const sendToAiBtn = document.getElementById('send-to-ai-btn');

// Loading indicators
const loadingPrompt = document.getElementById('loading-prompt');
const loadingPlots = document.getElementById('loading-plots');
const loadingChapters = document.getElementById('loading-chapters');

// Section elements
const promptSection = document.getElementById('prompt-section');
const expandedPromptSection = document.getElementById('expanded-prompt-section');
const plotSuggestionsSection = document.getElementById('plot-suggestions-section');
const chapterDevelopmentSection = document.getElementById('chapter-development-section');

// Templates
const plotSuggestionTemplate = document.getElementById('plot-suggestion-template');
const chapterTemplate = document.getElementById('chapter-template');

// Error modal elements
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const errorDetails = document.getElementById('error-details');
const errorDetailsContainer = document.getElementById('error-details-container');
const closeErrorBtn = document.getElementById('close-error-btn');
const closeModalBtn = document.querySelector('.close-modal');

// Application State
const state = {
    apiConfigured: false,
    apiKey: '',
    model: CONFIG.anthropic.models.sonnet, // Default to Sonnet
    initialPrompt: '',
    expandedPrompt: '',
    selectedPlots: [],
    plotSuggestions: [],
    chapters: []
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Always start with the API configuration section
    switchSection(apiConfigSection);
    // Load saved API configuration
    loadApiConfig();
    
    // Add event listeners only if elements exist
    // API Configuration
    if (saveApiConfigBtn) {
        saveApiConfigBtn.addEventListener('click', handleSaveApiConfig);
    }
    
    // Initial prompt expansion
    if (expandPromptBtn) {
        expandPromptBtn.addEventListener('click', handleExpandPrompt);
    }
    
    // Plot generation
    if (generatePlotsBtn) {
        generatePlotsBtn.addEventListener('click', handleGeneratePlots);
    }
    
    if (revisePromptBtn) {
        revisePromptBtn.addEventListener('click', () => switchSection(promptSection));
    }
    
    // Plot selection
    if (regeneratePlotsBtn) {
        regeneratePlotsBtn.addEventListener('click', handleRegeneratePlots);
    }
    
    if (developSelectedBtn) {
        developSelectedBtn.addEventListener('click', handleDevelopSelected);
    }
    
    // Chapter development
    if (exportStoryBtn) {
        exportStoryBtn.addEventListener('click', handleExportStory);
    }
    
    if (sendToAiBtn) {
        sendToAiBtn.addEventListener('click', handleSendToAI);
    }
    
    // Error modal
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', closeErrorModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeErrorModal);
    }
});

// API Configuration Functions
function loadApiConfig() {
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    const savedModel = localStorage.getItem('anthropic_model');
    
    console.log('Loading saved API configuration');
    console.log('Saved model:', savedModel);
    
    // Clear any previous API key
    apiKeyInput.value = '';
    state.apiConfigured = false;
    
    if (savedApiKey) {
        console.log('API key found in local storage');
        apiKeyInput.value = savedApiKey;
        state.apiKey = savedApiKey;
        state.apiConfigured = true;
    } else {
        console.log('No API key found in local storage');
        // Force showing the API configuration section
        switchSection(apiConfigSection);
        return;
    }
    
    if (savedModel) {
        console.log('Setting model to:', savedModel);
        // Check if the saved model exists in the dropdown
        const modelExists = Array.from(modelSelection.options).some(option => option.value === savedModel);
        
        if (modelExists) {
            modelSelection.value = savedModel;
            state.model = savedModel;
        } else {
            // If the saved model doesn't exist (e.g., after an update), use the default
            console.log('Saved model not found in options, using default');
            state.model = modelSelection.value;
        }
    } else {
        // Use the default model from the dropdown
        state.model = modelSelection.value;
    }
    
    // If API is configured, show the prompt section
    if (state.apiConfigured) {
        console.log('API is configured, showing prompt section');
        switchSection(promptSection);
    } else {
        console.log('API is not configured, showing API configuration section');
        switchSection(apiConfigSection);
    }
}

function handleSaveApiConfig() {
    const apiKey = apiKeyInput.value.trim();
    // Get the selected model value
    let model = modelSelection.value;
    
    if (!apiKey) {
        showError('API Key Required', 'Please enter your Anthropic API key to continue.');
        return;
    }
    
    // Basic validation for Anthropic API key format
    if (!apiKey.startsWith('sk-ant-')) {
        showError('Invalid API Key', 'The API key should start with "sk-ant-". Please check your Anthropic API key.');
        return;
    }
    
    console.log('Saving API configuration with model:', model);
    
    // Save to local storage
    localStorage.setItem('anthropic_api_key', apiKey);
    localStorage.setItem('anthropic_model', model);
    
    // Update state
    state.apiKey = apiKey;
    state.model = model;
    state.apiConfigured = true;
    
    // Show success message
    alert('API configuration saved successfully! You can now use the AI Story Developer.');
    
    // Switch to prompt section
    switchSection(promptSection);
    
    // Test API connection
    testApiConnection();
}

// Function to test API connection
async function testApiConnection() {
    try {
        // Show a message to the user
        alert('Testing API connection... This may take a moment.');
        
        const response = await fetch(CONFIG.anthropic.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': state.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: state.model,
                max_tokens: 10,
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, this is a test message. Please respond with "API connection successful".'
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('API test failed:', data);
            alert('API Connection Failed: Could not connect to the Anthropic API. Please check your API key and try again.');
            showError('API Connection Failed', 'Could not connect to the Anthropic API. Please check your API key and try again.');
            
            // Reset API configuration
            state.apiConfigured = false;
            switchSection(apiConfigSection);
            return false;
        }
        
        console.log('API test successful:', data);
        alert('API connection successful! You can now use the AI Story Developer.');
        return true;
    } catch (error) {
        console.error('API test error:', error);
        alert('API Connection Error: Error testing connection to the Anthropic API: ' + error.message);
        showError('API Connection Error', 'Error testing connection to the Anthropic API: ' + error.message);
        
        // Reset API configuration
        state.apiConfigured = false;
        switchSection(apiConfigSection);
        return false;
    }
}

// Section Navigation
function switchSection(sectionToShow) {
    // Hide all sections
    apiConfigSection.classList.remove('active-section');
    apiConfigSection.classList.add('hidden-section');
    
    promptSection.classList.remove('active-section');
    promptSection.classList.add('hidden-section');
    
    expandedPromptSection.classList.remove('active-section');
    expandedPromptSection.classList.add('hidden-section');
    
    plotSuggestionsSection.classList.remove('active-section');
    plotSuggestionsSection.classList.add('hidden-section');
    
    chapterDevelopmentSection.classList.remove('active-section');
    chapterDevelopmentSection.classList.add('hidden-section');
    
    // Show the selected section
    sectionToShow.classList.remove('hidden-section');
    sectionToShow.classList.add('active-section');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// API Call Functions
async function callAnthropicAPI(prompt, systemPrompt) {
    // Debug logging
    if (CONFIG.debug) {
        console.log('=== API CALL START ===');
        console.log('API Key configured:', state.apiConfigured);
        console.log('Model:', state.model);
    }
    
    if (!state.apiConfigured) {
        showError('API Not Configured', 'Please configure your Anthropic API key first.');
        switchSection(apiConfigSection);
        return null;
    }
    
    // Log API call details for debugging
    if (CONFIG.debug) {
        console.log('Making API call with model:', state.model);
        console.log('System prompt:', systemPrompt);
        console.log('User prompt:', prompt);
    }
    
    try {
        const requestBody = {
            model: state.model,
            max_tokens: CONFIG.anthropic.maxTokens,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        };
        
        // Add system prompt if provided
        if (systemPrompt) {
            requestBody.system = systemPrompt;
        }
        
        if (CONFIG.debug) {
            console.log('Request body:', JSON.stringify(requestBody, null, 2));
        }
        
        const response = await fetch(CONFIG.anthropic.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': state.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });
        
        const responseData = await response.json();
        if (CONFIG.debug) {
            console.log('API Response:', responseData);
            console.log('=== API CALL END ===');
        }
        
        if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
        }
        
        // Check if the response has the expected structure
        if (!responseData.content || !responseData.content[0] || !responseData.content[0].text) {
            throw new Error('Unexpected API response format: ' + JSON.stringify(responseData));
        }
        
        return responseData.content[0].text;
    } catch (error) {
        console.error('=== API ERROR ===');
        console.error('API Error:', error);
        let errorMsg = 'There was an error calling the Anthropic API.';
        let errorDetailsText = '';
        
        try {
            const errorObj = JSON.parse(error.message);
            errorMsg = errorObj.error?.message || errorMsg;
            errorDetailsText = JSON.stringify(errorObj, null, 2);
        } catch (e) {
            errorDetailsText = error.message || error.toString();
        }
        
        showError('API Error', errorMsg, errorDetailsText);
        return null;
    }
}

// Handler Functions
async function handleExpandPrompt() {
    const prompt = initialPromptTextarea.value.trim();
    
    if (!prompt) {
        showError('Input Required', 'Please enter a story prompt first.');
        return;
    }
    
    state.initialPrompt = prompt;
    
    // Show loading indicator
    loadingPrompt.classList.remove('hidden');
    expandPromptBtn.disabled = true;
    
    try {
        // Call Anthropic API to expand prompt
        if (CONFIG.debug) {
            console.log('Expanding prompt:', prompt);
        }
        
        const expandedPrompt = await callAnthropicAPI(
            `Expand this story prompt into a more detailed concept: "${prompt}"`,
            CONFIG.systemPrompts.expandPrompt
        );
        
        if (expandedPrompt) {
            state.expandedPrompt = expandedPrompt;
            
            // Display expanded prompt
            expandedPromptContent.innerHTML = expandedPrompt;
            
            // Switch to expanded prompt section
            switchSection(expandedPromptSection);
        }
    } catch (error) {
        console.error('Error expanding prompt:', error);
        console.error('Original prompt:', prompt);
        
        // Provide more detailed error message
        let errorMsg = 'There was an error expanding your prompt.';
        if (error.message && error.message.includes('API key')) {
            errorMsg = 'API key error: Please check that your API key is valid and has sufficient credits.';
        } else if (error.message && error.message.includes('rate limit')) {
            errorMsg = 'Rate limit exceeded: The API is currently rate limited. Please try again in a few moments.';
        } else if (!state.apiConfigured) {
            errorMsg = 'API not configured: Please enter your API key in the configuration section.';
            switchSection(apiConfigSection);
        } else {
            errorMsg = 'API Error: ' + (error.message || 'Unknown error occurred');
        }
        
        // Always show error to user
        alert('Error: ' + errorMsg);
        showError('Expansion Error', errorMsg, error.message || error.toString());
    } finally {
        // Hide loading indicator
        loadingPrompt.classList.add('hidden');
        expandPromptBtn.disabled = false;
    }
}

async function handleGeneratePlots() {
    // Show loading indicator
    loadingPlots.classList.remove('hidden');
    generatePlotsBtn.disabled = true;
    
    try {
        // Call Anthropic API to generate plot suggestions
        const plotSuggestionsText = await callAnthropicAPI(
            `Based on this story concept, generate 5 distinct plot suggestions or subplots that could be incorporated into the narrative. Each plot should have a clear title and a brief description. Format your response as a JSON array of objects with 'title' and 'description' fields: "${state.expandedPrompt}"`,
            CONFIG.systemPrompts.generatePlots
        );
        
        if (plotSuggestionsText) {
            // Parse the JSON response
            let plotSuggestions;
            try {
                // Extract JSON from the response if it's wrapped in text
                const jsonMatch = plotSuggestionsText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    plotSuggestions = JSON.parse(jsonMatch[0]);
                } else {
                    plotSuggestions = JSON.parse(plotSuggestionsText);
                }
            } catch (e) {
                console.error('Error parsing plot suggestions:', e);
                // Fallback to a simple format if JSON parsing fails
                plotSuggestions = [
                    {
                        title: 'Plot Suggestion',
                        description: plotSuggestionsText
                    }
                ];
            }
            
            state.plotSuggestions = plotSuggestions;
            
            // Display plot suggestions
            renderPlotSuggestions(plotSuggestions);
            
            // Switch to plot suggestions section
            switchSection(plotSuggestionsSection);
        }
    } catch (error) {
        console.error('Error generating plots:', error);
        showError('Generation Error', 'There was an error generating plot suggestions. Please try again.');
    } finally {
        // Hide loading indicator
        loadingPlots.classList.add('hidden');
        generatePlotsBtn.disabled = false;
    }
}

async function handleRegeneratePlots() {
    // Show loading indicator
    loadingPlots.classList.remove('hidden');
    regeneratePlotsBtn.disabled = true;
    
    try {
        // Call Anthropic API to regenerate plot suggestions
        const plotSuggestionsText = await callAnthropicAPI(
            `Based on this story concept, generate 5 NEW and DIFFERENT plot suggestions or subplots that could be incorporated into the narrative. Make these distinct from typical or common plots. Each plot should have a clear title and a brief description. Format your response as a JSON array of objects with 'title' and 'description' fields: "${state.expandedPrompt}"`,
            CONFIG.systemPrompts.generatePlots
        );
        
        if (plotSuggestionsText) {
            // Parse the JSON response
            let plotSuggestions;
            try {
                // Extract JSON from the response if it's wrapped in text
                const jsonMatch = plotSuggestionsText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    plotSuggestions = JSON.parse(jsonMatch[0]);
                } else {
                    plotSuggestions = JSON.parse(plotSuggestionsText);
                }
            } catch (e) {
                console.error('Error parsing plot suggestions:', e);
                // Fallback to a simple format if JSON parsing fails
                plotSuggestions = [
                    {
                        title: 'Plot Suggestion',
                        description: plotSuggestionsText
                    }
                ];
            }
            
            state.plotSuggestions = plotSuggestions;
            
            // Display plot suggestions
            renderPlotSuggestions(plotSuggestions);
        }
    } catch (error) {
        console.error('Error regenerating plots:', error);
        showError('Generation Error', 'There was an error regenerating plot suggestions. Please try again.');
    } finally {
        // Hide loading indicator
        loadingPlots.classList.add('hidden');
        regeneratePlotsBtn.disabled = false;
    }
}

async function handleDevelopSelected() {
    // Get selected plots
    const selectedPlots = [];
    const checkboxes = document.querySelectorAll('.plot-checkbox:checked');
    
    if (checkboxes.length === 0) {
        showError('Selection Required', 'Please select at least one plot suggestion.');
        return;
    }
    
    checkboxes.forEach(checkbox => {
        const plotElement = checkbox.closest('.plot-suggestion');
        const plotIndex = parseInt(plotElement.dataset.index);
        selectedPlots.push(state.plotSuggestions[plotIndex]);
    });
    
    state.selectedPlots = selectedPlots;
    
    // Show loading indicator
    loadingChapters.classList.remove('hidden');
    developSelectedBtn.disabled = true;
    
    try {
        // Create an introduction chapter
        const introChapter = {
            title: 'Chapter 1: Beginnings',
            content: await generateChapterContent('introduction', state.expandedPrompt, null)
        };
        
        // Generate chapters for each selected plot
        const plotChapters = await Promise.all(selectedPlots.map(async (plot, index) => {
            return {
                title: `Chapter ${index + 2}: ${plot.title}`,
                content: await generateChapterContent('plot', state.expandedPrompt, plot)
            };
        }));
        
        // Create a conclusion chapter
        const conclusionChapter = {
            title: `Chapter ${selectedPlots.length + 2}: Resolution`,
            content: await generateChapterContent('conclusion', state.expandedPrompt, selectedPlots)
        };
        
        // Combine all chapters
        const allChapters = [introChapter, ...plotChapters, conclusionChapter].filter(chapter => chapter.content);
        
        state.chapters = allChapters;
        
        // Display chapters
        renderChapters(allChapters);
        
        // Switch to chapter development section
        switchSection(chapterDevelopmentSection);
    } catch (error) {
        console.error('Error developing chapters:', error);
        showError('Development Error', 'There was an error developing chapters. Please try again.');
    } finally {
        // Hide loading indicator
        loadingChapters.classList.add('hidden');
        developSelectedBtn.disabled = false;
    }
}

async function generateChapterContent(chapterType, expandedPrompt, plotData) {
    let prompt = '';
    
    switch (chapterType) {
        case 'introduction':
            prompt = `Write an engaging opening chapter for a story with this concept: "${expandedPrompt}". 
            This should introduce the protagonist, establish the setting, and hint at the central conflict. 
            Keep it under 500 words.`;
            break;
            
        case 'plot':
            prompt = `Write a chapter that develops this plot element: "${plotData.title}: ${plotData.description}" 
            within the context of this story concept: "${expandedPrompt}". 
            This chapter should advance the story, develop characters, and explore the specific plot element mentioned. 
            Keep it under 500 words.`;
            break;
            
        case 'conclusion':
            const plotTitles = plotData.map(p => p.title).join(', ');
            prompt = `Write a resolution chapter for a story with this concept: "${expandedPrompt}" 
            that brings together these plot elements: ${plotTitles}. 
            This chapter should provide a satisfying conclusion while potentially leaving some elements open for interpretation. 
            Keep it under 500 words.`;
            break;
    }
    
    try {
        return await callAnthropicAPI(prompt, CONFIG.systemPrompts.developChapters);
    } catch (error) {
        console.error(`Error generating ${chapterType} chapter:`, error);
        return null;
    }
}

function handleExportStory() {
    if (state.chapters.length === 0) {
        showError('No Content', 'No chapters to export.');
        return;
    }
    
    let storyText = `# ${state.expandedPrompt.split('.')[0]}\n\n`;
    
    state.chapters.forEach(chapter => {
        storyText += `## ${chapter.title}\n\n${chapter.content}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([storyText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-story.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function handleSendToAI() {
    if (state.chapters.length === 0) {
        showError('No Content', 'No chapters to send.');
        return;
    }
    
    // Prepare the story content
    let storyContent = '';
    state.chapters.forEach(chapter => {
        storyContent += `## ${chapter.title}\n\n${chapter.content}\n\n`;
    });
    
    // Show a confirmation dialog
    const confirmed = confirm('This will send your story to Anthropic\'s Claude for further refinement. Continue?');
    
    if (!confirmed) {
        return;
    }
    
    try {
        const prompt = `I've written a story and would like your feedback and suggestions for improvement. Here's my story:

${storyContent}

Please provide:
1. Overall feedback on the story structure, pacing, and coherence
2. Suggestions for improving character development
3. Ideas for enhancing the plot and making it more engaging
4. Any specific sections that could be expanded or refined
5. A revised version of the first chapter as an example of how the writing could be improved`;

        // This would typically send to a backend that handles the API call
        alert('In a production environment, this would send your story to Anthropic\'s Claude API for feedback and refinement. For this demo, we\'ll simulate that the story was sent successfully.');
        
        console.log('Story data that would be sent:', {
            prompt: prompt,
            model: state.model
        });
    } catch (error) {
        console.error('Error sending to AI:', error);
        showError('API Error', 'There was an error sending your story to the AI. Please try again.');
    }
}

// Rendering Functions
function renderPlotSuggestions(suggestions) {
    // Clear existing suggestions
    plotSuggestionsContainer.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const clone = document.importNode(plotSuggestionTemplate.content, true);
        
        const plotElement = clone.querySelector('.plot-suggestion');
        plotElement.dataset.index = index;
        
        const titleElement = clone.querySelector('.plot-title');
        titleElement.textContent = suggestion.title;
        
        const descriptionElement = clone.querySelector('.plot-description');
        descriptionElement.textContent = suggestion.description;
        
        plotSuggestionsContainer.appendChild(clone);
    });
}

function renderChapters(chapters) {
    // Clear existing chapters
    chaptersContainer.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const clone = document.importNode(chapterTemplate.content, true);
        
        const chapterElement = clone.querySelector('.chapter');
        chapterElement.dataset.index = index;
        
        const titleElement = clone.querySelector('.chapter-title');
        titleElement.textContent = chapter.title;
        
        const contentElement = clone.querySelector('.chapter-content');
        contentElement.textContent = chapter.content;
        
        // Add event listeners for chapter actions
        const editBtn = clone.querySelector('.edit-chapter-btn');
        editBtn.addEventListener('click', () => handleEditChapter(index));
        
        const regenerateBtn = clone.querySelector('.regenerate-chapter-btn');
        regenerateBtn.addEventListener('click', () => handleRegenerateChapter(index));
        
        chaptersContainer.appendChild(clone);
    });
}

async function handleEditChapter(index) {
    const chapter = state.chapters[index];
    const newContent = prompt('Edit chapter content:', chapter.content);
    
    if (newContent !== null && newContent.trim() !== '') {
        state.chapters[index].content = newContent;
        renderChapters(state.chapters);
    }
}

async function handleRegenerateChapter(index) {
    const chapter = state.chapters[index];
    const chapterElement = document.querySelector(`.chapter[data-index="${index}"]`);
    
    // Show loading state
    chapterElement.classList.add('loading');
    
    try {
        let newContent;
        
        // Determine chapter type based on index
        if (index === 0) {
            // Introduction chapter
            newContent = await generateChapterContent('introduction', state.expandedPrompt, null);
        } else if (index === state.chapters.length - 1) {
            // Conclusion chapter
            newContent = await generateChapterContent('conclusion', state.expandedPrompt, state.selectedPlots);
        } else {
            // Plot chapter
            const plotIndex = index - 1;
            const plot = state.selectedPlots[plotIndex];
            newContent = await generateChapterContent('plot', state.expandedPrompt, plot);
        }
        
        if (newContent) {
            // Update chapter in state
            state.chapters[index].content = newContent;
            
            // Re-render chapters
            renderChapters(state.chapters);
        }
    } catch (error) {
        console.error('Error regenerating chapter:', error);
        showError('Regeneration Error', 'There was an error regenerating the chapter. Please try again.');
    } finally {
        // Remove loading state
        chapterElement.classList.remove('loading');
    }
}

// Error Handling
function showError(title, message, details = null) {
    errorMessage.textContent = message;
    
    if (details) {
        errorDetails.textContent = details;
        errorDetailsContainer.classList.remove('hidden');
    } else {
        errorDetailsContainer.classList.add('hidden');
    }
    
    errorModal.classList.remove('hidden');
}

function closeErrorModal() {
    errorModal.classList.add('hidden');
}