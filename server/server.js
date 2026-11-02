import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_HEADERS = {
  Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  accept: "application/json",
};

// ----------------------------------------
// TMDB HELPER
// ----------------------------------------

async function tmdbFetch(endpoint) {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: TMDB_HEADERS,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`TMDB error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ----------------------------------------
// TEST
// ----------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "MovieMatch backend is running 🎬",
  });
});

// ----------------------------------------
// MOVIES
// ----------------------------------------

app.get("/api/movies", async (req, res) => {
  try {
    const language = req.query.language || "en";

    console.log("================================");
    console.log("🎬 MovieMatch → TMDB");
    console.log("Language:", language);

    // 1. Fetch movies
    const movieData = await tmdbFetch(
      `/discover/movie` +
        `?include_adult=false` +
        `&include_video=false` +
        `&language=en-US` +
        `&sort_by=popularity.desc` +
        `&with_original_language=${language}`
    );

    // 2. Fetch genre names
    const genreData = await tmdbFetch("/genre/movie/list?language=en-US");

    const genreMap = {};

    genreData.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });

    // 3. Enrich each movie
    const movies = await Promise.all(
      movieData.results.map(async (movie) => {
        let director = "Unknown";

        try {
          const credits = await tmdbFetch(`/movie/${movie.id}/credits`);

          const directorPerson = credits.crew.find(
            (person) => person.job === "Director"
          );

          if (directorPerson) {
            director = directorPerson.name;
          }
        } catch (error) {
          console.log(`Director unavailable for ${movie.title}`);
        }

        const genres = movie.genre_ids
          .map((genreId) => genreMap[genreId])
          .filter(Boolean);

        return {
          id: movie.id,

          title: movie.title,
          originalTitle: movie.original_title,

          overview: movie.overview,

          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,

          releaseDate: movie.release_date,

          rating: movie.vote_average,
          voteCount: movie.vote_count,

          popularity: movie.popularity,

          language: movie.original_language,

          genres,

          director,
        };
      })
    );

    console.log(`✅ Enriched ${movies.length} movies`);
    console.log("================================");

    res.json({
      page: movieData.page,
      totalPages: movieData.total_pages,
      totalResults: movieData.total_results,
      movies,
    });
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ----------------------------------------
// DIRECTOR
// ----------------------------------------

app.get("/api/director/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    const credits = await tmdbFetch(`/movie/${movieId}/credits`);

    const directorPerson = credits.crew.find(
      (person) => person.job === "Director"
    );

    res.json({
      movieId,
      director: directorPerson ? directorPerson.name : "Unknown",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// ----------------------------------------
// START
// ----------------------------------------

app.listen(PORT, () => {
  console.log(`🎬 MovieMatch server running on http://localhost:${PORT}`);
});
