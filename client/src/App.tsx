import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

interface MovieResult {
  title: string;
  description: string;
  posterUrl: string;
  releaseYear: string;
}

interface Message {
  sender: 'user' | 'bot';
  text?: string;
  movie?: MovieResult;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/find-movie`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const movieResult: MovieResult = await response.json();
      const botMessage: Message = { sender: 'bot', movie: movieResult };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to find movie:", error);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I had trouble finding that movie. Could you try another description?' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold">CineBot</h1>
        <p className="text-sm">Describe a movie, and I'll find it for you!</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.movie && (
                <Card className="w-full max-w-sm bg-card text-card-foreground">
                  <CardHeader className="p-0">
                    <img src={msg.movie.posterUrl} alt={msg.movie.title} className="rounded-t-lg w-full object-cover" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{msg.movie.title} ({msg.movie.releaseYear})</CardTitle>
                    <p className="text-sm text-muted-foreground">{msg.movie.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <p><i>CineBot is thinking...</i></p>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-background border-t">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="e.g., a movie about a rat that becomes a chef in Paris" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default App;

