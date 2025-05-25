import { Injectable } from "@angular/core";
import { SoundQuestion } from "./sound-question.model";

@Injectable({ providedIn: "root" })
export class SoundQuizService {
  /** Phrases officielles du quiz */
  private readonly questions: SoundQuestion[] = [
    {
      id: 1,
      audioSrc: "assets/sounds/1.mp3",
      answer: "Ich gehe jeden Morgen joggen, bevor ich zur Arbeit fahre.",
    },
    {
      id: 2,
      audioSrc: "assets/sounds/2.mp3",
      answer:
        "Das Wetter ist heute wunderschön, die Sonne scheint den ganzen Tag.",
    },
    {
      id: 3,
      audioSrc: "assets/sounds/3.mp3",
      answer: "Kannst du mir bitte helfen, die Einkaufstaschen zu tragen?",
    },
    {
      id: 4,
      audioSrc: "assets/sounds/4.mp3",
      answer:
        "Ich habe gestern einen interessanten Film über das Weltall gesehen.",
    },
    {
      id: 5,
      audioSrc: "assets/sounds/5.mp3",
      answer: "In meiner Freizeit lese ich gerne Bücher oder höre Musik.",
    },
    {
      id: 6,
      audioSrc: "assets/sounds/6.mp3",
      answer: "Der Zug hatte Verspätung wegen eines technischen Problems.",
    },
    {
      id: 7,
      audioSrc: "assets/sounds/7.mp3",
      answer: "Wir müssen den Bericht bis spätestens Freitag abgeben.",
    },
    {
      id: 8,
      audioSrc: "assets/sounds/8.mp3",
      answer: "Mein kleiner Bruder lernt gerade, wie man Fahrrad fährt.",
    },
    {
      id: 9,
      audioSrc: "assets/sounds/9.mp3",
      answer:
        "Ich liebe es, am Wochenende lange Spaziergänge im Wald zu machen.",
    },
    {
      id: 10,
      audioSrc: "assets/sounds/10.mp3",
      answer: "Bitte achten Sie auf Ihre persönlichen Gegenstände.",
    },
  ];

  getQuestions(): SoundQuestion[] {
    return this.questions;
  }
}
