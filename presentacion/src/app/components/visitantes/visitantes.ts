import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { TipoVisitante } from '../../shared/models/interfaces';
import { VisitantesServices } from '../../shared/services/visitantes-services';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FrmVisitantes } from '../forms/frm-visitantes/frm-visitantes';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';
import { UsuarioServices } from '../../shared/services/usuario-services';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-visitantes',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule, MatInputModule, MatFormFieldModule],
  templateUrl: './visitantes.html',
  styleUrl: './visitantes.css'
})
export class Visitantes implements AfterViewInit {
  private readonly visitanteSrv = inject(VisitantesServices);
  private readonly dialog = inject(MatDialog);
  private readonly usuariojSrv = inject(UsuarioServices);
  private readonly destroyRef = inject(DestroyRef);

  panelOpenState = signal(false);
  columnas: string[] = ['identificacion', 'nombre', 'apellido1', 'apellido2', 'telefono', 'correo', 'sector_laboral', 'botonera'];
  filtro: any;
  dataSource = signal(new MatTableDataSource<TipoVisitante>());

  ngAfterViewInit(): void {
    this.filtro = { identificacion: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

  onFiltroChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  limpiarFiltros() {
    this.restablecerFiltro();
    (document.querySelector('#fidUsuario') as HTMLInputElement).value = '';
    (document.querySelector('#nombre') as HTMLInputElement).value = '';
    (document.querySelector('#apellido1') as HTMLInputElement).value = '';
    (document.querySelector('#apellido2') as HTMLInputElement).value = '';
  }

  restablecerFiltro() {
    this.filtro = { identificacion: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

  filtrar() {
    this.visitanteSrv.filtrar(this.filtro)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => this.dataSource.set(data),
        error: (err) => console.error(err)
      });
  }

  onNuevo() {
    const dialogRef = this.dialog.open(FrmVisitantes, {
      width: '50vw',
      maxHeight: '35rem',
      data: { title: 'Nuevo Visitante' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res !== false) {
          this.filtrar();
        }
      });
  }

  onEditar(id: number) {
    this.visitanteSrv.buscar(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(FrmVisitantes, {
          width: '50vw',
          maxHeight: '35rem',
          data: {
            title: 'Editar Visitante',
            datos: data
          },
          disableClose: true
        });

        dialogRef.afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            if (res !== false) {
              this.filtrar();
            }
          });
      });
  }

  onEliminar(id: string) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este visitante?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(resul => {
        if (resul === true) {
          this.visitanteSrv.eliminar(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.dialog.open(DialogoGeneral, {
                data: {
                  texto: 'Visitante eliminado correctamente',
                  icono: 'check_circle',
                  textoAceptar: 'Aceptar',
                }
              });
              this.filtrar();
            });
        }
      });
  }

  onInfo(_id: number) { }

  onReset(id: number) {
    this.visitanteSrv.buscar(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(DialogoGeneral, {
          data: {
            texto: `¿Está seguro de que desea restablecer la contraseña de ${data.nombre}?`,
            icono: 'question_mark',
            textoAceptar: 'si',
            textoCancelar: 'no'
          }
        });

        dialogRef.afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(resul => {
            if (resul === true) {
              this.usuariojSrv.resetearPassw(data.identificacion)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                  this.dialog.open(DialogoGeneral, {
                    data: {
                      texto: 'Contraseña restablecida correctamente',
                      icono: 'check_circle',
                      textoAceptar: 'Aceptar',
                    }
                  });
                });
            }
          });
      });
  }
}
