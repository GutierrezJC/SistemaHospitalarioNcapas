import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitantesServices } from '../../../shared/services/visitantes-services';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frm-visitantes',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-visitantes.html',
  styleUrl: './frm-visitantes.css'
})
export class FrmVisitantes implements OnInit {

  titulo!: string;
  private readonly srvVisitante = inject(VisitantesServices);
  readonly dialogRef = inject(MatDialogRef<FrmVisitantes>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly builder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id_Visitante: [0],
      identificacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: [''],
      telefono: [''],
      correo: [''],
      sector_laboral: ['']
    });
  }

  onGuardar() {
    if (this.myForm.value.id_Visitante === 0) {
      this.srvVisitante.guardar(this.myForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Visitante creado correctamente',
                titulo: 'Visitante creado',
                icono: 'check',
                textoAceptar: 'Aceptar'
              }
            });
            this.dialogRef.close(true);
          }
        });
    } else {
      this.srvVisitante.guardar(this.myForm.value, this.myForm.value.id_Visitante)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Visitante actualizado correctamente',
                titulo: 'Visitante actualizado',
                icono: 'check',
                textoAceptar: 'Aceptar'
              }
            });
            this.dialogRef.close(true);
          }
        });
    }
  }

  ngOnInit() {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        id_Visitante: this.data.datos.id_Visitante,
        identificacion: this.data.datos.identificacion,
        nombre: this.data.datos.nombre,
        apellido1: this.data.datos.apellido1,
        apellido2: this.data.datos.apellido2,
        telefono: this.data.datos.telefono,
        correo: this.data.datos.correo,
        sector_laboral: this.data.datos.sector_laboral
      });
    }
  }
}
