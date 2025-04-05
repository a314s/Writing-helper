// Application State
const state = {
    apiConfigured: false,
    apiKey: '',
    model: '',
    apiProvider: CONFIG.apiProvider || 'openai', // Default to OpenAI if not specified
    initialPrompt: '',
    expandedPrompt: '',
    selectedPlots: [],
    plotSuggestions: [],
    chapters: []
};

// DOM Elements - Will be initialized in DOMContentLoaded
let apiKeyInput;
let providerSelection;
let modelSelection;
let saveApiConfigBtn;
let apiConfigSection;

let initialPromptTextarea;
let expandPromptBtn;
let expandedPromptContent;
let generatePlotsBtn;
let revisePromptBtn;
let plotSuggestionsContainer;
let regeneratePlotsBtn;
let developSelectedBtn;
let chaptersContainer;
let exportStoryBtn;
let sendToAiBtn;

// Loading indicators
let loadingPrompt;
let loadingPlots;
let loadingChapters;

// Section elements
let promptSection;
let expandedPromptSection;
let plotSuggestionsSection;
let chapterDevelopmentSection;

// Templates
let plotSuggestionTemplate;
let chapterTemplate;

// Error modal elements
let errorModal;
let errorMessage;
let errorDetails;
let errorDetailsContainer;
let closeErrorBtn;
let closeModalBtn;

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log('DOM fully loaded');
    
    // Initialize all DOM elements
    initializeDOMElements();
    
    // Check if elements exist
    console.log('API config section exists:', !!apiConfigSection);
    console.log('Save API config button exists:', !!saveApiConfigBtn);
    console.log('Expand prompt button exists:', !!expandPromptBtn);
    
    // Set default model
    if (CONFIG && CONFIG.anthropic && CONFIG.anthropic.models) {
        state.model = CONFIG.anthropic.models.sonnet; // Default to Sonnet
    }
    
    // Always start with the API configuration section
    switchSection(apiConfigSection);
    console.log('Switched to API config section');
    
    // Load saved API configuration
    loadApiConfig();
    
    // Add event listeners only if elements exist
    addEventListeners();
}

function initializeDOMElements() {
    // DOM Elements
    apiKeyInput = document.getElementById('api-key');
    providerSelection = document.getElementById('provider-selection');
    modelSelection = document.getElementById('model-selection');
    saveApiConfigBtn = document.getElementById('save-api-config-btn');
    apiConfigSection = document.getElementById('api-config-section');

    initialPromptTextarea = document.getElementById('initial-prompt');
    expandPromptBtn = document.getElementById('expand-prompt-btn');
    expandedPromptContent = document.getElementById('expanded-prompt-content');
    generatePlotsBtn = document.getElementById('generate-plots-btn');
    revisePromptBtn = document.getElementById('revise-prompt-btn');
    plotSuggestionsContainer = document.getElementById('plot-suggestions-container');
    regeneratePlotsBtn = document.getElementById('regenerate-plots-btn');
    developSelectedBtn = document.getElementById('develop-selected-btn');
    chaptersContainer = document.getElementById('chapters-container');
    exportStoryBtn = document.getElementById('export-story-btn');
    sendToAiBtn = document.getElementById('send-to-ai-btn');

    // Loading indicators
    loadingPrompt = document.getElementById('loading-prompt');
    loadingPlots = document.getElementById('loading-plots');
    loadingChapters = document.getElementById('loading-chapters');

    // Section elements
    promptSection = document.getElementById('prompt-section');
    expandedPromptSection = document.getElementById('expanded-prompt-section');
    plotSuggestionsSection = document.getElementById('plot-suggestions-section');
    chapterDevelopmentSection = document.getElementById('chapter-development-section');

    // Templates
    plotSuggestionTemplate = document.getElementById('plot-suggestion-template');
    chapterTemplate = document.getElementById('chapter-template');

    // Error modal elements
    errorModal = document.getElementById('error-modal');
    errorMessage = document.getElementById('error-message');
    errorDetails = document.getElementById('error-details');
    errorDetailsContainer = document.getElementById('error-details-container');
    closeErrorBtn = document.getElementById('close-error-btn');
    closeModalBtn = document.querySelector('.close-modal');
    
    // Set provider selection to match CONFIG
    if (providerSelection) {
        providerSelection.value = CONFIG.apiProvider;
        
        // Add event listener to update models when provider changes
        providerSelection.addEventListener('change', function() {
            CONFIG.apiProvider = this.value;
            state.apiProvider = this.value;
            updateModelSelection();
        });
    }
    
    // Initialize model selection based on current provider
    updateModelSelection();
}

// Function to update model selection dropdown based on selected provider
function updateModelSelection() {
    if (!modelSelection) return;
    
    // Clear existing options
    modelSelection.innerHTML = '';
    
    // Add options based on selected provider
    if (CONFIG.apiProvider === 'openai') {
        // Add OpenAI model options
        if (CONFIG.openai && CONFIG.openai.models) {
            const models = CONFIG.openai.models;
            for (const key in models) {
                const option = document.createElement('option');
                option.value = models[key];
                option.textContent = `${key} (${models[key]})`;
                modelSelection.appendChild(option);
            }
        }
    } else {
        // Add Anthropic model options
        if (CONFIG.anthropic && CONFIG.anthropic.models) {
            const models = CONFIG.anthropic.models;
            for (const key in models) {
                const option = document.createElement('option');
                option.value = models[key];
                option.textContent = `${key} (${models[key]})`;
                modelSelection.appendChild(option);
            }
        }
    }
}

function addEventListeners() {
    // API Configuration
    if (saveApiConfigBtn) {
        console.log('Adding click listener to Save Configuration button');
        saveApiConfigBtn.addEventListener('click', function() {
            console.log('Save Configuration button clicked');
            handleSaveApiConfig();
        });
    } else {
        console.error('Save API config button not found');
    }
    
    // Initial prompt expansion
    if (expandPromptBtn) {
        console.log('Adding click listener to Expand Prompt button');
        expandPromptBtn.addEventListener('click', function() {
            console.log('Expand Prompt button clicked');
            handleExpandPrompt();
        });
    } else {
        console.error('Expand prompt button not found');
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
}

// API Configuration Functions
function loadApiConfig() {
    // Check if we have a saved provider preference
    const savedProvider = localStorage.getItem('api_provider');
    if (savedProvider) {
        CONFIG.apiProvider = savedProvider;
        console.log('Using saved API provider:', CONFIG.apiProvider);
    }
    
    // Load API key and model based on the provider
    let savedApiKey, savedModel;
    
    if (CONFIG.apiProvider === 'openai') {
        savedApiKey = localStorage.getItem('openai_api_key');
        savedModel = localStorage.getItem('openai_model');
        
        // Update model dropdown with OpenAI models
        if (modelSelection) {
            // Clear existing options
            modelSelection.innerHTML = '';
            
            // Add OpenAI model options
            if (CONFIG.openai && CONFIG.openai.models) {
                const models = CONFIG.openai.models;
                for (const key in models) {
                    const option = document.createElement('option');
                    option.value = models[key];
                    option.textContent = `${key} (${models[key]})`;
                    modelSelection.appendChild(option);
                }
            }
        }
    } else {
        // Default to Anthropic
        savedApiKey = localStorage.getItem('anthropic_api_key');
        savedModel = localStorage.getItem('anthropic_model');
        
        // Update model dropdown with Anthropic models
        if (modelSelection) {
            // Clear existing options
            modelSelection.innerHTML = '';
            
            // Add Anthropic model options
            if (CONFIG.anthropic && CONFIG.anthropic.models) {
                const models = CONFIG.anthropic.models;
                for (const key in models) {
                    const option = document.createElement('option');
                    option.value = models[key];
                    option.textContent = `${key} (${models[key]})`;
                    modelSelection.appendChild(option);
                }
            }
        }
    }
    
    console.log('Loading saved API configuration');
    console.log('API Provider:', CONFIG.apiProvider);
    console.log('Saved model:', savedModel);
    
    // Clear any previous API key
    if (apiKeyInput) {
        apiKeyInput.value = '';
    }
    state.apiConfigured = false;
    
    if (savedApiKey) {
        console.log('API key found in local storage');
        if (apiKeyInput) {
            apiKeyInput.value = savedApiKey;
        }
        state.apiKey = savedApiKey;
        state.apiConfigured = true;
    } else {
        console.log('No API key found in local storage');
        // Force showing the API configuration section
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
        return;
    }
    
    if (savedModel) {
        console.log('Setting model to:', savedModel);
        
        if (modelSelection) {
            // Check if the saved model exists in the dropdown
            const modelExists = Array.from(modelSelection.options).some(option => option.value === savedModel);
            
            if (modelExists) {
                modelSelection.value = savedModel;
                state.model = savedModel;
            } else {
                // If the saved model doesn't exist (e.g., after an update), use the default
                console.log('Saved model not found in options, using default');
                if (CONFIG.apiProvider === 'openai' && CONFIG.openai.defaultModel) {
                    state.model = CONFIG.openai.defaultModel;
                } else {
                    state.model = modelSelection.value;
                }
            }
        } else {
            state.model = savedModel;
        }
    } else {
        // Use the default model based on provider
        if (CONFIG.apiProvider === 'openai' && CONFIG.openai.defaultModel) {
            state.model = CONFIG.openai.defaultModel;
        } else if (modelSelection) {
            state.model = modelSelection.value;
        }
    }
    
    // If API is configured, show the prompt section
    if (state.apiConfigured) {
        console.log('API is configured, showing prompt section');
        if (promptSection) {
            switchSection(promptSection);
        }
    } else {
        console.log('API is not configured, showing API configuration section');
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
    }
}

function handleSaveApiConfig() {
    console.log('handleSaveApiConfig function called');
    
    // Check if DOM elements exist
    if (!apiKeyInput) {
        console.error('API key input element not found');
        alert('Error: API key input element not found');
        return;
    }
    
    if (!providerSelection) {
        console.error('Provider selection element not found');
        alert('Error: Provider selection element not found');
        return;
    }
    
    if (!modelSelection) {
        console.error('Model selection element not found');
        alert('Error: Model selection element not found');
        return;
    }
    
    // Get the selected provider
    const provider = providerSelection.value;
    CONFIG.apiProvider = provider;
    state.apiProvider = provider;
    
    const apiKey = apiKeyInput.value.trim();
    // Get the selected model value
    let model = modelSelection.value;
    
    console.log('API Key length:', apiKey.length);
    console.log('Selected model:', model);
    
    // Validate API key
    if (!apiKey) {
        console.log('No API key provided');
        alert('API Key Required: Please enter your API key to continue.');
        showError('API Key Required', 'Please enter your API key to continue.');
        return;
    }
    
    // Validate API key based on provider
    if (CONFIG.apiProvider === 'anthropic') {
        // Validate Anthropic API key format (should start with sk-ant-)
        if (!apiKey.startsWith('sk-ant-')) {
            console.error('Invalid Anthropic API key format');
            alert('Invalid API Key: The Anthropic API key should start with "sk-ant-". Please check your API key.');
            showError('Invalid API Key', 'The Anthropic API key should start with "sk-ant-". Please check your API key.');
            return;
        }
    } else if (CONFIG.apiProvider === 'openai') {
        // Validate OpenAI API key format (should start with sk-)
        if (!apiKey.startsWith('sk-')) {
            console.error('Invalid OpenAI API key format');
            alert('Invalid API Key: The OpenAI API key should start with "sk-". Please check your API key.');
            showError('Invalid API Key', 'The OpenAI API key should start with "sk-". Please check your API key.');
            return;
        }
    }
    
    // Validate API key length (should be at least 30 characters)
    if (apiKey.length < 30) {
        console.error('API key too short');
        alert('Invalid API Key: The API key appears to be too short. Please check your API key.');
        showError('Invalid API Key', 'The API key appears to be too short. Please check your API key.');
        return;
    }
    
    // Validate model selection
    if (!model) {
        console.error('No model selected');
        
        // Use default model if available
        if (CONFIG.apiProvider === 'openai' && CONFIG.openai.defaultModel) {
            model = CONFIG.openai.defaultModel;
            console.log('Using default model:', model);
        } else {
            alert('Model Required: Please select an AI model to continue.');
            showError('Model Required', 'Please select an AI model to continue.');
            return;
        }
    }
    
    console.log('Saving API configuration with model:', model);
    
    try {
        // Save to local storage based on provider
        if (CONFIG.apiProvider === 'anthropic') {
            localStorage.setItem('anthropic_api_key', apiKey);
            localStorage.setItem('anthropic_model', model);
        } else if (CONFIG.apiProvider === 'openai') {
            localStorage.setItem('openai_api_key', apiKey);
            localStorage.setItem('openai_model', model);
        }
        localStorage.setItem('api_provider', CONFIG.apiProvider); // Save the provider
        console.log('Saved to localStorage successfully');
    } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        alert('Error saving to localStorage: ' + storageError.message);
        showError('Storage Error', 'Error saving to localStorage: ' + storageError.message);
        return;
    }
    
    // Update state
    state.apiKey = apiKey;
    state.model = model;
    state.apiConfigured = true;
    
    // Update CONFIG
    if (CONFIG.apiProvider === 'anthropic' && CONFIG.anthropic) {
        CONFIG.anthropic.apiKey = apiKey;
    } else if (CONFIG.apiProvider === 'openai' && CONFIG.openai) {
        CONFIG.openai.apiKey = apiKey;
    }
    
    // Show success message
    alert(`${CONFIG.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API configuration saved successfully! Testing connection now...`);
    
    // Switch to prompt section
    if (!promptSection) {
        console.error('Prompt section element not found');
        alert('Error: Prompt section element not found');
        return;
    }
    
    console.log('Switching to prompt section');
    switchSection(promptSection);
    
    // Test API connection
    console.log('Testing API connection');
    testApiConnection();
}

// Function to test API connection
async function testApiConnection() {
    // Determine which API to test based on configuration
    if (CONFIG.apiProvider === 'openai') {
        return testOpenAIConnection();
    } else {
        return testAnthropicConnection();
    }
}

// Function to test OpenAI API connection
async function testOpenAIConnection() {
    try {
        console.log('testOpenAIConnection function called');
        
        // Check if CONFIG is defined
        if (!CONFIG || !CONFIG.openai || !CONFIG.openai.apiUrl) {
            console.error('CONFIG or CONFIG.openai.apiUrl is not defined');
            alert('Error: API configuration is not properly defined');
            return false;
        }
        
        // Check if API key is defined
        if (!state.apiKey) {
            console.error('API key is not defined');
            alert('Error: API key is not defined. Please enter a valid API key.');
            return false;
        }
        
        // Check if model is defined
        if (!state.model) {
            console.log('Model is not defined, using default');
            state.model = CONFIG.openai.defaultModel;
        }
        
        // Show a message to the user
        alert('Testing OpenAI API connection... This may take a moment.');
        
        console.log('Making test API call to:', CONFIG.openai.apiUrl);
        console.log('Using API key (first 10 chars):', state.apiKey.substring(0, 10) + '...');
        console.log('Using model:', state.model);
        
        // Check for network connectivity
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        
        const response = await fetch(CONFIG.openai.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`
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
        
        // Handle non-JSON responses
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Received non-JSON response: ${textResponse}`);
        }
        
        if (CONFIG.debug) {
            console.log('API test response:', responseData);
        }
        
        if (!response.ok) {
            console.error('API test failed:', responseData);
            
            let errorMessage = 'Could not connect to the OpenAI API. Please check your API key and try again.';
            if (responseData && responseData.error && responseData.error.message) {
                errorMessage = responseData.error.message;
            }
            
            alert('API Connection Failed: ' + errorMessage);
            showError('API Connection Failed', errorMessage, JSON.stringify(responseData, null, 2));
            
            // Reset API configuration
            state.apiConfigured = false;
            if (apiConfigSection) {
                switchSection(apiConfigSection);
            }
            return false;
        }
        
        // Check if the response has the expected structure
        if (!responseData.choices || responseData.choices.length === 0) {
            console.error('Unexpected API response format:', responseData);
            alert('API Connection Warning: Unexpected response format from API. The API may have changed.');
            // Continue anyway since the connection was successful
        } else {
            console.log('API response content:', responseData.choices[0].message);
        }
        
        console.log('API test successful:', responseData);
        alert('OpenAI API connection successful! You can now use the AI Story Developer.');
        return true;
    } catch (error) {
        console.error('API test error:', error);
        
        let errorMessage = 'Error testing connection to the OpenAI API: ' + error.message;
        
        // Handle specific error types
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Failed to connect to the API. Please check your internet connection and API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network error: Unable to reach the API server.';
        }
        
        alert('API Connection Error: ' + errorMessage);
        showError('API Connection Error', errorMessage, error.stack || error.toString());
        
        // Reset API configuration
        state.apiConfigured = false;
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
        return false;
    }
}

// Function to test Anthropic API connection
async function testAnthropicConnection() {
    try {
        console.log('testAnthropicConnection function called');
        
        // Check if CONFIG is defined
        if (!CONFIG || !CONFIG.anthropic || !CONFIG.anthropic.apiUrl) {
            console.error('CONFIG or CONFIG.anthropic.apiUrl is not defined');
            alert('Error: API configuration is not properly defined');
            return false;
        }
        
        // Check if API key is defined
        if (!state.apiKey) {
            console.error('API key is not defined');
            alert('Error: API key is not defined. Please enter a valid API key.');
            return false;
        }
        
        // Check if model is defined
        if (!state.model) {
            console.error('Model is not defined');
            alert('Error: Model is not defined. Please select a valid model.');
            return false;
        }
        
        // Show a message to the user
        alert('Testing Anthropic API connection... This may take a moment.');
        
        console.log('Making test API call to:', CONFIG.anthropic.apiUrl);
        console.log('Using API key (first 10 chars):', state.apiKey.substring(0, 10) + '...');
        console.log('Using model:', state.model);
        
        // Check for network connectivity
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        
        const response = await fetch(CONFIG.anthropic.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': state.apiKey,
                'anthropic-version': '2023-06-01' // Keep this version for backward compatibility
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
        
        // Handle non-JSON responses
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Received non-JSON response: ${textResponse}`);
        }
        
        if (CONFIG.debug) {
            console.log('API test response:', responseData);
        }
        
        if (!response.ok) {
            console.error('API test failed:', responseData);
            
            let errorMessage = 'Could not connect to the Anthropic API. Please check your API key and try again.';
            if (responseData && responseData.error && responseData.error.message) {
                errorMessage = responseData.error.message;
            }
            
            alert('API Connection Failed: ' + errorMessage);
            showError('API Connection Failed', errorMessage, JSON.stringify(responseData, null, 2));
            
            // Reset API configuration
            state.apiConfigured = false;
            if (apiConfigSection) {
                switchSection(apiConfigSection);
            }
            return false;
        }
        
        // Check if the response has the expected structure
        if (!responseData.content || responseData.content.length === 0) {
            console.error('Unexpected API response format:', responseData);
            alert('API Connection Warning: Unexpected response format from API. The API may have changed.');
            // Continue anyway since the connection was successful
        } else {
            console.log('API response content:', responseData.content);
        }
        
        console.log('API test successful:', responseData);
        alert('Anthropic API connection successful! You can now use the AI Story Developer.');
        return true;
    } catch (error) {
        console.error('API test error:', error);
        
        let errorMessage = 'Error testing connection to the Anthropic API: ' + error.message;
        
        // Handle specific error types
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Failed to connect to the API. Please check your internet connection and API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network error: Unable to reach the API server.';
        }
        
        alert('API Connection Error: ' + errorMessage);
        showError('API Connection Error', errorMessage, error.stack || error.toString());
        
        // Reset API configuration
        state.apiConfigured = false;
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
        return false;
    }
}

// Section Navigation
function switchSection(sectionToShow) {
    // Check if sectionToShow exists
    if (!sectionToShow) {
        console.error('Cannot switch to null section');
        return;
    }

    // Hide all sections with null checks
    if (apiConfigSection) {
        apiConfigSection.classList.remove('active-section');
        apiConfigSection.classList.add('hidden-section');
    }
    
    if (promptSection) {
        promptSection.classList.remove('active-section');
        promptSection.classList.add('hidden-section');
    }
    
    if (expandedPromptSection) {
        expandedPromptSection.classList.remove('active-section');
        expandedPromptSection.classList.add('hidden-section');
    }
    
    if (plotSuggestionsSection) {
        plotSuggestionsSection.classList.remove('active-section');
        plotSuggestionsSection.classList.add('hidden-section');
    }
    
    if (chapterDevelopmentSection) {
        chapterDevelopmentSection.classList.remove('active-section');
        chapterDevelopmentSection.classList.add('hidden-section');
    }
    
    // Show the selected section
    sectionToShow.classList.remove('hidden-section');
    sectionToShow.classList.add('active-section');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// API Call Functions
async function callAPI(prompt, systemPrompt) {
    // Determine which API to use based on configuration
    if (CONFIG.apiProvider === 'openai') {
        return callOpenAIAPI(prompt, systemPrompt);
    } else {
        return callAnthropicAPI(prompt, systemPrompt);
    }
}

async function callOpenAIAPI(prompt, systemPrompt) {
    // Debug logging
    if (CONFIG.debug) {
        console.log('=== OPENAI API CALL START ===');
        console.log('API Key configured:', state.apiConfigured);
        console.log('Model:', state.model);
    }
    
    // Check if API is configured
    if (!state.apiConfigured) {
        showError('API Not Configured', 'Please configure your OpenAI API key first.');
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
        return null;
    }
    
    // Check if CONFIG is properly defined
    if (!CONFIG || !CONFIG.openai || !CONFIG.openai.apiUrl) {
        console.error('CONFIG or CONFIG.openai.apiUrl is not defined');
        showError('Configuration Error', 'API configuration is not properly defined. Please check your config.js file.');
        return null;
    }
    
    // Check if model is defined
    if (!state.model) {
        console.error('Model is not defined');
        state.model = CONFIG.openai.defaultModel; // Use default model if not set
        console.log('Using default model:', state.model);
    }
    
    // Log API call details for debugging
    if (CONFIG.debug) {
        console.log('Making OpenAI API call with model:', state.model);
        console.log('System prompt:', systemPrompt);
        console.log('User prompt:', prompt);
    }
    
    try {
        // Prepare messages array for OpenAI
        const messages = [];
        
        // Add system prompt if provided
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }
        
        // Add user message
        messages.push({
            role: 'user',
            content: prompt
        });
        
        const requestBody = {
            model: state.model,
            max_tokens: CONFIG.openai.maxTokens || 4000,
            messages: messages
        };
        
        if (CONFIG.debug) {
            console.log('Request body:', JSON.stringify(requestBody, null, 2));
            console.log('API URL:', CONFIG.openai.apiUrl);
            console.log('API Key (first 10 chars):', state.apiKey.substring(0, 10) + '...');
        }
        
        // Check for network connectivity
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        
        const response = await fetch(CONFIG.openai.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        // Handle non-JSON responses
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Received non-JSON response: ${textResponse}`);
        }
        
        if (CONFIG.debug) {
            console.log('API Response:', responseData);
            console.log('=== OPENAI API CALL END ===');
        }
        
        if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
        }
        
        // Check if the response has the expected structure
        if (!responseData.choices || responseData.choices.length === 0) {
            throw new Error('Unexpected API response format: ' + JSON.stringify(responseData));
        }
        
        // Extract text from the response
        const messageContent = responseData.choices[0].message.content;
        return messageContent;
    } catch (error) {
        console.error('=== OPENAI API ERROR ===');
        console.error('API Error:', error);
        
        let errorMsg = 'There was an error calling the OpenAI API.';
        let errorDetailsText = '';
        
        // Handle specific error types
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMsg = 'Network error: Failed to connect to the API. Please check your internet connection and API endpoint.';
            errorDetailsText = 'This may be due to network connectivity issues, CORS restrictions, or an incorrect API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMsg = 'Network error: Unable to reach the API server.';
            errorDetailsText = error.message;
        } else {
            // Try to parse error message as JSON
            try {
                const errorObj = JSON.parse(error.message);
                errorMsg = errorObj.error?.message || errorMsg;
                errorDetailsText = JSON.stringify(errorObj, null, 2);
            } catch (e) {
                errorDetailsText = error.message || error.toString();
            }
        }
        
        showError('API Error', errorMsg, errorDetailsText);
        return null;
    }
}

async function callAnthropicAPI(prompt, systemPrompt) {
    // Debug logging
    if (CONFIG.debug) {
        console.log('=== ANTHROPIC API CALL START ===');
        console.log('API Key configured:', state.apiConfigured);
        console.log('Model:', state.model);
    }
    
    // Check if API is configured
    if (!state.apiConfigured) {
        showError('API Not Configured', 'Please configure your Anthropic API key first.');
        if (apiConfigSection) {
            switchSection(apiConfigSection);
        }
        return null;
    }
    
    // Check if CONFIG is properly defined
    if (!CONFIG || !CONFIG.anthropic || !CONFIG.anthropic.apiUrl) {
        console.error('CONFIG or CONFIG.anthropic.apiUrl is not defined');
        showError('Configuration Error', 'API configuration is not properly defined. Please check your config.js file.');
        return null;
    }
    
    // Check if model is defined
    if (!state.model) {
        console.error('Model is not defined');
        showError('Configuration Error', 'API model is not properly defined. Please check your configuration.');
        return null;
    }
    
    // Log API call details for debugging
    if (CONFIG.debug) {
        console.log('Making Anthropic API call with model:', state.model);
        console.log('System prompt:', systemPrompt);
        console.log('User prompt:', prompt);
    }
    
    try {
        const requestBody = {
            model: state.model,
            max_tokens: CONFIG.anthropic.maxTokens || 4000,
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
            console.log('API URL:', CONFIG.anthropic.apiUrl);
            console.log('API Key (first 10 chars):', state.apiKey.substring(0, 10) + '...');
        }
        
        // Check for network connectivity
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        
        const response = await fetch(CONFIG.anthropic.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': state.apiKey,
                'anthropic-version': '2023-06-01' // Keep this version for backward compatibility
            },
            body: JSON.stringify(requestBody)
        });
        
        // Handle non-JSON responses
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const textResponse = await response.text();
            throw new Error(`Received non-JSON response: ${textResponse}`);
        }
        
        if (CONFIG.debug) {
            console.log('API Response:', responseData);
            console.log('=== ANTHROPIC API CALL END ===');
        }
        
        if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
        }
        
        // Check if the response has the expected structure based on latest API format
        if (!responseData.content || responseData.content.length === 0) {
            throw new Error('Unexpected API response format: ' + JSON.stringify(responseData));
        }
        
        // Extract text from the content array based on latest API format
        const contentBlock = responseData.content[0];
        if (contentBlock.type === 'text' && contentBlock.text) {
            return contentBlock.text;
        } else {
            throw new Error('Unexpected content format in API response: ' + JSON.stringify(contentBlock));
        }
    } catch (error) {
        console.error('=== ANTHROPIC API ERROR ===');
        console.error('API Error:', error);
        
        let errorMsg = 'There was an error calling the Anthropic API.';
        let errorDetailsText = '';
        
        // Handle specific error types
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMsg = 'Network error: Failed to connect to the API. Please check your internet connection and API endpoint.';
            errorDetailsText = 'This may be due to network connectivity issues, CORS restrictions, or an incorrect API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMsg = 'Network error: Unable to reach the API server.';
            errorDetailsText = error.message;
        } else {
            // Try to parse error message as JSON
            try {
                const errorObj = JSON.parse(error.message);
                errorMsg = errorObj.error?.message || errorMsg;
                errorDetailsText = JSON.stringify(errorObj, null, 2);
            } catch (e) {
                errorDetailsText = error.message || error.toString();
            }
        }
        
        showError('API Error', errorMsg, errorDetailsText);
        return null;
    }
}

// Handler Functions
async function handleExpandPrompt() {
    console.log('handleExpandPrompt function called');
    
    // Check if required DOM elements exist
    if (!initialPromptTextarea) {
        console.error('Initial prompt textarea not found');
        alert('Error: Initial prompt textarea not found');
        return;
    }
    
    const prompt = initialPromptTextarea.value.trim();
    console.log('Prompt text:', prompt);
    
    if (!prompt) {
        console.log('No prompt text provided');
        alert('Input Required: Please enter a story prompt first.');
        showError('Input Required', 'Please enter a story prompt first.');
        return;
    }
    
    state.initialPrompt = prompt;
    
    // Show loading indicator if it exists
    if (loadingPrompt) {
        loadingPrompt.classList.remove('hidden');
    }
    
    // Disable button if it exists
    if (expandPromptBtn) {
        expandPromptBtn.disabled = true;
    }
    
    try {
        // Call Anthropic API to expand prompt
        if (CONFIG.debug) {
            console.log('Expanding prompt:', prompt);
        }
        
        const expandedPrompt = await callAPI(
            `Expand this story prompt into a more detailed concept: "${prompt}"`,
            CONFIG.systemPrompts.expandPrompt
        );
        
        if (expandedPrompt) {
            state.expandedPrompt = expandedPrompt;
            
            // Display expanded prompt if element exists
            if (expandedPromptContent) {
                expandedPromptContent.innerHTML = expandedPrompt;
            } else {
                console.error('Expanded prompt content element not found');
                alert('Error: Could not display expanded prompt');
            }
            
            // Switch to expanded prompt section if it exists
            if (expandedPromptSection) {
                switchSection(expandedPromptSection);
            } else {
                console.error('Expanded prompt section not found');
            }
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
            if (apiConfigSection) {
                switchSection(apiConfigSection);
            }
        } else {
            errorMsg = 'API Error: ' + (error.message || 'Unknown error occurred');
        }
        
        // Always show error to user
        alert('Error: ' + errorMsg);
        showError('Expansion Error', errorMsg, error.message || error.toString());
    } finally {
        // Hide loading indicator if it exists
        if (loadingPrompt) {
            loadingPrompt.classList.add('hidden');
        }
        
        // Enable button if it exists
        if (expandPromptBtn) {
            expandPromptBtn.disabled = false;
        }
    }
}

async function handleGeneratePlots() {
    // Show loading indicator
    loadingPlots.classList.remove('hidden');
    generatePlotsBtn.disabled = true;
    
    try {
        // Call Anthropic API to generate plot suggestions
        const plotSuggestionsText = await callAPI(
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
        const plotSuggestionsText = await callAPI(
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
        return await callAPI(prompt, CONFIG.systemPrompts.developChapters);
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
    const confirmed = confirm(`This will send your story to ${CONFIG.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'}'s AI for further refinement. Continue?`);
    
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
        alert(`In a production environment, this would send your story to ${CONFIG.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'}'s API for feedback and refinement. For this demo, we'll simulate that the story was sent successfully.`);
        
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
    // Check if container and template exist
    if (!plotSuggestionsContainer) {
        console.error('Plot suggestions container not found');
        return;
    }
    
    if (!plotSuggestionTemplate) {
        console.error('Plot suggestion template not found');
        return;
    }
    
    // Clear existing suggestions
    plotSuggestionsContainer.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const clone = document.importNode(plotSuggestionTemplate.content, true);
        
        const plotElement = clone.querySelector('.plot-suggestion');
        if (!plotElement) {
            console.error('Plot element not found in template');
            return;
        }
        plotElement.dataset.index = index;
        
        const titleElement = clone.querySelector('.plot-title');
        if (titleElement) {
            titleElement.textContent = suggestion.title;
        }
        
        const descriptionElement = clone.querySelector('.plot-description');
        if (descriptionElement) {
            descriptionElement.textContent = suggestion.description;
        }
        
        plotSuggestionsContainer.appendChild(clone);
    });
}

function renderChapters(chapters) {
    // Check if container and template exist
    if (!chaptersContainer) {
        console.error('Chapters container not found');
        return;
    }
    
    if (!chapterTemplate) {
        console.error('Chapter template not found');
        return;
    }
    
    // Clear existing chapters
    chaptersContainer.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const clone = document.importNode(chapterTemplate.content, true);
        
        const chapterElement = clone.querySelector('.chapter');
        if (!chapterElement) {
            console.error('Chapter element not found in template');
            return;
        }
        chapterElement.dataset.index = index;
        
        const titleElement = clone.querySelector('.chapter-title');
        if (titleElement) {
            titleElement.textContent = chapter.title;
        }
        
        const contentElement = clone.querySelector('.chapter-content');
        if (contentElement) {
            contentElement.textContent = chapter.content;
        }
        
        // Add event listeners for chapter actions
        const editBtn = clone.querySelector('.edit-chapter-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => handleEditChapter(index));
        }
        
        const regenerateBtn = clone.querySelector('.regenerate-chapter-btn');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => handleRegenerateChapter(index));
        }
        
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
    // Check if error elements exist before trying to use them
    if (!errorMessage || !errorDetails || !errorDetailsContainer || !errorModal) {
        console.error('Error modal elements not initialized properly');
        alert(`Error: ${message}`);
        return;
    }

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