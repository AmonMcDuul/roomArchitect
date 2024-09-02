import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawableObject } from '../../models/drawable-object.model';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() isColored: boolean = false;
  @Input() object: DrawableObject | null = null;
  @Input() row: number | undefined;
  @Input() col: number | undefined;
  @Output() cellClick = new EventEmitter<void>();

  onClick(): void {
    this.cellClick.emit();
  }

  isTopLeftCell(): boolean {
    return (
      this.object !== null &&
      this.row !== undefined &&
      this.col !== undefined &&
      this.row === this.object.y &&
      this.col === this.object.x
    );
  }
}
