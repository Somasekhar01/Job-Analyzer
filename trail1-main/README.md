# JobSnap AI

JobSnap AI turns long job descriptions into a structured, editable snapshot. The React client uses a small Express API for OpenAI analysis, JWT authentication and MongoDB-backed job history.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MongoDB, for accounts and cross-session saved jobs
- An OpenAI API key, for job description analysis

## Run locally

1. Install packages: `npm install`
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`, `JWT_SECRET`, and `MONGODB_URI`.
3. Start the client and API together: `npm run dev`
4. Open `http://localhost:5173`.

The API listens on port 4000 by default. AI analysis works for guests; guests' history stays in the current browser. Account registration, login and cross-session job synchronization require a reachable MongoDB instance and `JWT_SECRET`.

## Build

- `npm run build` creates the production client in `dist`.
- `npm run server` starts the API.
- `npm run preview` serves the production client locally.

Deploy the client and API behind the same origin (or configure `CLIENT_ORIGIN` and the API URL for your hosting setup). Keep `.env` and all provider credentials on the server; never add them to frontend code.

## Data handling

Job descriptions are sent to the configured OpenAI model for extraction. The API validates the returned structure and does not infer missing facts. Analyses are kept in browser-local history for guests and persisted to a user's MongoDB account after sign-in. Review dates, eligibility and other AI-extracted facts against the original listing before acting on them.

Resume comparisons accept PDF or DOCX files up to 5 MB. Resume text is extracted in memory, sent to the configured AI provider for the requested comparison, and is not saved to local history or MongoDB. Scoring and recruiter feedback are AI-generated guidance, not an employment decision.
