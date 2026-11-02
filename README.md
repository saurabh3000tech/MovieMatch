# MovieMatch 🎬

MovieMatch helps two people find a movie they both want to watch. It pulls popular films from The Movie Database (TMDB), then scores them against each person's taste to find common ground.

## Tech stack

- **Frontend:** React 19, Vite
- **Backend:** Node.js, Express 5
- **Data:** TMDB API

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your TMDB read access token:

   ```
   TMDB_TOKEN=your_tmdb_read_access_token
   ```

   Get a token from your TMDB account under Settings → API.

3. Start the backend (runs on port 5000):

   ```bash
   npm run server
   ```

4. In a second terminal, start the frontend:

   ```bash
   npm run dev
   ```

## API

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/` | Health check |
| GET | `/api/movies?language=en` | Popular movies filtered by original language, with genres and director |
| GET | `/api/director/:movieId` | Director for a single TMDB movie ID |

## Project structure

```
server/server.js          Express backend and TMDB proxy
src/recommendation/       Scoring and common-ground logic
src/data/                 Sample movie and user data
src/App.jsx               React UI
```

## Notes

- `.env` is listed in `.gitignore`, so your token is never committed.
- This project uses TMDB for non-commercial, personal use.
