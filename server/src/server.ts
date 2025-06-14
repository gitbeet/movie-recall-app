import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// --- In-memory user & favorites store (for demo purposes) ---
const users: { [email: string]: { userId: string; email: string } } = {};
const userFavorites: { [userId: string]: any[] } = {};

function getOrCreateUser(email: string) {
  if (!users[email]) {
    const userId = Math.random().toString(36).slice(2) + Date.now();
    users[email] = { userId, email };
    userFavorites[userId] = [];
  }
  return users[email];
}

// --- User and Favorites Endpoints ---
// Create or fetch a user by email
app.post("/api/user", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  const user = getOrCreateUser(email);
  res.json({ userId: user.userId, email: user.email });
});

// Get favorites for a user
app.get("/api/user/:userId/favorites", (req, res) => {
  const { userId } = req.params;
  const favorites = userFavorites[userId] || [];
  res.json({ favorites });
});

// Add a favorite movie
app.post("/api/user/:userId/favorites", (req, res) => {
  const { userId } = req.params;
  const movie = req.body;
  if (!movie || !movie.id) return res.status(400).json({ error: "Movie object with id required" });
  if (!userFavorites[userId]) userFavorites[userId] = [];
  // Avoid duplicates
  if (!userFavorites[userId].some((m) => m.id === movie.id)) {
    userFavorites[userId].push(movie);
  }
  res.json({ favorites: userFavorites[userId] });
});

// Remove a favorite movie
app.delete("/api/user/:userId/favorites/:movieId", (req, res) => {
  const { userId, movieId } = req.params;
  if (!userFavorites[userId]) return res.json({ favorites: [] });
  userFavorites[userId] = userFavorites[userId].filter((m) => String(m.id) !== String(movieId));
  res.json({ favorites: userFavorites[userId] });
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.post("/api/find-movie", async (req: Request, res: Response) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    // Step 1: Get a list of movie titles from OpenAI
    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-nano-2025-04-14",
        messages: [
          {
            role: "system",
            content:
              'You are a movie expert. Based on the user\'s description, identify up to 10 possible movie titles. Respond with only a valid JSON array of strings, ordered from most likely to least likely. For example: ["Movie Title 1", "Movie Title 2"]',
          },
          {
            role: "user",
            content: description,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const openAIContent = openAIResponse.data.choices[0].message.content.trim();
    let movieTitles: string[];

    try {
      movieTitles = JSON.parse(openAIContent);
      if (!Array.isArray(movieTitles)) {
        movieTitles = [openAIContent];
      }
    } catch (e) {
      console.warn(
        "OpenAI response was not valid JSON, treating as a single title."
      );
      movieTitles = [openAIContent];
    }

    // Step 2: Fetch details for each movie title from TMDB
    const moviePromises = movieTitles.map(async (title) => {
      if (!title) return null;
      const tmdbResponse = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            query: title,
            sort_by: "popularity.desc",
          },
        }
      );
      return tmdbResponse.data.results.length > 0
        ? tmdbResponse.data.results
        : null;
    });

    const moviesDataArrays = await Promise.all(moviePromises);
    const moviesData = moviesDataArrays.flat();

    const movieResults = moviesData
      .filter((movie): movie is NonNullable<typeof movie> => movie !== null)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        releaseYear: movie.release_date
          ? movie.release_date.split("-")[0]
          : "N/A",
      }));

    const finalResults = movieResults.slice(0, 10);

    if (finalResults.length === 0) {
      return res
        .status(404)
        .json({ error: "Could not find any matching movies." });
    }

    // Step 3: Send the list of movies to the client
    res.json(finalResults);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error processing request:", error);
    }
    res.status(500).json({ error: "Failed to process your request." });
  }
});

app.get("/api/movie/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (!tmdbApiKey) {
    return res.status(500).json({ error: "TMDB API key is not configured." });
  }

  try {
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}`;
    const response = await axios.get(movieDetailsUrl, {
      params: {
        api_key: tmdbApiKey,
        append_to_response: "images,videos",
      },
    });

    const movieData = response.data;

    // Fetch cast information from TMDB credits endpoint
    const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits`;
    const creditsResponse = await axios.get(creditsUrl, {
      params: { api_key: tmdbApiKey },
    });
    // For each cast member, fetch their external_ids to get imdb_id
    const castRaw = creditsResponse.data.cast.slice(0, 8);
    const castData = await Promise.all(
      castRaw.map(async (member: any) => {
        let imdbUrl = null;
        try {
          const personResp = await axios.get(
            `https://api.themoviedb.org/3/person/${member.id}/external_ids`,
            {
              params: { api_key: tmdbApiKey },
            }
          );
          if (personResp.data.imdb_id) {
            imdbUrl = `https://www.imdb.com/name/${personResp.data.imdb_id}`;
          }
        } catch (e) {
          console.log(e);
          // ignore error, fallback to TMDB link only
        }
        return {
          id: member.id,
          name: member.name,
          character: member.character,
          profileUrl: member.profile_path
            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
            : null,
          imdbUrl,
          tmdbUrl: `https://www.themoviedb.org/person/${member.id}`,
        };
      })
    );

    // Extract director, producer, writer from crew
    const crewRaw = creditsResponse.data.crew;
    // Only pick the first unique person for each job
    const jobsToExtract = ["Director", "Producer", "Writer"];
    const crewData = await Promise.all(
      jobsToExtract.map(async (job) => {
        const person = crewRaw.find((member: any) => member.job === job);
        if (!person) return null;
        let imdbUrl = null;
        try {
          const personResp = await axios.get(
            `https://api.themoviedb.org/3/person/${person.id}/external_ids`,
            { params: { api_key: tmdbApiKey } }
          );
          if (personResp.data.imdb_id) {
            imdbUrl = `https://www.imdb.com/name/${personResp.data.imdb_id}`;
          }
        } catch (e) {
          console.log(e);
        }
        return {
          id: person.id,
          name: person.name,
          job: person.job,
          imdbUrl,
        };
      })
    );
    const filteredCrewData = crewData.filter(Boolean);

    const result = {
      id: movieData.id,
      title: movieData.title,
      description: movieData.overview,
      posterUrl: movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : "",
      releaseYear: movieData.release_date
        ? movieData.release_date.split("-")[0]
        : "N/A",
      genres: movieData.genres.map((g: any) => g.name),
      rating: movieData.vote_average,
      backdropUrl: movieData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
        : "",
      images: {
        backdrops: movieData.images.backdrops.map(
          (img: any) => `https://image.tmdb.org/t/p/w1280${img.file_path}`
        ),
        posters: movieData.images.posters.map(
          (img: any) => `https://image.tmdb.org/t/p/w500${img.file_path}`
        ),
      },
      trailerUrl: movieData.videos.results.find(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      )?.key
        ? `https://www.youtube.com/embed/${
            movieData.videos.results.find(
              (v: any) => v.site === "YouTube" && v.type === "Trailer"
            ).key
          }`
        : "",
      cast: castData,
      crew: filteredCrewData,
      imdbId: movieData.imdb_id,
      imdbUrl: movieData.imdb_id
        ? `https://www.imdb.com/title/${movieData.imdb_id}`
        : null,
    };

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching movie details from TMDB:", error.message);
    if (error.response) {
      res
        .status(error.response.status)
        .json({
          error: `Failed to fetch movie details: ${error.response.statusText}`,
        });
    } else {
      res
        .status(500)
        .json({
          error:
            "An internal server error occurred while fetching movie details.",
        });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
