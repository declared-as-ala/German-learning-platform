import { Component, OnInit } from "@angular/core";
import { ImageQuestion } from "./image-question.model";
import { ImageQuizService } from "./image-quiz.service";
import { ScoreStore } from "../../../core/store/score.store";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-image-quiz",
  templateUrl: "./image-quiz.component.html",
  styleUrls: ["./image-quiz.component.scss"],
  imports: [CommonModule, FormsModule],
})
export class ImageQuizComponent implements OnInit {
  questions: ImageQuestion[] = [];
  current!: ImageQuestion;
  index = 0;
  userInput = "";
  feedback: "correct" | "incorrect" | null = null;
  quizScore = 0;
  finished = false;

  fxCorrect = new Audio("assets/sounds/correct.mp3");
  fxIncorrect = new Audio("assets/sounds/incorrect.mp3");

  constructor(
    private service: ImageQuizService,
    private scoreStore: ScoreStore
  ) {}

  ngOnInit(): void {
    this.questions = this.service.getQuestions();
    this.current = this.questions[0];
  }

  check(): void {
    if (this.feedback) return;

    const userAns = this.normalize(this.userInput);
    const correctAns = this.normalize(this.current.answer);
    const isCorrect = userAns === correctAns;

    this.feedback = isCorrect ? "correct" : "incorrect";
    this.current.userAnswer = this.userInput;
    this.current.isCorrect = isCorrect;

    if (isCorrect) {
      this.quizScore += 10;
      this.fxCorrect.play().catch(() => {});
    } else {
      this.fxIncorrect.play().catch(() => {});
    }

    this.scoreStore
      .updateScore(isCorrect ? 10 : 0, isCorrect ? 1 : 0, isCorrect ? 0 : 1)
      .subscribe();

    setTimeout(() => this.next(), 1200);
  }

  next(): void {
    this.index++;
    this.userInput = "";
    this.feedback = null;

    if (this.index < this.questions.length) {
      this.current = this.questions[this.index];
    } else {
      this.finished = true;
    }
  }

  restart(): void {
    this.index = 0;
    this.quizScore = 0;
    this.finished = false;
    this.questions.forEach((q) => {
      q.userAnswer = "";
      q.isCorrect = false;
    });
    this.current = this.questions[0];
    this.userInput = "";
    this.feedback = null;
  }

  private normalize(str: string): string {
    return str.toLowerCase().trim();
  }
}
