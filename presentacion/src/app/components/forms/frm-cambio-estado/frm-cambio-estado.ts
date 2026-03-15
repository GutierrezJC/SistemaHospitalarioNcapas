import { Component, DestroyRef, inject } from '@angular/core';
import { VisitasServices } from '../../../shared/services/visitas-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frm-cambio-estado',
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './frm-cambio-estado.html',
  styleUrl: './frm-cambio-estado.css'
})
export class FrmCambioEstado {
  titulo!: string;
  private readonly srvVisitante = inject(VisitasServices);
  readonly dialogRef = inject(MatDialogRef<FrmCambioEstado>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly builder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id_Visita: [],
      estado: []
    });
  }

  onGuardar() {
    const formData = this.myForm.value;
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const datosOriginales = this.data.datos[0];
    const datosActualizados = {
      ...datosOriginales,
      estado: formData.estado,
      fecha_salida: fechaActual
    };

    this.srvVisitante.editar(datosActualizados.id_visita, datosActualizados)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false)
      });
  }
}
