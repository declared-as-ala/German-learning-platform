import { Component, OnInit } from "@angular/core";
import { SoundQuizService } from "./sound-quiz.service";
import { SoundQuestion } from "./sound-question.model";
import { ScoreStore } from "../../../core/store/score.store";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-sound-quiz",
  standalone: true,
  templateUrl: "./sound-quiz.component.html",
  imports: [CommonModule, FormsModule],
})
export class SoundQuizComponent implements OnInit {
  questions: SoundQuestion[] = [];
  current!: SoundQuestion;
  index = 0;

  userInput = "";
  feedback: "correct" | "incorrect" | null = null;

  quizScore = 0;
  finished = false;

  private player = new Audio();
  private fxCorrect = new Audio("assets/sounds/correct.mp3");
  private fxIncorrect = new Audio("assets/sounds/incorrect.mp3");

  globalScore$ = this.scoreStore.score$;

  constructor(
    private service: SoundQuizService,
    private scoreStore: ScoreStore
  ) {}

  ngOnInit(): void {
    this.questions = this.service.getQuestions();
    this.current = this.questions[0];
    this.playCurrentAudio();
  }

  playCurrentAudio(): void {
    this.player.src = this.current.audioSrc;
    this.player.play().catch(() => {});
  }

  check(): void {
    if (this.feedback) return;

    const userAns = this.normalize(this.userInput);
    const correctAns = this.normalize(this.current.answer);
    const correct = userAns === correctAns;

    this.feedback = correct ? "correct" : "incorrect";
    (correct ? this.fxCorrect : this.fxIncorrect).play().catch(() => {});

    this.current.userAnswer = this.userInput;
    this.current.isCorrect = correct;

    if (correct) this.quizScore += 10;

    this.scoreStore
      .updateScore(correct ? 10 : 0, correct ? 1 : 0, correct ? 0 : 1)
      .subscribe();

    setTimeout(() => this.next(), 1200);
  }

  next(): void {
    this.userInput = "";
    this.feedback = null;
    this.index++;

    if (this.index < this.questions.length) {
      this.current = this.questions[this.index];
      this.playCurrentAudio();
    } else {
      this.finished = true;
    }
  }

  restart(): void {
    this.index = 0;
    this.quizScore = 0;
    this.finished = false;
    this.feedback = null;
    this.questions.forEach((q) => {
      q.userAnswer = "";
      q.isCorrect = false;
    });
    this.current = this.questions[0];
    this.userInput = "";
    this.playCurrentAudio();
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/[.,;:!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
