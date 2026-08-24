<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9027697c-735a-4bcd-8d94-c437eeb90bb4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env` in this directory and set the Vite client variables from Supabase Project Settings > API:
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Set `GEMINI_API_KEY` in `.env` to your Gemini API key
4. Run the app:
   `npm run dev`
