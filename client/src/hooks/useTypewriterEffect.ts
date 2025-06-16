import { useEffect, useState, useRef } from "react";

/**
 * useTypewriterEffect
 * @param prompts Array of strings to cycle through as typewriter effect
 * @param typingSpeed ms per character (default: 80)
 * @param pauseDelay ms to pause after typing a full string (default: 1200)
 * @param eraseSpeed ms per character when erasing (default: 40)
 * @returns placeholder string
 */
export function useTypewriterEffect(
  prompts: string[],
  typingSpeed = 80,
  pauseDelay = 1200,
  eraseSpeed = 40
) {
  const [placeholder, setPlaceholder] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPrompt = prompts[promptIndex] || "";
    if (!isErasing && placeholder.length < currentPrompt.length) {
      timeoutRef.current = setTimeout(() => {
        setPlaceholder(currentPrompt.slice(0, placeholder.length + 1));
      }, typingSpeed);
    } else if (!isErasing && placeholder.length === currentPrompt.length) {
      timeoutRef.current = setTimeout(() => setIsErasing(true), pauseDelay);
    } else if (isErasing && placeholder.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setPlaceholder(currentPrompt.slice(0, placeholder.length - 1));
      }, eraseSpeed);
    } else if (isErasing && placeholder.length === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsErasing(false);
        setPromptIndex((i) => (i + 1) % prompts.length);
      }, 400);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    placeholder,
    isErasing,
    promptIndex,
    prompts,
    typingSpeed,
    pauseDelay,
    eraseSpeed,
  ]);

  return placeholder;
}
