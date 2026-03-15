# Sistema Hospitalario N-Capas

Sistema de gestión de visitas hospitalarias implementado con arquitectura de N capas usando Docker. Permite registrar y administrar visitantes, visitas y administradores del hospital con autenticación JWT.

## Funcionalidades

- Registro y gestión de visitantes (CRUD completo)
- Registro y gestión de visitas con control de estado (en curso / finalizada)
- Gestión de administradores del sistema
- Autenticación con JWT (access token + refresh token)
- Control de acceso por roles (administrador / visitante)
- Restablecimiento de contraseñas

## Arquitectura

El sistema está dividido en 4 capas independientes, cada una corriendo en su propio contenedor Docker:

| Capa | Tecnología | Puerto |
|---|---|---|
| Presentación | Angular 20 + Nginx | 4201 |
| Negocio | FastAPI (Python) | 9000 |
| Datos | FastAPI (Python) | 8000 |
| Base de datos | MySQL | 3307 |
| Admin BD | phpMyAdmin | 8080 |

## Estructura del proyecto

```
SistemaHospitalarioNcapas/
├── presentacion/          # Frontend Angular 20
│   ├── src/app/
│   │   ├── components/    # Componentes (administrador, visitantes, visitas, login)
│   │   ├── shared/
│   │   │   ├── services/  # Servicios HTTP (auth, visitantes, visitas, administrador)
│   │   │   └── models/    # Interfaces y modelos
│   │   └── environments/  # Variables por entorno (dev / prod)
│   └── Dockerfile
├── pynegocio/             # Capa de negocio (FastAPI)
│   └── app/
│       ├── routers/       # Endpoints: auth, visitante, visita, administrador
│       └── main.py
├── pydatos/               # Capa de datos (FastAPI)
│   └── app/
│       ├── routers/       # Endpoints: visitante, visita, administrador, usuario
│       ├── schemas/       # Modelos Pydantic
│       └── services/      # Lógica de acceso a BD
├── db_dump/               # Script SQL de inicialización de la BD
├── docker-compose.yml
└── db_password.txt        # Contraseña de MySQL (ver instrucciones)
```

## Cómo correr

### Requisitos
- Docker y Docker Compose instalados

### 1. Clonar el repositorio

```bash
git clone https://github.com/GutierrezJC/SistemaHospitalarioNcapas.git
cd SistemaHospitalarioNcapas
```

### 2. Crear el archivo de contraseña de la base de datos

```bash
echo "tu_password_aqui" > db_password.txt
```

### 3. Levantar todos los servicios

```bash
docker compose up --build
```

### 4. Acceder al sistema

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4201 |
| phpMyAdmin | http://localhost:8080 |
| API Negocio | http://localhost:9000/docs |
| API Datos | http://localhost:8000/docs |

---

Para desarrollo del frontend sin rebuild de Docker:

```bash
cd presentacion
npm install
ng serve -o   # http://localhost:4200
```

## Tecnologías

**Frontend**
- Angular 20 (componentes standalone)
- TypeScript 5.8
- Angular Signals
- Angular Material
- Tailwind CSS 4 + Flowbite
- JWT (@auth0/angular-jwt)

**Backend**
- Python 3 + FastAPI
- Uvicorn
- MySQL Connector

**Infraestructura**
- Docker + Docker Compose
- Nginx (servidor del frontend en producción)
- MySQL 8
- phpMyAdmin