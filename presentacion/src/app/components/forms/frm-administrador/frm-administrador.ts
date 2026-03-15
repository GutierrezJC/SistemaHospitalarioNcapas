import { Component, inject, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FrmVisitantes } from '../frm-visitantes/frm-visitantes';
import { AdministradorServices } from '../../../shared/services/administrador-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frm-administrador',
  imports: [FormsModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './frm-administrador.html',
  styleUrl: './frm-administrador.css'
})
export class FrmAdministrador {
  titulo!: string;
  private readonly Adminservices = inject(AdministradorServices);
  readonly dialogRef = inject(MatDialogRef<FrmVisitantes>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly builder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      identificacion: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      telefono: [''],
      celular: [''],
      direccion: [''],
      correo: ['']
    });
  }

  onGuardar() {
    this.Adminservices.guardar(this.myForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close(false);
        }
      });
  }
}
