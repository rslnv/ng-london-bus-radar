import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-line-filter',
  templateUrl: './line-filter.components.html',
  styleUrl: './line-filter.components.scss',
  standalone: true,
})
export class LineFilterComponent {
  lines = input.required<{ id: string; name: string }[]>();
  preSelectedLine = input<string | null>(null);
  filter = output<string | null>();

  select = signal<string | 'showAll' | null>(null);
  selectedId = computed(() =>
    this.lines().length === 1
      ? this.lines()[0].id
      : (this.select() ?? this.preSelectedLine() ?? 'showAll'),
  );

  constructor() {
    effect(() =>
      this.filter.emit(
        this.selectedId() === 'showAll' ? null : this.selectedId(),
      ),
    );
  }
}
