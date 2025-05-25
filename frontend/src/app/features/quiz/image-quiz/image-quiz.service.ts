import { Injectable } from "@angular/core";
import { ImageQuestion } from "./image-question.model";

@Injectable({ providedIn: "root" })
export class ImageQuizService {
  private readonly questions: ImageQuestion[] = [
    { id: 1, imageSrc: "assets/images/appel.png", answer: "Apfel" },
    { id: 2, imageSrc: "assets/images/book.jpg", answer: "Buch" },
    { id: 3, imageSrc: "assets/images/car.jpeg", answer: "Auto" },
    { id: 4, imageSrc: "assets/images/coffe.jpeg", answer: "Kaffee" },
    { id: 5, imageSrc: "assets/images/dog.jpg", answer: "Hund" },
    { id: 6, imageSrc: "assets/images/facebook.png", answer: "Facebook" },
    { id: 7, imageSrc: "assets/images/football.jpeg", answer: "Fußball" },
    { id: 8, imageSrc: "assets/images/german.png", answer: "Deutsch" },
    { id: 9, imageSrc: "assets/images/house.jpg", answer: "Haus" },
    { id: 10, imageSrc: "assets/images/lemon.jpeg", answer: "Zitrone" },
    { id: 11, imageSrc: "assets/images/pasta.jpeg", answer: "Nudeln" },
    { id: 12, imageSrc: "assets/images/phone.jpeg", answer: "Telefon" },
    { id: 13, imageSrc: "assets/images/plane.jpeg", answer: "Flugzeug" },
    { id: 14, imageSrc: "assets/images/rabbit.jpeg", answer: "Hase" },
    { id: 15, imageSrc: "assets/images/tree.jpg", answer: "Baum" },
    { id: 16, imageSrc: "assets/images/tv.jpeg", answer: "Fernseher" },
    { id: 17, imageSrc: "assets/images/water.jpg", answer: "Wasser" },
  ];

  getQuestions(): ImageQuestion[] {
    return this.questions;
  }
}
