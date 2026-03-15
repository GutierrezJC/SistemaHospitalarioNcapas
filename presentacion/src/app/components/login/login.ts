import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { FrmLogin } from '../forms/frm-login/frm-login';
// SIEMPRES QUE OCUPE UN COMPONENTE LO TENGO QUE LAMAR ESTO LO HICIMOS PARA PERSI FUNCIONABA EEL LOGIN Y EL NGONINITN SICE QUE DESPUES QUW SE CARGQUE ESTE 
// COMPONENTE OSEA EL PRINCIPAL ENTONCES CARGAAR LO QUE ESTE EN NGONINIT QUE EN ESTE CASO ES EL DIALOG OSEA EL FRM LOGIN  

@Component({
  selector: 'app-login',
  imports: [MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {  // apaenas se inicializa el componente se ejecuta el ngOnInit osea el metodo ngOnInit
  private readonly dialog= inject(MatDialog);// el abre ventanas osea el mayordomo que abre ventanas

  ngOnInit():void {// on init es para que se ejecute una vez que el componente ha sido inicializado
    // const dialogRef = this.dialog.open(FrmLogin, {
    //   width: '400px',
    //   height: '300px',
    //   disableClose: true // Evita que se cierre al hacer clic fuera del cuadro de diálogo
    // });
  }

}
