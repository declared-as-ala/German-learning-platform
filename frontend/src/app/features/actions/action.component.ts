import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-action",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class ActionComponent {
  constructor(private router: Router) {}

  navigateToTranslation(): void {
    this.router.navigateByUrl("/dashboard/translate");
  }

  navigateToChatbot(): void {
    this.router.navigateByUrl("/dashboard/chat");
  }

  navigateToQuiz(): void {
    this.router.navigateByUrl("/dashboard/quiz");
  }
}
