import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.post('/api/find-movie', async (req: Request, res: Response) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    // Step 1: Get a list of movie titles from OpenAI
    const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a movie expert. Based on the user\'s description, identify up to 5 possible movie titles. Respond with only a valid JSON array of strings, ordered from most likely to least likely. For example: ["Movie Title 1", "Movie Title 2"]'
        },
        {
          role: 'user',
          content: description
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const openAIContent = openAIResponse.data.choices[0].message.content.trim();
    let movieTitles: string[];

    try {
      movieTitles = JSON.parse(openAIContent);
      if (!Array.isArray(movieTitles)) {
        movieTitles = [openAIContent];
      }
    } catch (e) {
      console.warn("OpenAI response was not valid JSON, treating as a single title.");
      movieTitles = [openAIContent];
    }

    // Step 2: Fetch details for each movie title from TMDB
    const moviePromises = movieTitles.map(async (title) => {
      if (!title) return null;
      const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: { api_key: TMDB_API_KEY, query: title }
      });
      return tmdbResponse.data.results.length > 0 ? tmdbResponse.data.results[0] : null;
    });

    const moviesData = await Promise.all(moviePromises);

    const movieResults = moviesData
      .filter((movie): movie is NonNullable<typeof movie> => movie !== null)
      .map(movie => ({
        title: movie.title,
        description: movie.overview,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
      }));

    if (movieResults.length === 0) {
      return res.status(404).json({ error: 'Could not find any matching movies.' });
    }

    // Step 3: Send the list of movies to the client
    res.json(movieResults);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error processing request:', error);
    }
    res.status(500).json({ error: 'Failed to process your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
