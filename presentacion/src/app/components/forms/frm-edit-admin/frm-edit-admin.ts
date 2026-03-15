import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FrmVisitantes } from '../frm-visitantes/frm-visitantes';
import { AdministradorServices } from '../../../shared/services/administrador-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frm-edit-admin',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule],
  templateUrl: './frm-edit-admin.html',
  styleUrl: './frm-edit-admin.css'
})
export class FrmEditAdmin implements OnInit {
  titulo!: string;
  private readonly Adminservices = inject(AdministradorServices);
  readonly dialogRef = inject(MatDialogRef<FrmVisitantes>);
  private readonly data = inject(MAT_DIALOG_DATA);
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
    this.Adminservices.editar(this.myForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false)
      });
  }

  ngOnInit() {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        identificacion: this.data.datos.identificacion || '',
        nombre: this.data.datos.nombre || '',
        apellido1: this.data.datos.apellido1 || '',
        apellido2: this.data.datos.apellido2 || '',
        telefono: this.data.datos.telefono || '',
        celular: this.data.datos.celular || '',
        direccion: this.data.datos.direccion || '',
        correo: this.data.datos.correo || ''
      });
    }
  }
}
