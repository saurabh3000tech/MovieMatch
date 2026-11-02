import { rankMovies } from "./compatibility";

export function findCommonGround(movies, personA, personB) {
  const rankedMovies = rankMovies(movies, personA, personB);

  return rankedMovies.map((movie) => {
    const reasons = [];

    // Language connection
    if (
      movie.language === personA.language &&
      movie.language === personB.language
    ) {
      reasons.push("Both want this language");
    } else if (movie.language === personA.language) {
      reasons.push("Matches your preferred language");
    } else if (movie.language === personB.language) {
      reasons.push("Matches your partner's preferred language");
    }

    // Genre connection
    const sharedGenres = movie.genres.filter(
      (genre) =>
        personA.genres.includes(genre) &&
        personB.genres.includes(genre)
    );

    if (sharedGenres.length > 0) {
      reasons.push(`Shared genre: ${sharedGenres.join(", ")}`);
    }

    // Director connection
    if (
      personA.directors.includes(movie.director) &&
      personB.directors.includes(movie.director)
    ) {
      reasons.push(`You both like ${movie.director}`);
    } else if (personA.directors.includes(movie.director)) {
      reasons.push(`You like ${movie.director}`);
    } else if (personB.directors.includes(movie.director)) {
      reasons.push(`Your partner likes ${movie.director}`);
    }

    // Mood connection
    const sharedMoods = movie.mood.filter(
      (mood) =>
        personA.moods.includes(mood) &&
        personB.moods.includes(mood)
    );

    if (sharedMoods.length > 0) {
      reasons.push(`Shared mood: ${sharedMoods.join(", ")}`);
    }

    return {
      ...movie,
      matchReasons: reasons,
    };
  });
}s