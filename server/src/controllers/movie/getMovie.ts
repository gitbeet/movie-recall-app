import { Request, Response } from "express";
import axios from "axios";

export const getMovieData = async (req: Request, res: Response) => {
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
      voteCount: movieData.vote_count,
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
      res.status(error.response.status).json({
        error: `Failed to fetch movie details: ${error.response.statusText}`,
      });
    } else {
      res.status(500).json({
        error:
          "An internal server error occurred while fetching movie details.",
      });
    }
  }
};
