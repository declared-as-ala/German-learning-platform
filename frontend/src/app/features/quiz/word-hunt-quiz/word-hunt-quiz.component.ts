// src/app/features/quiz/word-hint/word-hint-quiz.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { interval, Subscription } from "rxjs";

import { AuthService } from "../../../core/services/auth.service";
import { ScoreStore } from "../../../core/store/score.store";
import { WordHintCard, WordHintService } from "./word-hint.service";

@Component({
  selector: "app-word-hint-quiz",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./word-hint-quiz.component.html",
  styleUrls: ["../flashcard/flashcard-quiz.component.css"],
})
export class WordHintQuizComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  /* ─── template refs ─────────────────────────────────────────── */
  @ViewChild("chatContainer") private chat!: ElementRef;
  @ViewChild("answerInput") private input!: ElementRef<HTMLInputElement>;

  /* ─── state ─────────────────────────────────────────────────── */
  cards: WordHintCard[] = [];
  current = 0;
  userAnswer = "";

  isCorrect = false;
  isIncorrect = false;
  reviewMode = false;

  score = 0;
  timer = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;

  userLevel = "";
  isLoading = true;
  error: string | null = null;

  reviewed: { card: WordHintCard; wasCorrect: boolean; userInput: string }[] =
    [];

  /* ─── sounds ────────────────────────────────────────────────── */
  private success = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
  );
  private failure = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3"
  );

  private subs: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private svc: WordHintService,
    private scores: ScoreStore
  ) {}

  /* ─── life-cycle ────────────────────────────────────────────── */
  ngOnInit(): void {
    this.startTimer();
    this.subs.push(
      this.auth.user$.subscribe((u) => {
        if (u) {
          this.userLevel = u.level;
          this.fetch(u.level);
        }
      }),
      this.scores.score$.subscribe((s) => (this.score = s))
    );
  }
  ngAfterViewInit() {
    this.focus();
  }
  ngAfterViewChecked() {
    try {
      this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
    } catch {}
  }
  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  /* ─── data ──────────────────────────────────────────────────── */
  private fetch(level: string) {
    this.isLoading = true;
    this.error = null;
    this.svc.getCards(level).subscribe({
      next: (cards) => {
        this.cards = cards;
        this.isLoading = false;
        if (!cards.length)
          this.error = "No sentence-scramble cards for your level.";
        this.focus();
      },
      error: () => {
        this.error = "Failed to load cards. Please retry.";
        this.isLoading = false;
      },
    });
  }
  retry() {
    const u = this.auth.getCurrentUser();
    u ? this.fetch(u.level) : (this.error = "User not found.");
  }

  /* ─── quiz flow ─────────────────────────────────────────────── */
  validate() {
    const card = this.cards[this.current];
    if (!card) return;

    const expected = card.correctAnswer.trim().toLowerCase();
    const input = this.userAnswer.trim().toLowerCase();

    if (input === expected) {
      this.isCorrect = true;
      this.isIncorrect = false;
      this.score += card.scoreValue;
      this.correctAnswers++;
      this.success.play();
      this.scores.updateScore(this.score, 1, 0).subscribe();
      if (this.current < this.cards.length - 1) {
        setTimeout(() => this.next(), 800);
      }
    } else {
      this.isCorrect = false;
      this.isIncorrect = true;
      this.incorrectAnswers++;
      this.failure.play();
    }

    this.reviewed.push({
      card,
      wasCorrect: this.isCorrect,
      userInput: this.userAnswer,
    });

    if (this.current === this.cards.length - 1) {
      this.reviewMode = true;
      this.scores
        .updateScore(this.score, this.correctAnswers, this.incorrectAnswers)
        .subscribe();
    }

    setTimeout(() => {
      this.isCorrect = this.isIncorrect = false;
      this.userAnswer = "";
      this.focus();
    }, 1500);
  }

  next() {
    if (this.current < this.cards.length - 1) {
      this.current++;
      this.userAnswer = "";
      this.focus();
    }
  }
  prev() {
    if (this.current > 0) {
      this.current--;
      this.userAnswer = "";
      this.focus();
    }
  }

  /* ─── helpers ───────────────────────────────────────────────── */
  startTimer() {
    const sub = interval(1000).subscribe(() => this.timer++);
    this.subs.push(sub);
  }
  format(sec: number) {
    const m = Math.floor(sec / 60);
    return `${m}:${(sec % 60).toString().padStart(2, "0")}`;
  }
  private focus() {
    setTimeout(() => this.input?.nativeElement.focus(), 0);
  }
}
