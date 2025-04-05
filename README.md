# AI Story Developer

A web-based tool that uses Anthropic's Claude API to help users develop stories from initial prompts to fully-fleshed narratives.

## Features

- Expand initial story prompts into detailed concepts
- Generate plot and subplot suggestions
- Select and develop preferred plot elements
- Create chapter-by-chapter story development
- Export stories as markdown files
- Send stories to Claude for further refinement

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-story-developer.git
cd ai-story-developer
```

2. **Configure API Key**

Copy the example configuration file and add your Anthropic API key:

```bash
cp config.example.js config.js
```

Then edit `config.js` and add your Anthropic API key to the `apiKey` field. You can obtain an API key from [Anthropic's Console](https://console.anthropic.com/).

**Important**: The `config.js` file is included in `.gitignore` to prevent committing your API key to the repository.

3. **Open the application**

Simply open the `index.html` file in your web browser:

```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

## Usage

1. **Configure API**
   - Enter your Anthropic API key
   - Select which Claude model to use (Opus, Sonnet, or Haiku)
   - Click "Save Configuration"

2. **Develop Your Story**
   - Enter an initial story prompt
   - Click "Expand Prompt" to get a more detailed concept
   - Generate plot suggestions
   - Select which plots you want to include
   - Develop chapters based on selected plots
   - Edit or regenerate individual chapters as needed

3. **Export Your Story**
   - Click "Export Story" to download as a markdown file
   - Click "Send to AI" to send to Claude for further refinement

## Troubleshooting

If you encounter issues with the API:

- Ensure your API key is valid and has sufficient credits
- Check that you're using the correct model names
- Enable debug mode in `config.js` by setting `debug: true`
- Check the browser console for detailed error messages

## License

[MIT License](LICENSE)