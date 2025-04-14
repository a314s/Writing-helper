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
    chapters: [],
    // Editor state
    editor: {
        currentFile: null,
        currentFilename: 'Untitled',
        content: '',
        isDirty: false,
        selectionStart: 0,
        selectionEnd: 0,
        referenceDoc: {
            characters: [],
            paragraphSummaries: [],
            style: ''
        }
    },
    tokenLimit: 0 // New state property for token limit
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
let editorSection;

// Templates
let plotSuggestionTemplate;
let chapterTemplate;
let characterItemTemplate;
let paragraphSummaryTemplate;

// Error modal elements
let errorModal;
let errorMessage;
let errorDetails;
let errorDetailsContainer;
let closeErrorBtn;
let closeModalBtn;

// Editor elements
let editorContent;
let currentFilename;
let saveStatus;
let newFileBtn;
let openFileBtn;
let saveFileBtn;
let fileInput;
let boldBtn;
let italicBtn;
let underlineBtn;
let headingBtn;
let headingLevel;
let undoBtn;
let redoBtn;
let aiAssistBtn;
let aiAssistType;
let characterList;
let paragraphSummaries;
let storyStyle;
let storyMetadata;
let aiAssistModal;
let aiAssistLoading;
let aiAssistResult;
let applyAiSuggestionBtn;
let cancelAiSuggestionBtn;
let fileSaveModal;
let saveFilename;
let confirmSaveBtn;
let cancelSaveBtn;
let accordionHeaders;

// Version Control UI elements
let vcCommitMessage;
let vcCommitBtn;
let vcBranchName;
let vcCreateBranchBtn;
let vcBranchSwitcher;
let vcHistoryList;

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log('Initializing app...');
    
    // Initialize DOM elements
    initializeDOMElements();
    
    // Add event listeners
    addEventListeners();
    
    // Load API configuration
    loadApiConfig();
    
    // Set initial section
    const initialSection = document.querySelector('.active-section') || promptSection;
    switchSection(initialSection);
    
    // Set active nav link for initial section
    const initialSectionId = initialSection.id;
    const initialNavLink = document.querySelector(`nav a[data-section="${initialSectionId}"]`);
    if (initialNavLink) {
        initialNavLink.classList.add('active');
    }
    
    // Initialize Version Control UI
    initializeVersionControlUI();
    
    console.log('App initialized');
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
    editorSection = document.getElementById('editor-section');

    // Templates
    plotSuggestionTemplate = document.getElementById('plot-suggestion-template');
    chapterTemplate = document.getElementById('chapter-template');
    characterItemTemplate = document.getElementById('character-item-template');
    paragraphSummaryTemplate = document.getElementById('paragraph-summary-template');

    // Error modal elements
    errorModal = document.getElementById('error-modal');
    errorMessage = document.getElementById('error-message');
    errorDetails = document.getElementById('error-details');
    errorDetailsContainer = document.getElementById('error-details-container');
    closeErrorBtn = document.getElementById('close-error-btn');
    closeModalBtn = document.querySelector('.close-modal');
    
    // Editor elements
    editorContent = document.getElementById('editor-content');
    currentFilename = document.getElementById('current-filename');
    saveStatus = document.getElementById('save-status');
    newFileBtn = document.getElementById('new-file-btn');
    openFileBtn = document.getElementById('open-file-btn');
    saveFileBtn = document.getElementById('save-file-btn');
    fileInput = document.getElementById('file-input');
    boldBtn = document.getElementById('bold-btn');
    italicBtn = document.getElementById('italic-btn');
    underlineBtn = document.getElementById('underline-btn');
    headingBtn = document.getElementById('heading-btn');
    headingLevel = document.getElementById('heading-level');
    undoBtn = document.getElementById('undo-btn');
    redoBtn = document.getElementById('redo-btn');
    aiAssistBtn = document.getElementById('ai-assist-btn');
    aiAssistType = document.getElementById('ai-assist-type');
    characterList = document.getElementById('character-list');
    paragraphSummaries = document.getElementById('paragraph-summaries');
    storyStyle = document.getElementById('story-style');
    storyMetadata = document.getElementById('story-metadata');
    aiAssistModal = document.getElementById('ai-assist-modal');
    aiAssistLoading = document.getElementById('ai-assist-loading');
    aiAssistResult = document.getElementById('ai-assist-result');
    applyAiSuggestionBtn = document.getElementById('apply-ai-suggestion-btn');
    cancelAiSuggestionBtn = document.getElementById('cancel-ai-suggestion-btn');
    fileSaveModal = document.getElementById('file-save-modal');
    saveFilename = document.getElementById('save-filename');
    confirmSaveBtn = document.getElementById('confirm-save-btn');
    cancelSaveBtn = document.getElementById('cancel-save-btn');
    accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Version Control UI elements
    vcCommitMessage = document.getElementById('vc-commit-message');
    vcCommitBtn = document.getElementById('vc-commit-btn');
    vcBranchName = document.getElementById('vc-branch-name');
    vcCreateBranchBtn = document.getElementById('vc-create-branch-btn');
    vcBranchSwitcher = document.getElementById('vc-branch-switcher');
    vcHistoryList = document.getElementById('vc-history-list');
    
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
        saveApiConfigBtn.addEventListener('click', handleSaveApiConfig);
    }
    
    // Provider selection change
    if (providerSelection) {
        providerSelection.addEventListener('change', updateModelSelection);
    }
    
    // Prompt Section
    if (expandPromptBtn) {
        expandPromptBtn.addEventListener('click', handleExpandPrompt);
    }
    
    // Expanded Prompt Section
    if (generatePlotsBtn) {
        generatePlotsBtn.addEventListener('click', handleGeneratePlots);
    }
    
    if (revisePromptBtn) {
        revisePromptBtn.addEventListener('click', () => {
            switchSection(promptSection);
        });
    }
    
    // Plot Suggestions Section
    if (regeneratePlotsBtn) {
        regeneratePlotsBtn.addEventListener('click', handleRegeneratePlots);
    }
    
    if (developSelectedBtn) {
        developSelectedBtn.addEventListener('click', handleDevelopSelected);
    }
    
    // Chapter Development Section
    if (exportStoryBtn) {
        exportStoryBtn.addEventListener('click', handleExportStory);
    }
    
    if (sendToAiBtn) {
        sendToAiBtn.addEventListener('click', handleSendToAI);
    }
    
    // Error Modal
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', closeErrorModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeErrorModal);
    }
    
    // Editor Event Listeners
    if (newFileBtn) {
        newFileBtn.addEventListener('click', handleNewFile);
    }
    
    if (openFileBtn) {
        openFileBtn.addEventListener('click', () => fileInput.click());
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileOpen);
    }
    
    if (saveFileBtn) {
        saveFileBtn.addEventListener('click', handleFileSave);
    }
    
    if (editorContent) {
        editorContent.addEventListener('input', handleEditorChange);
        editorContent.addEventListener('keydown', handleEditorKeydown);
        editorContent.addEventListener('mouseup', updateSelectionState);
        editorContent.addEventListener('keyup', updateSelectionState);
    }
    
    // Text formatting buttons
    if (boldBtn) {
        boldBtn.addEventListener('click', () => formatText('bold'));
    }
    
    if (italicBtn) {
        italicBtn.addEventListener('click', () => formatText('italic'));
    }
    
    if (underlineBtn) {
        underlineBtn.addEventListener('click', () => formatText('underline'));
    }
    
    if (headingBtn) {
        headingBtn.addEventListener('click', () => formatText('heading'));
    }
    
    if (undoBtn) {
        undoBtn.addEventListener('click', () => document.execCommand('undo'));
    }
    
    if (redoBtn) {
        redoBtn.addEventListener('click', () => document.execCommand('redo'));
    }
    
    // AI Assist
    if (aiAssistBtn) {
        aiAssistBtn.addEventListener('click', handleAiAssist);
    }
    
    if (applyAiSuggestionBtn) {
        applyAiSuggestionBtn.addEventListener('click', applyAiSuggestion);
    }
    
    if (cancelAiSuggestionBtn) {
        cancelAiSuggestionBtn.addEventListener('click', closeAiAssistModal);
    }
    
    // File Save Modal
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', confirmFileSave);
    }
    
    if (cancelSaveBtn) {
        cancelSaveBtn.addEventListener('click', closeFileSaveModal);
    }
    
    // Accordion headers
    if (accordionHeaders) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const accordionItem = header.parentElement;
                accordionItem.classList.toggle('active');
            });
        });
    }
    
    // Navigation menu
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                switchSection(section);
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Version Control UI event listeners (GUARDED)
    if (vcCommitBtn) {
        vcCommitBtn.addEventListener('click', () => {
            const msg = vcCommitMessage.value.trim() || 'Update';
            const content = editorContent.innerText;
            window.versionControl.commit(msg, content);
            vcCommitMessage.value = '';
            renderVersionControl();
        });
    }
    if (vcCreateBranchBtn) {
        vcCreateBranchBtn.addEventListener('click', () => {
            const branch = vcBranchName.value.trim();
            if (!branch) return;
            try {
                window.versionControl.createBranch(branch);
                vcBranchName.value = '';
                renderVersionControl();
            } catch (e) {
                alert(e.message);
            }
        });
    }
    if (vcBranchSwitcher) {
        vcBranchSwitcher.addEventListener('change', () => {
            const branch = vcBranchSwitcher.value;
            const repo = window.versionControl.loadRepo();
            if (!repo) return;
            const commitId = repo.branches[branch];
            window.versionControl.checkout(commitId);
            // Update editor content
            editorContent.innerText = repo.commits[commitId].content;
            state.editor.content = repo.commits[commitId].content;
            renderVersionControl();
        });
    }
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
        
        let errorMessage = 'There was an error testing connection to the OpenAI API.';
        let errorDetailsText = '';
        
        // Handle specific error types
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Failed to connect to the API. Please check your internet connection and API endpoint.';
            errorDetailsText = 'This may be due to network connectivity issues, CORS restrictions, or an incorrect API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network error: Unable to reach the API server.';
            errorDetailsText = error.message;
        }
        
        alert('API Connection Error: ' + errorMessage);
        showError('API Connection Error', errorMessage, errorDetailsText);
        
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
            errorDetailsText = 'This may be due to network connectivity issues, CORS restrictions, or an incorrect API endpoint.';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network error: Unable to reach the API server.';
            errorDetailsText = error.message;
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
    
    if (editorSection) {
        editorSection.classList.remove('active-section');
        editorSection.classList.add('hidden-section');
    }
    
    // Show the selected section
    sectionToShow.classList.remove('hidden-section');
    sectionToShow.classList.add('active-section');
    
    // Scroll to top
    window.scrollTo(0, 0);
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
    
    // Show a confirmation dialog
    const confirmed = confirm(`This will send your story to ${CONFIG.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'}'s AI for expansion and refinement. This process will create a much longer, more detailed version of your story. Continue?`);
    
    if (!confirmed) {
        return;
    }
    
    // Create a modal to show progress
    createProgressModal();
    
    try {
        // Create a new array to store the expanded chapters
        const expandedChapters = [];
        
        // Process each chapter
        for (let i = 0; i < state.chapters.length; i++) {
            const chapter = state.chapters[i];
            updateProgressModal(`Processing chapter ${i+1} of ${state.chapters.length}: ${chapter.title}`, (i / state.chapters.length) * 100);
            
            // Break the chapter into sections for expansion
            const expandedSections = await expandChapterInSections(chapter);
            
            // Combine the expanded sections into a new chapter
            const expandedChapter = {
                title: chapter.title,
                content: expandedSections.join('\n\n')
            };
            
            expandedChapters.push(expandedChapter);
        }
        
        // Update the state with the expanded chapters
        state.chapters = expandedChapters;
        
        // Render the expanded chapters
        renderChapters(expandedChapters);
        
        // Close the progress modal
        closeProgressModal();
        
        // Show success message
        alert('Your story has been successfully expanded and refined!');
        
    } catch (error) {
        console.error('Error expanding story:', error);
        showError('API Error', 'There was an error expanding your story. Please try again.');
        closeProgressModal();
    }
}

// Function to expand a chapter by breaking it into sections and sending them sequentially, while merging character info to avoid duplicates
async function expandChapterInSections(chapter) {
    // Break the chapter content into sections (paragraphs)
    const paragraphs = chapter.content.split('\n\n').filter(p => p.trim() !== '');
    
    // Group paragraphs into sections of 2-3 paragraphs each
    const sections = [];
    for (let i = 0; i < paragraphs.length; i += 2) {
        const section = paragraphs.slice(i, i + 2).join('\n\n');
        if (section.trim() !== '') {
            sections.push(section);
        }
    }
    
    // If there are no sections, treat the whole chapter as one section
    if (sections.length === 0) {
        sections.push(chapter.content);
    }
    
    // Expand each section
    const expandedSections = [];
    for (let i = 0; i < sections.length; i++) {
        updateProgressModal(`Expanding section ${i+1} of ${sections.length} in "${chapter.title}"`, null);
        
        const section = sections[i];
        const expandedSection = await expandSection(section, chapter.title);
        expandedSections.push(expandedSection);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return expandedSections;
}

// Function to expand a single section using the API
async function expandSection(section, chapterTitle) {
    const prompt = `
    I'm writing a story and need to expand and enhance this section from the chapter "${chapterTitle}".
    Please rewrite this section to be more detailed, with richer descriptions, more engaging dialogue, and deeper character development.
    Make it 3-4 times longer than the original, while maintaining the same plot points and narrative flow.

    Here's the section to expand:

    ${section}`;

    const systemPrompt = "You are an expert fiction writer known for vivid descriptions, engaging dialogue, and deep character development. Your task is to expand and enhance story sections while maintaining the original narrative flow and plot points.";
    
    try {
        const response = await callAIWithChunking(prompt, systemPrompt);
        return response.result;
    } catch (error) {
        console.error('Error expanding section:', error);
        // Return the original section if expansion fails
        return section;
    }
}

// Function to create a modal to show progress
function createProgressModal() {
    // Create modal elements if they don't exist
    if (!document.getElementById('progress-modal')) {
        const modalHTML = `
        <div id="progress-modal" class="modal">
            <div class="modal-content">
                <h3>Expanding Your Story</h3>
                <p id="progress-message">Processing your story...</p>
                <div class="progress-container">
                    <div id="progress-bar" class="progress-bar"></div>
                </div>
                <p class="note">This may take several minutes depending on the length of your story.</p>
            </div>
        </div>`;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement.firstElementChild);
    }
    
    // Show the modal
    const progressModal = document.getElementById('progress-modal');
    progressModal.classList.remove('hidden');
}

// Function to update the progress modal
function updateProgressModal(message, percentComplete) {
    const progressMessage = document.getElementById('progress-message');
    const progressBar = document.getElementById('progress-bar');
    
    if (progressMessage) {
        progressMessage.textContent = message;
    }
    
    if (progressBar && percentComplete !== null) {
        progressBar.style.width = `${percentComplete}%`;
    }
}

// Function to close the progress modal
function closeProgressModal() {
    const progressModal = document.getElementById('progress-modal');
    if (progressModal) {
        progressModal.classList.add('hidden');
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

// Editor Functions
function handleNewFile() {
    if (state.editor.isDirty) {
        // Ask user if they want to save changes
        if (confirm('You have unsaved changes. Do you want to save them before creating a new file?')) {
            handleFileSave();
        }
    }
    
    // Reset editor state
    state.editor.currentFile = null;
    state.editor.currentFilename = 'Untitled';
    state.editor.content = '';
    state.editor.isDirty = false;
    state.editor.referenceDoc = {
        characters: [],
        paragraphSummaries: [],
        style: ''
    };
    
    // Update UI
    currentFilename.textContent = state.editor.currentFilename;
    saveStatus.textContent = '';
    editorContent.innerHTML = '';
    
    // Clear reference doc
    characterList.innerHTML = '';
    paragraphSummaries.innerHTML = '';
    storyStyle.innerHTML = '';
    storyMetadata.innerHTML = '<p class="note">New file created. Start writing to generate reference information.</p>';
    
    // Switch to editor section
    switchSection(editorSection);
}

function handleFileOpen(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (state.editor.isDirty) {
        // Ask user if they want to save changes
        if (confirm('You have unsaved changes. Do you want to save them before opening a new file?')) {
            handleFileSave();
        }
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        // Set editor state
        state.editor.currentFile = file;
        state.editor.currentFilename = file.name;
        state.editor.content = e.target.result;
        state.editor.isDirty = false;
        
        // Update UI
        currentFilename.textContent = state.editor.currentFilename;
        saveStatus.textContent = '';
        editorContent.innerHTML = state.editor.content;
        
        // Generate reference doc
        showLoadingIndicator('Analyzing file content...');
        try {
            await generateReferenceDoc(state.editor.content);
            hideLoadingIndicator();
        } catch (error) {
            hideLoadingIndicator();
            showError('Analysis Error', 'There was an error analyzing the file content.', error.toString());
        }
        
        // Switch to editor section
        switchSection(editorSection);
    };
    
    reader.onerror = function() {
        showError('File Error', 'There was an error reading the file.');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    fileInput.value = '';
}

function handleFileSave() {
    if (!state.editor.currentFile) {
        // Show save dialog
        saveFilename.value = state.editor.currentFilename;
        fileSaveModal.classList.remove('hidden');
    } else {
        // Save to existing file
        saveToFile(state.editor.currentFilename);
    }
}

function confirmFileSave() {
    const filename = saveFilename.value.trim();
    if (!filename) {
        alert('Please enter a filename.');
        return;
    }
    
    saveToFile(filename);
    closeFileSaveModal();
}

function closeFileSaveModal() {
    fileSaveModal.classList.add('hidden');
}

function saveToFile(filename) {
    // Get content from editor
    const content = editorContent.innerHTML;
    
    // Create blob
    const blob = new Blob([content], { type: 'text/html' });
    
    // Create download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    
    // Trigger download
    a.click();
    
    // Update state
    state.editor.currentFilename = filename;
    state.editor.isDirty = false;
    currentFilename.textContent = filename;
    saveStatus.textContent = 'Saved';
    
    // Clean up
    URL.revokeObjectURL(a.href);
}

function handleEditorChange() {
    state.editor.isDirty = true;
    saveStatus.textContent = 'Unsaved';
    
    // Debounce the reference doc generation
    clearTimeout(state.editor.debounceTimer);
    state.editor.debounceTimer = setTimeout(() => {
        const content = editorContent.innerHTML;
        if (content.trim().length > 100) {
            generateReferenceDoc(content);
        }
    }, 3000);
}

function handleEditorKeydown(event) {
    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case 's':
                event.preventDefault();
                handleFileSave();
                break;
            case 'b':
                event.preventDefault();
                formatText('bold');
                break;
            case 'i':
                event.preventDefault();
                formatText('italic');
                break;
            case 'u':
                event.preventDefault();
                formatText('underline');
                break;
        }
    }
}

function updateSelectionState() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        state.editor.selectionStart = range.startOffset;
        state.editor.selectionEnd = range.endOffset;
    }
}

function formatText(format) {
    editorContent.focus();
    
    switch (format) {
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'italic':
            document.execCommand('italic', false, null);
            break;
        case 'underline':
            document.execCommand('underline', false, null);
            break;
        case 'heading':
            const level = headingLevel.value;
            document.execCommand('formatBlock', false, `<${level}>`);
            break;
    }
    
    state.editor.isDirty = true;
    saveStatus.textContent = 'Unsaved';
}

async function generateReferenceDoc(content) {
    try {
        // Show loading in the reference section
        storyMetadata.innerHTML = '<div class="spinner"></div><p>Analyzing content...</p>';
        
        // Call API to analyze content
        const prompt = `
        Analyze the following story text and create a reference document with these sections:
        1. Characters: List all characters with brief descriptions
        2. Paragraph Summaries: For each paragraph, provide a concise summary (numbered)
        3. Style Analysis: Describe the writing style, tone, and notable details
        
        Text to analyze:
        ${content}
        
        Format your response as a JSON object with these keys:
        {
            "characters": [{"name": "Character Name", "description": "Brief description"}],
            "paragraphSummaries": [{"id": 1, "summary": "Summary of paragraph 1"}],
            "style": "Description of the writing style and tone"
        }
        `;
        
        const systemPrompt = "You are an expert literary analyst. Analyze the provided text and extract key information about characters, plot, and writing style. Format your response exactly as requested in JSON format.";
        
        const response = await callAPIWithChunking(prompt, systemPrompt);
        
        // Parse the response
        let referenceData;
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.result.match(/```json\n([\s\S]*?)\n```/) || 
                             response.result.match(/```\n([\s\S]*?)\n```/) || 
                             response.result.match(/{[\s\S]*?}/);
            
            const jsonString = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : response.result;
            referenceData = JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing reference data:', error);
            referenceData = {
                characters: [],
                paragraphSummaries: [],
                style: "Unable to analyze style. Please try again with more content."
            };
        }
        
        // Update state
        state.editor.referenceDoc = referenceData;
        
        // Update UI
        updateReferenceDocUI(referenceData);
        
    } catch (error) {
        console.error('Error generating reference doc:', error);
        storyMetadata.innerHTML = '<p class="note">Error analyzing content. Please try again.</p>';
    }
}

function updateReferenceDocUI(referenceData) {
    // Update characters list
    characterList.innerHTML = '';
    if (referenceData.characters && referenceData.characters.length > 0) {
        referenceData.characters.forEach(character => {
            const characterItem = document.importNode(characterItemTemplate.content, true);
            characterItem.querySelector('.character-name').textContent = character.name;
            characterItem.querySelector('.character-description').textContent = character.description;
            characterList.appendChild(characterItem);
        });
    } else {
        characterList.innerHTML = '<li>No characters identified yet.</li>';
    }
    
    // Update paragraph summaries
    paragraphSummaries.innerHTML = '';
    if (referenceData.paragraphSummaries && referenceData.paragraphSummaries.length > 0) {
        referenceData.paragraphSummaries.forEach(paragraph => {
            const paragraphItem = document.importNode(paragraphSummaryTemplate.content, true);
            paragraphItem.querySelector('.paragraph-id').textContent = `Paragraph ${paragraph.id}`;
            paragraphItem.querySelector('.paragraph-summary-text').textContent = paragraph.summary;
            paragraphSummaries.appendChild(paragraphItem);
        });
    } else {
        paragraphSummaries.innerHTML = '<li>No paragraph summaries available yet.</li>';
    }
    
    // Update style
    storyStyle.innerHTML = referenceData.style || 'No style analysis available yet.';
    
    // Update metadata
    storyMetadata.innerHTML = `
        <h4>Story Reference</h4>
        <p><strong>Characters:</strong> ${referenceData.characters ? referenceData.characters.length : 0}</p>
        <p><strong>Paragraphs:</strong> ${referenceData.paragraphSummaries ? referenceData.paragraphSummaries.length : 0}</p>
        <p class="note">This reference is automatically updated as you write.</p>
    `;
}

async function handleAiAssist() {
    // Get selected text or use all content if nothing is selected
    let selectedText = '';
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        selectedText = range.toString();
    }
    
    if (!selectedText) {
        alert('Please select some text to use AI assistance.');
        return;
    }
    
    // Get the assistance type
    const assistType = aiAssistType.value;
    
    // Show AI assist modal
    aiAssistModal.classList.remove('hidden');
    aiAssistLoading.classList.remove('hidden');
    aiAssistResult.innerHTML = '';
    
    try {
        // Prepare context from reference doc
        const referenceContext = JSON.stringify(state.editor.referenceDoc);
        
        // Prepare prompt based on assistance type
        let prompt = '';
        let systemPrompt = '';
        
        switch (assistType) {
            case 'improve':
                systemPrompt = "You are an expert editor and writing coach. Improve the provided text while maintaining the author's voice and style.";
                prompt = `Improve the following text to make it more engaging, clear, and impactful. Maintain the same style and tone.
                
                REFERENCE CHARACTERS:
                ${referenceContext}
                
                TEXT TO IMPROVE:
                ${selectedText}`;
                break;
                
            case 'expand':
                systemPrompt = "You are an expert creative writer who can expand content with vivid details and engaging narrative.";
                prompt = `Expand the following text with more details, descriptions, and depth. Keep the same style and tone.
                
                REFERENCE CHARACTERS:
                ${referenceContext}
                
                TEXT TO EXPAND:
                ${selectedText}`;
                break;
                
            case 'summarize':
                systemPrompt = "You are an expert editor who can create concise, powerful summaries.";
                prompt = `Summarize the following text while preserving the key points and tone.
                
                REFERENCE CHARACTERS:
                ${referenceContext}
                
                TEXT TO SUMMARIZE:
                ${selectedText}`;
                break;
                
            case 'rewrite':
                systemPrompt = "You are an expert writer who can rewrite content in different styles while preserving meaning.";
                prompt = `Rewrite the following text in a different style while preserving the core meaning and information.
                
                REFERENCE CHARACTERS:
                ${referenceContext}
                
                TEXT TO REWRITE:
                ${selectedText}`;
                break;
                
            case 'continue':
                systemPrompt = "You are an expert creative writer who can continue a narrative in the same style and tone.";
                prompt = `Continue the following text with 2-3 paragraphs that naturally flow from what's written. Match the style, tone, and narrative direction.
                
                REFERENCE CHARACTERS:
                ${referenceContext}
                
                TEXT TO CONTINUE FROM:
                ${selectedText}`;
                break;
        }
        
        // Use chunked AI call
        const { result } = await callAIWithChunking(prompt, systemPrompt);
        
        aiAssistResult.innerHTML = result;
        
    } catch (error) {
        console.error('AI assist error:', error);
        aiAssistResult.innerHTML = `<p class="error">Error: ${error.message || 'Failed to get AI assistance'}</p>`;
    } finally {
        aiAssistLoading.classList.add('hidden');
    }
}

function applyAiSuggestion() {
    // Get the suggestion text
    const suggestionText = aiAssistResult.innerHTML;
    
    // Get the selection
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Replace selected text with suggestion
        range.deleteContents();
        const fragment = document.createRange().createContextualFragment(suggestionText);
        range.insertNode(fragment);
        
        // Update state
        state.editor.isDirty = true;
        saveStatus.textContent = 'Unsaved';
    }
    
    // Close modal
    closeAiAssistModal();
}

function closeAiAssistModal() {
    aiAssistModal.classList.add('hidden');
}

function showLoadingIndicator(message) {
    // Create a loading indicator if it doesn't exist
    let loadingIndicator = document.getElementById('editor-loading');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'editor-loading';
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p id="loading-message"></p>
        `;
        document.body.appendChild(loadingIndicator);
    }
    
    // Set message and show
    document.getElementById('loading-message').textContent = message || 'Loading...';
    loadingIndicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('editor-loading');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

// Token Limit Detection and Chunking
const API_TOKEN_LIMITS = {
    openai: {
        'gpt-3.5-turbo': 4096,
        'gpt-4': 8192,
        'gpt-4-32k': 32768
    },
    anthropic: {
        'claude-instant-1': 9000,
        'claude-2': 100000
    }
};

function getTokenLimit(provider, model) {
    if (API_TOKEN_LIMITS[provider] && API_TOKEN_LIMITS[provider][model]) {
        return API_TOKEN_LIMITS[provider][model];
    }
    // Default fallback
    return 4096;
}

// Utility: Estimate tokens (simple whitespace split, can be improved)
function estimateTokens(text) {
    return Math.ceil(text.split(/\s+/).length * 1.3); // crude estimate
}

// Utility: Chunk text into sections 10% smaller than token limit
function chunkTextForAPI(text, tokenLimit) {
    const safeLimit = Math.floor(tokenLimit * 0.9);
    const words = text.split(/\s+/);
    const chunks = [];
    let chunk = [];
    let currentTokens = 0;
    for (let i = 0; i < words.length; i++) {
        currentTokens += 1.3; // crude estimate per word
        chunk.push(words[i]);
        if (currentTokens >= safeLimit) {
            chunks.push(chunk.join(' '));
            chunk = [];
            currentTokens = 0;
        }
    }
    if (chunk.length > 0) {
        chunks.push(chunk.join(' '));
    }
    return chunks;
}

// Utility: Merge and deduplicate character lists by name
function mergeCharacters(existing, incoming) {
    const map = {};
    existing.forEach(c => map[c.name?.toLowerCase() || c.name] = c);
    incoming.forEach(c => {
        const key = c.name?.toLowerCase() || c.name;
        if (!map[key]) map[key] = c;
    });
    return Object.values(map);
}

// On app load, set token limit in state
function initializeApp() {
    console.log('Initializing app...');
    
    // Initialize DOM elements
    initializeDOMElements();
    
    // Add event listeners
    addEventListeners();
    
    // Load API configuration
    loadApiConfig();
    
    // Set initial section
    const initialSection = document.querySelector('.active-section') || promptSection;
    switchSection(initialSection);
    
    // Set active nav link for initial section
    const initialSectionId = initialSection.id;
    const initialNavLink = document.querySelector(`nav a[data-section="${initialSectionId}"]`);
    if (initialNavLink) {
        initialNavLink.classList.add('active');
    }
    
    // Initialize Version Control UI
    initializeVersionControlUI();
    
    console.log('App initialized');
    
    // Set token limit after loading API config
    setTimeout(() => {
        const provider = state.apiProvider;
        const model = state.model || 'gpt-3.5-turbo';
        state.tokenLimit = getTokenLimit(provider, model);
        console.log('Token limit set:', state.tokenLimit);
    }, 500);
}

// Chunked AI Call Logic
async function callAIWithChunking(fullText, systemPrompt) {
    const tokenLimit = state.tokenLimit || 4096;
    const chunks = chunkTextForAPI(fullText, tokenLimit);
    let combinedResult = '';
    let currentCharacters = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        // Prepare prompt (simplified, adapt as needed)
        let prompt = '';
        switch (systemPrompt) {
            case "You are an expert fiction writer known for vivid descriptions, engaging dialogue, and deep character development. Your task is to expand and enhance story sections while maintaining the original narrative flow and plot points.":
                prompt = `Expand and enhance this section of the story: "${chunk}"`;
                break;
            // Add other cases as needed
            default:
                prompt = chunk;
        }
        // Call API for this chunk
        const response = await callAPI(prompt, systemPrompt);
        // Optionally parse and extract new characters (if API returns them)
        // For now, just append the result
        combinedResult += response + '\n';
        // Example: If response includes new characters, merge them
        // (You would need to parse response for new character info)
        // const newCharacters = extractCharactersFromResponse(response);
        // currentCharacters = mergeCharacters(currentCharacters, newCharacters);
    }
    return { result: combinedResult.trim(), characters: currentCharacters };
}

// Version Control UI
function initializeVersionControlUI() {
    vcCommitMessage = document.getElementById('vc-commit-message');
    vcCommitBtn = document.getElementById('vc-commit-btn');
    vcBranchName = document.getElementById('vc-branch-name');
    vcCreateBranchBtn = document.getElementById('vc-create-branch-btn');
    vcBranchSwitcher = document.getElementById('vc-branch-switcher');
    vcHistoryList = document.getElementById('vc-history-list');

    // Init repo if needed
    window.versionControl.initRepo(state.editor.content || '');
    renderVersionControl();

    // Event: Commit
    if (vcCommitBtn) {
        vcCommitBtn.addEventListener('click', () => {
            const msg = vcCommitMessage.value.trim() || 'Update';
            const content = editorContent.innerText;
            window.versionControl.commit(msg, content);
            vcCommitMessage.value = '';
            renderVersionControl();
        });
    }
    // Event: Create Branch
    if (vcCreateBranchBtn) {
        vcCreateBranchBtn.addEventListener('click', () => {
            const branch = vcBranchName.value.trim();
            if (!branch) return;
            try {
                window.versionControl.createBranch(branch);
                vcBranchName.value = '';
                renderVersionControl();
            } catch (e) {
                alert(e.message);
            }
        });
    }
    // Event: Switch Branch
    if (vcBranchSwitcher) {
        vcBranchSwitcher.addEventListener('change', () => {
            const branch = vcBranchSwitcher.value;
            const repo = window.versionControl.loadRepo();
            if (!repo) return;
            const commitId = repo.branches[branch];
            window.versionControl.checkout(commitId);
            // Update editor content
            editorContent.innerText = repo.commits[commitId].content;
            state.editor.content = repo.commits[commitId].content;
            renderVersionControl();
        });
    }
}

function renderVersionControl() {
    const repo = window.versionControl.loadRepo();
    if (!repo) return;
    // Branch Switcher
    vcBranchSwitcher.innerHTML = '';
    Object.keys(repo.branches).forEach(branch => {
        const opt = document.createElement('option');
        opt.value = branch;
        opt.textContent = branch + (repo.HEAD.branch === branch ? ' (current)' : '');
        if (repo.HEAD.branch === branch) opt.selected = true;
        vcBranchSwitcher.appendChild(opt);
    });
    // History List
    const history = window.versionControl.getHistory();
    vcHistoryList.innerHTML = '';
    history.forEach(commit => {
        const li = document.createElement('li');
        li.className = 'vc-history-item';
        li.innerHTML = `<span class="vc-branch">[${commit.branch}]</span>
            <span class="vc-msg">${commit.message}</span>
            <span class="vc-time">${new Date(commit.timestamp).toLocaleString()}</span>`;
        // Restore/Checkout button
        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = 'Restore';
        restoreBtn.className = 'secondary-btn';
        restoreBtn.onclick = () => {
            window.versionControl.checkout(commit.id);
            editorContent.innerText = commit.content;
            state.editor.content = commit.content;
            renderVersionControl();
        };
        li.appendChild(restoreBtn);
        // Branch from here button
        const branchBtn = document.createElement('button');
        branchBtn.textContent = 'Branch';
        branchBtn.className = 'secondary-btn';
        branchBtn.onclick = () => {
            const branch = prompt('Branch name?');
            if (!branch) return;
            try {
                window.versionControl.createBranch(branch, commit.id);
                renderVersionControl();
            } catch (e) {
                alert(e.message);
            }
        };
        li.appendChild(branchBtn);
        vcHistoryList.appendChild(li);
    });
}