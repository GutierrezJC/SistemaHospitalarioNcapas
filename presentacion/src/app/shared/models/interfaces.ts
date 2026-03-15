export interface TipoVisita {
    id_visita?: number;
    identificacion_visitante: string;
    identificacion_administrador: string;
    motivo_visita?: string;
    fecha_entrada: string; // formato ISO: 'YYYY-MM-DDTHH:mm:ss'
    fecha_salida: string;  // formato ISO: 'YYYY-MM-DDTHH:mm:ss'
    estado: 'en curso' | 'finalizada';
}
export interface TipoVisitante {
    id_Visitante?: number;
    identificacion: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    telefono?: string;
    correo?: string;
    sector_laboral?: string;
}

export interface TipoVisitaFiltrada {
    id_visita: number;
    identificacion_visitante: string;
    nombre_completo_visitante: string;
    identificacion_administrador: string;
    motivo_visita: string;
    fecha_entrada: string;
    fecha_salida: string;
    estado: 'en curso' | 'finalizada';
}
export interface IToken{
    token: string;
    tkRef: string;
}

export interface TipoAdministrador {
    id_Administrador?: number;
    identificacion: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    celular?: string;
    direccion?: string;
    correo: string;
}
