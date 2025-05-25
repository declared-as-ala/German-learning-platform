export interface ImageQuestion {
  id: number;
  imageSrc: string; // path to image
  answer: string; // correct German word
  userAnswer?: string; // ⬅️ Add this
  isCorrect?: boolean;
}
