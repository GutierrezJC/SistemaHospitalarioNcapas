import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { TipoAdministrador } from '../../shared/models/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';
import { AdministradorServices } from '../../shared/services/administrador-services';
import { FrmAdministrador } from '../forms/frm-administrador/frm-administrador';
import { UsuarioServices } from '../../shared/services/usuario-services';
import { FrmEditAdmin } from '../forms/frm-edit-admin/frm-edit-admin';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-administrador',
  imports: [MatCardModule, MatTableModule, MatIconModule],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador implements AfterViewInit {
  dataSource = signal(new MatTableDataSource<TipoAdministrador>());
  private readonly administradorSRV = inject(AdministradorServices);
  private readonly dialog = inject(MatDialog);
  private readonly usuariojSrv = inject(UsuarioServices);
  private readonly destroyRef = inject(DestroyRef);

  columnas: string[] = [
    'identificacion',
    'nombre',
    'apellido1',
    'apellido2',
    'telefono',
    'celular',
    'direccion',
    'correo',
    'botonera'
  ];

  filtro: any;

  ngAfterViewInit(): void {
    this.filtro = { identificacion: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

  filtrar() {
    this.administradorSRV.filtrar(this.filtro)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => this.dataSource.set(data),
        error: (err) => console.error(err)
      });
  }

  onNuevo() {
    const dialogRef = this.dialog.open(FrmAdministrador, {
      width: '50vw',
      maxHeight: '35rem',
      data: { title: 'Nuevo Administrador' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res === true) {
          this.filtrar();
        }
      });
  }

  onEliminar(identificacion: string) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este administrador?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(resul => {
        if (resul === true) {
          this.administradorSRV.eliminar(identificacion)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.dialog.open(DialogoGeneral, {
                data: {
                  texto: 'Administrador eliminado correctamente',
                  icono: 'check_circle',
                  textoAceptar: 'Aceptar',
                }
              });
              this.filtrar();
            });
        }
      });
  }

  onEditar(id: string) {
    this.administradorSRV.buscar(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(FrmEditAdmin, {
          width: '50vw',
          maxHeight: '35rem',
          data: {
            title: 'Editar Administrador',
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

  onInfo(_id: string) { }

  onReset(id: string) {
    this.administradorSRV.buscar(id)
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
