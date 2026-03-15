import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { VisitasServices } from '../../shared/services/visitas-services';
import { TipoVisitaFiltrada } from '../../shared/models/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';
import { FrmRegistroVisita } from '../forms/frm-registro-visita/frm-registro-visita';
import { FrmCambioEstado } from '../forms/frm-cambio-estado/frm-cambio-estado';
import { AuthService } from '../../shared/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.html',
  styleUrl: './visitas.css',
  imports: [MatCardModule, MatTableModule, MatIconModule],
})
export class Visitas implements AfterViewInit {

  private readonly visitasService = inject(VisitasServices);
  private readonly dialog = inject(MatDialog);
  private readonly servicioAutenticacion = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  columnas: string[] = [
    'id_visita',
    'identificacion_visitante',
    'nombre_completo_visitante',
    'identificacion_administrador',
    'motivo_visita',
    'fecha_entrada',
    'fecha_salida',
    'estado',
    'botonera'
  ];

  filtro: any;
  dataSource = signal(new MatTableDataSource<TipoVisitaFiltrada>());

  soloVisitasVisitantes(): boolean {
    return this.servicioAutenticacion.userActualS().rol === '2';
  }

  ngAfterViewInit(): void {
    if (this.soloVisitasVisitantes()) {
      const id = this.servicioAutenticacion.userActualS().id;
      this.filtro = {
        identificacion_visitante: id,
        identificacion_administrador: '',
        motivo_visita: '',
        estado: '',
        fecha_entrada: ''
      };
    } else {
      this.filtro = {
        identificacion_visitante: '',
        identificacion_administrador: '',
        motivo_visita: '',
        estado: '',
        fecha_entrada: ''
      };
    }
    this.filtrar();
  }

  filtrar() {
    this.visitasService.filtrar(this.filtro)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: TipoVisitaFiltrada[]) => {
          this.dataSource().data = data;
        },
        error: (err) => console.error(err)
      });
  }

  onEditar(id: number) {
    this.visitasService.buscar(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const visita = Array.isArray(data) ? data[0] : data;
        const dialogRef = this.dialog.open(FrmCambioEstado, {
          data: {
            id_Visita: id,
            estado: visita.estado,
            datos: data
          }
        });

        dialogRef.afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((result) => {
            if (result) {
              this.filtrar();
            }
          });
      });
  }

  onInfo(_id: number) { }

  onNuevo() {
    const dialogRef = this.dialog.open(FrmRegistroVisita, {
      width: '50vw',
      maxHeight: '35rem',
      data: { title: 'Nueva Visita' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filtrar());
  }

  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar esta visita?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(resul => {
        if (resul === true) {
          this.visitasService.eliminar(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.dialog.open(DialogoGeneral, {
                data: {
                  texto: 'Visita eliminada correctamente',
                  icono: 'check_circle',
                  textoAceptar: 'Aceptar',
                }
              });
              this.filtrar();
            });
        }
      });
  }
}
