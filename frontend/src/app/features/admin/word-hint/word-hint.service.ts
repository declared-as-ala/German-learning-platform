/* src/app/core/services/admin-word-hint.service.ts */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface WordHint {
  mongoId?: string;
  sentence: string;
  scrambledSentence: string;
  translation: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
  difficulty: string;
  scoreValue: number;
}

@Injectable({ providedIn: "root" })
export class AdminWordHintService {
  private readonly apiAdmin = `${environment.apiUrl}/admin/wordhint`;
  private readonly apiUser = `${environment.apiUrl}/word-hint`; // si besoin côté user

  constructor(private http: HttpClient) {}

  /** ADMIN CRUD ----------------------------------------------------------- */
  getAll(): Observable<WordHint[]> {
    return this.http.get<WordHint[]>(this.apiAdmin);
  }
  create(data: Omit<WordHint, "id">): Observable<WordHint> {
    return this.http.post<WordHint>(this.apiAdmin, data);
  }
  update(id: string, data: Omit<WordHint, "id">): Observable<WordHint> {
    return this.http.put<WordHint>(`${this.apiAdmin}/${id}`, data);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiAdmin}/${id}`);
  }

  /** USER --------------------------------------------------------------- */
  getRandom(
    level: "easy" | "medium" | "hard",
    num = 10
  ): Observable<WordHint[]> {
    return this.http.get<WordHint[]>(
      `${this.apiUser}?level=${level}&num=${num}`
    );
  }
}
