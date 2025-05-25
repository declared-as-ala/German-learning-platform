export interface SoundQuestion {
  id: number;
  audioSrc: string; // chemin vers le MP3
  answer: string; // phrase allemande exacte
  userAnswer?: string;
  isCorrect?: boolean;
}
