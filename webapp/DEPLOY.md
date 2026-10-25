# Deploy the SIP Discovery Engine to Vercel (about 10 minutes)

The app is a static page (`index.html`, `findings.json`) plus one serverless function (`api/analyze.js`). No build step.

## Option A: Vercel CLI (recommended, works without GitHub)
1. Install Node.js 24+ (https://nodejs.org) if you don't have it.
2. Open a terminal in this `webapp` folder, then:
   ```
   npm i -g vercel
   vercel login
   vercel            # accept the defaults; Framework Preset = Other; Output dir = leave blank
   vercel env add GEMINI_API_KEY      # paste your key; choose Production (and Preview if asked)
   vercel --prod
   ```
3. Open the Production URL it prints. Test: click "Try the engine" -> an example -> Analyse.

## Option B: Vercel dashboard + GitHub
Push this folder to GitHub, then in Vercel: Add New Project -> import repo -> Root Directory = `webapp` -> Environment Variables -> add `GEMINI_API_KEY` -> Deploy.

## After deploying
- In Vercel: Project Settings -> Deployment Protection -> turn OFF "Vercel Authentication" for Production, otherwise mentors see a login wall.
- Set a quota/spend alert for your Gemini key in Google AI Studio / Cloud Console.
- The function limits each visitor to 15 analyses/hour and the whole demo to ~350/day (best-effort, per warm instance).
- Never commit the API key. It lives only in Vercel's environment variables.
