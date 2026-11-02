import { scoreMovie } from "./scorer";

export function getCoupleScore(movie, personA, personB) {
  const scoreA = scoreMovie(movie, personA);
  const scoreB = scoreMovie(movie, personB);

  // Both people matter equally
  const averageScore = (scoreA + scoreB) / 2;

  // Penalize movies that one person strongly dislikes
  const difference = Math.abs(scoreA - scoreB);

  const fairnessPenalty = difference * 0.20;

  const finalScore = averageScore - fairnessPenalty;

  return Number(finalScore.toFixed(1));
}

export function rankMovies(movies, personA, personB) {
  return movies
    .map((movie) => ({
      ...movie,
      coupleScore: getCoupleScore(movie, personA, personB),
    }))
    .sort((a, b) => b.coupleScore - a.coupleScore);
}