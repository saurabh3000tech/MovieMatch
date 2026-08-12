import { useState } from "react";
import "./App.css";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    genre: "Sci-Fi • Drama",
    emoji: "🚀",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genre: "Action • Crime",
    emoji: "🦇",
  },
  {
    id: 3,
    title: "La La Land",
    year: 2016,
    rating: 8.0,
    genre: "Romance • Musical",
    emoji: "💃",
  },
  {
    id: 4,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genre: "Sci-Fi • Thriller",
    emoji: "🌀",
  },
  {
    id: 5,
    title: "About Time",
    year: 2013,
    rating: 7.8,
    genre: "Romance • Comedy",
    emoji: "❤️",
  },
  {
    id: 6,
    title: "The Notebook",
    year: 2004,
    rating: 7.8,
    genre: "Romance • Drama",
    emoji: "💌",
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    year: 2019,
    rating: 8.4,
    genre: "Action • Adventure",
    emoji: "⚡",
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const [exitDirection, setExitDirection] = useState(null);

  // Temporary partner data for our prototype
  const partnerLikes = [1, 3, 4, 6];

  const matches = likedMovies.filter((movie) =>
    partnerLikes.includes(movie.id)
  );

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];

  const handleStart = (clientX) => {
    if (exitDirection) return;

    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const distance = clientX - startX;
    setDragX(distance);
  };

  const finishSwipe = (direction) => {
    setIsDragging(false);
    setExitDirection(direction);

    setTimeout(() => {
      if (direction === "right") {
        addLike(currentMovie);
      }

      setCurrentIndex((index) => index + 1);

      setDragX(0);
      setExitDirection(null);
    }, 250);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (dragX > 100) {
      finishSwipe("right");
    } else if (dragX < -100) {
      finishSwipe("left");
    } else {
      setDragX(0);
    }
  };

  const addLike = (movie) => {
    if (!movie) return;

    setLikedMovies((previous) => {
      if (previous.some((item) => item.id === movie.id)) {
        return previous;
      }

      return [...previous, movie];
    });
  };

  const handleLike = () => {
    if (!currentMovie || exitDirection) return;

    finishSwipe("right");
  };

  const handlePass = () => {
    if (!currentMovie || exitDirection) return;

    finishSwipe("left");
  };

  const resetMovies = () => {
    setCurrentIndex(0);
    setLikedMovies([]);
    setDragX(0);
    setExitDirection(null);
  };

  const getCardTransform = () => {
    if (exitDirection === "right") {
      return "translateX(700px) rotate(25deg)";
    }

    if (exitDirection === "left") {
      return "translateX(-700px) rotate(-25deg)";
    }

    return `translateX(${dragX}px) rotate(${dragX * 0.06}deg)`;
  };

  return (
    <div className="app">

      {/* NAVIGATION */}

      <nav className="navbar">

        <div className="logo">
          🎬 MovieMatch
        </div>

        <div className="nav-tabs">

          <button
            className={activeTab === "discover" ? "active" : ""}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>

          <button
            className={activeTab === "likes" ? "active" : ""}
            onClick={() => setActiveTab("likes")}
          >
            ❤️ My Likes

            {likedMovies.length > 0 && (
              <span className="badge">
                {likedMovies.length}
              </span>
            )}
          </button>

          <button
            className={activeTab === "matches" ? "active" : ""}
            onClick={() => setActiveTab("matches")}
          >
            🔥 Matches

            {matches.length > 0 && (
              <span className="badge">
                {matches.length}
              </span>
            )}
          </button>

        </div>

      </nav>

      {/* DISCOVER */}

      {activeTab === "discover" && (

        <main className="main">

          <div className="heading">

            <p className="small-heading">
              WHAT SHOULD WE WATCH?
            </p>

            <h1>
              Find your next movie ❤️
            </h1>

            <p>
              Swipe right on movies you'd watch.
              <br />
              We'll find the ones you both love.
            </p>

          </div>

          <div className="swipe-area">

            {/* NEXT CARD */}

            {nextMovie && (
              <div className="card next-card">

                <div className="poster">
                  <div className="poster-emoji">
                    {nextMovie.emoji}
                  </div>

                  <div className="poster-title">
                    {nextMovie.title}
                  </div>
                </div>

                <div className="movie-info">

                  <h2>
                    {nextMovie.title}
                  </h2>

                  <div className="movie-meta">
                    ⭐ {nextMovie.rating}
                    <span>•</span>
                    {nextMovie.year}
                    <span>•</span>
                    {nextMovie.genre}
                  </div>

                </div>

              </div>
            )}

            {/* CURRENT CARD */}

            {currentMovie ? (

              <div
                className={`card current-card ${
                  exitDirection ? "exiting" : ""
                }`}
                style={{
                  transform: getCardTransform(),
                  transition: isDragging
                    ? "none"
                    : "transform 0.25s ease",
                }}

                onMouseDown={(event) =>
                  handleStart(event.clientX)
                }

                onMouseMove={(event) =>
                  handleMove(event.clientX)
                }

                onMouseUp={handleEnd}

                onMouseLeave={() => {
                  if (isDragging) {
                    handleEnd();
                  }
                }}

                onTouchStart={(event) =>
                  handleStart(event.touches[0].clientX)
                }

                onTouchMove={(event) =>
                  handleMove(event.touches[0].clientX)
                }

                onTouchEnd={handleEnd}
              >

                {/* LIKE LABEL */}

                {dragX > 40 && (
                  <div className="swipe-label like-label">
                    LIKE ❤️
                  </div>
                )}

                {/* PASS LABEL */}

                {dragX < -40 && (
                  <div className="swipe-label pass-label">
                    PASS ❌
                  </div>
                )}

                {/* POSTER */}

                <div className="poster">

                  <div className="poster-emoji">
                    {currentMovie.emoji}
                  </div>

                  <div className="poster-title">
                    {currentMovie.title}
                  </div>

                </div>

                {/* MOVIE INFORMATION */}

                <div className="movie-info">

                  <h2>
                    {currentMovie.title}
                  </h2>

                  <div className="movie-meta">

                    ⭐ {currentMovie.rating}

                    <span>•</span>

                    {currentMovie.year}

                    <span>•</span>

                    {currentMovie.genre}

                  </div>

                  <p>
                    Would you watch this with your partner?
                  </p>

                </div>

              </div>

            ) : (

              <div className="finished">

                <div className="finished-icon">
                  🎬
                </div>

                <h2>
                  You've seen everything!
                </h2>

                <p>
                  Check your likes and matches.
                </p>

                <button
                  className="reset-button"
                  onClick={resetMovies}
                >
                  Start Again
                </button>

              </div>

            )}

          </div>

          {/* BUTTONS */}

          {currentMovie && (

            <div className="actions">

              <button
                className="action-button pass"
                onClick={handlePass}
              >
                ❌
              </button>

              <button
                className="action-button like"
                onClick={handleLike}
              >
                ❤️
              </button>

            </div>

          )}

          <p className="swipe-hint">
            ← Swipe left to pass
            &nbsp; • &nbsp;
            Swipe right to like →
          </p>

        </main>
      )}

      {/* MY LIKES */}

      {activeTab === "likes" && (

        <main className="list-page">

          <div className="heading">

            <p className="small-heading">
              YOUR COLLECTION
            </p>

            <h1>
              ❤️ My Likes
            </h1>

            <p>
              Movies you've swiped right on.
            </p>

          </div>

          {likedMovies.length === 0 ? (

            <div className="empty">

              <div>❤️</div>

              <h2>
                No likes yet
              </h2>

              <p>
                Start swiping to build your movie list.
              </p>

              <button
                onClick={() => setActiveTab("discover")}
              >
                Discover Movies
              </button>

            </div>

          ) : (

            <div className="movie-grid">

              {likedMovies.map((movie) => (

                <div
                  className="movie-small-card"
                  key={movie.id}
                >

                  <div className="small-poster">
                    {movie.emoji}
                  </div>

                  <h3>
                    {movie.title}
                  </h3>

                  <p>
                    ⭐ {movie.rating}
                    {" • "}
                    {movie.year}
                  </p>

                </div>

              ))}

            </div>

          )}

        </main>
      )}

      {/* MATCHES */}

      {activeTab === "matches" && (

        <main className="list-page">

          <div className="heading">

            <p className="small-heading">
              YOU + YOUR PARTNER
            </p>

            <h1>
              🔥 Our Matches
            </h1>

            <p>
              Movies you both want to watch.
            </p>

          </div>

          {matches.length === 0 ? (

            <div className="empty">

              <div>💔</div>

              <h2>
                No matches yet
              </h2>

              <p>
                Keep swiping. When you both like
                a movie, it'll appear here.
              </p>

            </div>

          ) : (

            <>

              <div className="match-message">

                🎉 You found {matches.length} movie
                {matches.length > 1 ? "s" : ""}
                {" "}you both like!

              </div>

              <div className="movie-grid">

                {matches.map((movie) => (

                  <div
                    className="movie-small-card match-card"
                    key={movie.id}
                  >

                    <div className="match-badge">
                      MATCH ❤️
                    </div>

                    <div className="small-poster">
                      {movie.emoji}
                    </div>

                    <h3>
                      {movie.title}
                    </h3>

                    <p>
                      ⭐ {movie.rating}
                      {" • "}
                      {movie.year}
                    </p>

                  </div>

                ))}

              </div>

            </>

          )}

        </main>

      )}

    </div>
  );
}

export default App;