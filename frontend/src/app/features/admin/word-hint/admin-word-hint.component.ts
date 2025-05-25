import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  Signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormsModule } from "@angular/forms";
import {
  WordHint as WordHintDTO,
  AdminWordHintService as WordHintService,
} from "./word-hint.service";

@Component({
  selector: "app-admin-word-hint",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./admin-word-hint.component.html",
  styles: [
    `
      .input {
        @apply px-2 py-1 text-sm border rounded w-full;
      }
      .btn-primary {
        @apply px-3 py-1 text-sm rounded text-white bg-primary-600 hover:bg-primary-700;
      }
      .btn-secondary {
        @apply px-3 py-1 text-sm rounded border border-primary-600 text-primary-600 hover:bg-primary-50;
      }
      .icon-btn {
        @apply px-2 py-1 text-xs rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50;
      }
      .th {
        @apply px-2 py-1 text-left text-xs whitespace-nowrap;
      }
      .td {
        @apply px-2 py-1 text-xs whitespace-nowrap;
      }
      table {
        font-size: 0.75rem;
      }
    `,
  ],
})
export class AdminWordHintComponent implements OnInit {
  /* ---------- reactive state ------------------------------------------------ */
  data = signal<WordHintDTO[]>([]);
  searchTerm = signal("");
  currentPage = signal(1);
  pageSize = 10;

  /* ---------- UI toggles ---------------------------------------------------- */
  showModal = signal(false);
  editing = signal(false);
  toast = signal<string | null>(null);
  private editingId: string | null = null;

  /* ---------- reactive helpers --------------------------------------------- */
  filtered: Signal<WordHintDTO[]> = computed(() =>
    this.data().filter((w) =>
      JSON.stringify(w).toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  totalPages: Signal<number> = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize))
  );

  paginated: Signal<WordHintDTO[]> = computed(() =>
    this.filtered().slice(
      (this.currentPage() - 1) * this.pageSize,
      this.currentPage() * this.pageSize
    )
  );

  /* ---------- ✅ CORRECT: effect moved outside ngOnInit -------------------- */
  pageEffect = effect(() => {
    this.currentPage.set(Math.min(this.currentPage(), this.totalPages()));
  });

  /* ---------- form ---------------------------------------------------------- */
  form!: FormGroup;

  constructor(private svc: WordHintService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.load();

    this.form = this.fb.group({
      sentence: ["", Validators.required],
      scrambledSentence: ["", Validators.required],
      translation: ["", Validators.required],
      questionText: ["", Validators.required],
      correctAnswer: ["", Validators.required],
      wrongAnswers: ["", Validators.required],
      difficulty: ["Easy", Validators.required],
      scoreValue: [10, [Validators.required, Validators.min(1)]],
    });
  }

  /* ---------- CRUD ---------------------------------------------------------- */
  load() {
    this.svc.getAll().subscribe((res) => this.data.set(res));
  }

  save() {
    const raw = this.form.value;
    const payload: Omit<WordHintDTO, "mongoId" | "id"> = {
      sentence: raw.sentence!.trim(),
      scrambledSentence: raw.scrambledSentence!.trim(),
      translation: raw.translation!.trim(),
      questionText: raw.questionText!.trim(),
      correctAnswer: raw.correctAnswer!.trim(),
      wrongAnswers: (raw.wrongAnswers as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      difficulty: raw.difficulty,
      scoreValue: raw.scoreValue,
    };

    const req$ =
      this.editing() && this.editingId
        ? this.svc.update(this.editingId, payload)
        : this.svc.create(payload);

    req$.subscribe(() => {
      this.flash(this.editing() ? "Updated 🎉" : "Created 🎉");
      this.closeModal();
      this.load();
    });
  }

  delete(id: string) {
    if (confirm("Delete this word-hint?")) {
      this.svc.delete(id).subscribe(() => {
        this.flash("Deleted 🗑️");
        this.load();
      });
    }
  }

  /* ---------- helpers ------------------------------------------------------- */
  openModal(item?: WordHintDTO) {
    if (item) {
      this.editing.set(true);
      this.editingId = item.mongoId!;
      this.form.patchValue({
        sentence: item.sentence,
        scrambledSentence: item.scrambledSentence,
        translation: item.translation,
        questionText: item.questionText,
        correctAnswer: item.correctAnswer,
        wrongAnswers: item.wrongAnswers.join(", "),
        difficulty: item.difficulty,
        scoreValue: item.scoreValue,
      });
    } else {
      this.editing.set(false);
      this.editingId = null;
      this.form.reset({
        sentence: "",
        scrambledSentence: "",
        translation: "",
        questionText: "",
        correctAnswer: "",
        wrongAnswers: "",
        difficulty: "Easy",
        scoreValue: 10,
      });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  applyFilters() {
    this.currentPage.set(1);
  }

  prev() {
    if (this.currentPage() > 1) this.currentPage.update((n) => n - 1);
  }

  next() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((n) => n + 1);
  }

  changePage(page: number) {
    this.currentPage.set(page);
  }

  private flash(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 2500);
  }
}
