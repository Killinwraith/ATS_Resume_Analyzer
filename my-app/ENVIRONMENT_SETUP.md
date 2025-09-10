# Environment Setup

## Setting up the Gemini API Key

The application requires a Gemini API key to function. Follow these steps to set it up:

### 1. Get your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the Environment Variable

1. Open the `.env.local` file in the root of the project
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Restart the Development Server

After setting up the API key, restart your Next.js development server:

```bash
npm run dev
```

### Troubleshooting

- Make sure the `.env.local` file is in the root directory of the project (same level as `package.json`)
- Ensure there are no spaces around the `=` sign in the environment variable
- The API key should not be wrapped in quotes
- Restart the development server after making changes to environment variables

### Security Note

- Never commit the `.env.local` file to version control
- The `.env.local` file is already included in `.gitignore`
- Keep your API key secure and don't share it publicly
