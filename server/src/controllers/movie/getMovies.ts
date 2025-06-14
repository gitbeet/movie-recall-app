import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
export const getMovies = async (req: Request, res: Response) => {
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
};
