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
    // Step 1: Get movie title from OpenAI
    const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a movie expert. Based on the user\'s description, identify the most likely movie title. Respond with only the movie title and nothing else.'
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

    const movieTitle = openAIResponse.data.choices[0].message.content.trim();

    // Step 2: Get movie details from TMDB
    const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query: movieTitle
      }
    });

    if (tmdbResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'Movie not found on TMDB.' });
    }

    const movie = tmdbResponse.data.results[0];

    // Step 3: Send combined data to the client
    res.json({
      title: movie.title,
      description: movie.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseYear: movie.release_date.split('-')[0]
    });

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
