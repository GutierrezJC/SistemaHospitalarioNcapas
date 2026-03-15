import { Component, inject } from '@angular/core';
import { MatDialogModule , MAT_DIALOG_DATA} from '@angular/material/dialog'; // es para el formulario de dialogo y la aplicaicon data 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dialogo-general',
  imports: [MatDialogModule, MatButtonModule, MatIconModule], // importar solo NgModules aquí
  templateUrl: './dialogo-general.html',
  styleUrl: './dialogo-general.css'
})
export class DialogoGeneral {
  readonly data=inject(MAT_DIALOG_DATA); // inyecta los datos que se pasan al dialogo, estos datos son los que se pasan desde el componente que llama al dialogo


}
