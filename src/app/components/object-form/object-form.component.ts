import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObjectService } from '../../services/object.service';

@Component({
  selector: 'app-object-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './object-form.component.html',
  styleUrl: './object-form.component.scss'
})
export class ObjectFormComponent {
  objectForm: FormGroup;
  @Output() objectCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private objectService: ObjectService) {
    this.objectForm = this.fb.group({
      width: [1, [Validators.required, Validators.min(1)]],
      height: [1, [Validators.required, Validators.min(1)]],
      mustTouchWall: [false],
    });
  }

  onSubmit(): void {
    if (this.objectForm.valid) {
      const { width, height, mustTouchWall } = this.objectForm.value;
      this.objectService.addObject(width, height, mustTouchWall);
      this.objectCreated.emit();
      this.objectForm.reset({ width: 1, height: 1, mustTouchWall: false });
    }
  }
}