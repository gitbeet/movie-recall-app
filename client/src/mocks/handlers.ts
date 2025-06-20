import { HttpResponse, http } from "msw";

export const handlers = [
  http.post(`${import.meta.env.VITE_API_BASE_URL}/api/movie/find`, () =>
    HttpResponse.json([
      {
        id: 1,
        title: "Mock Movie 1",
        description: "A mock movie description 1",
        posterUrl: "https://via.placeholder.com/150?text=Poster+1",
        releaseYear: "2020",
      },
      {
        id: 2,
        title: "Mock Movie 2",
        description: "A mock movie description 2",
        posterUrl: "https://via.placeholder.com/150?text=Poster+2",
        releaseYear: "2021",
      },
      {
        id: 3,
        title: "Mock Movie 3",
        description: "A mock movie description 3",
        posterUrl: "https://via.placeholder.com/150?text=Poster+3",
        releaseYear: "2022",
      },
      {
        id: 4,
        title: "Mock Movie 4",
        description: "A mock movie description 4",
        posterUrl: "https://via.placeholder.com/150?text=Poster+4",
        releaseYear: "2023",
      },
      {
        id: 5,
        title: "Mock Movie 5",
        description: "A mock movie description 5",
        posterUrl: "https://via.placeholder.com/150?text=Poster+5",
        releaseYear: "2024",
      },
      {
        id: 6,
        title: "Mock Movie 6",
        description: "A mock movie description 6",
        posterUrl: "https://via.placeholder.com/150?text=Poster+6",
        releaseYear: "2025",
      },
      {
        id: 7,
        title: "Mock Movie 7",
        description: "A mock movie description 7",
        posterUrl: "https://via.placeholder.com/150?text=Poster+7",
        releaseYear: "2026",
      },
      {
        id: 8,
        title: "Mock Movie 8",
        description: "A mock movie description 8",
        posterUrl: "https://via.placeholder.com/150?text=Poster+8",
        releaseYear: "2027",
      },
      {
        id: 9,
        title: "Mock Movie 9",
        description: "A mock movie description 9",
        posterUrl: "https://via.placeholder.com/150?text=Poster+9",
        releaseYear: "2028",
      },
      {
        id: 10,
        title: "Mock Movie 10",
        description: "A mock movie description 10",
        posterUrl: "https://via.placeholder.com/150?text=Poster+10",
        releaseYear: "2029",
      },
    ])
  ),
  // Add more handlers as needed
];
