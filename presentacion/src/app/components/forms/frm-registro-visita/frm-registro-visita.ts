import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VisitasServices } from '../../../shared/services/visitas-services';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { AuthService } from '../../../shared/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frm-registro-visita',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-registro-visita.html',
  styleUrl: './frm-registro-visita.css'
})
export class FrmRegistroVisita {
  titulo!: string;
  private readonly visitanteservice = inject(VisitasServices);
  readonly dialogRef = inject(MatDialogRef<FrmRegistroVisita>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly builder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly srvAuth = inject(AuthService);

  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      identificacion_visitante: [''],
      nombre_visitante: [''],
      motivo_visita: [''],
      descripcion: ['']
    });
  }

  private esAdministrador(): boolean {
    return this.srvAuth.userActualS().rol === '1';
  }

  onGuardar() {
    const identificacionAdmin = this.esAdministrador()
      ? this.srvAuth.userActualS().id.toString()
      : '1234567';

    const formData = this.myForm.value;
    const visitaParaGuardar = {
      identificacion_visitante: formData.identificacion_visitante,
      identificacion_administrador: identificacionAdmin,
      motivo_visita: formData.motivo_visita,
      fecha_entrada: new Date().toISOString().slice(0, 19).replace('T', ' '),
      fecha_salida: null,
      estado: 'en curso'
    };

    this.visitanteservice.guardar(visitaParaGuardar)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneral, {
            data: {
              texto: 'Visita creada correctamente',
              titulo: 'Visita creada',
              icono: 'check',
              textoAceptar: 'Aceptar'
            }
          });
          this.dialogRef.close(true);
        }
      });
  }
}
