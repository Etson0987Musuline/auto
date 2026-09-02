# 🚛 Sistema de Gestión y Monitoreo de Flota (Fleet Management)

Aplicación web integral para la administración, monitoreo y gestión en tiempo real de vehículos, conductores, rutas de entrega y estado de flota. Desarrollada con arquitectura desacoplada: **Frontend en Angular**, **Backend en NestJS** y base de datos relacional **PostgreSQL**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu computadora:

- [Node.js](https://nodejs.org/) (Versión 18.x, 20.x o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) (Servicio activo en el puerto `5432`)
- *(Opcional)* [Angular CLI](https://angular.dev/tools/cli) de forma global:
  ```bash
  npm install -g @angular/cli
  ```

---

## 🚀 Guía Rápida de Instalación y Ejecución

Sigue estos pasos en orden para clonar, configurar y levantar todo el sistema:

### 1️⃣ Clonar el Repositorio

Abre tu terminal o consola (PowerShell, Git Bash o CMD) y ejecuta:

```bash
git clone https://github.com/Etson0987Musuline/auto.git
cd auto
```

---

### 2️⃣ Configurar la Base de Datos (PostgreSQL)

1. Abre **pgAdmin** o la consola interactiva **psql**.
2. Crea la base de datos llamada `AngularDB`:

```sql
CREATE DATABASE "AngularDB";
```

> [!NOTE]
> **Configuración por Defecto del Backend:**
> - **Host:** `localhost`
> - **Puerto:** `5432`
> - **Usuario:** `postgres`
> - **Contraseña:** `Admin123`
> - **Base de datos:** `AngularDB`
>
> *Si tu contraseña o usuario de PostgreSQL son diferentes, puedes modificarlos en el archivo `Backend/src/config/database.config.ts` o definir variables de entorno (`DB_PASSWORD`, `DB_USERNAME`, `DB_NAME`, `DB_PORT`, `DB_HOST`).*
> 
> **Auto-Sincronización:** TypeORM creará las tablas automáticamente y poblará los datos iniciales (*seeders*) al arrancar el backend por primera vez.

---

### 3️⃣ Levantar el Backend (NestJS)

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# Entrar a la carpeta del Backend
cd Backend

# Instalar todas las dependencias
npm install

# Iniciar el servidor en modo desarrollo (con recarga automática)
npm run start:dev
```

El servidor backend iniciará en:
📍 **API REST:** `http://localhost:3000/api`

---

### 4️⃣ Levantar el Frontend (Angular)

Abre una **segunda terminal** (sin cerrar la del backend) y ejecuta:

```bash
# Entrar a la carpeta del Frontend
cd Frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo de Angular
npm start
```
*(O si tienes Angular CLI globalmente instalado: `ng serve`)*

Una vez compilado, abre tu navegador web en:
🌐 **Aplicación Web:** `http://localhost:4200`

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | **Angular 21** | Componentes Standalone, SCSS modular, Reactive Forms, SSR |
| **Backend** | **NestJS 12** | Framework Node.js modular, TypeScript, Class Validator |
| **ORM** | **TypeORM** | Mapeo objeto-relacional y sincronización de esquema |
| **Base de Datos**| **PostgreSQL** | Base de datos relacional para persistencia robusta |

---

## 📂 Estructura del Proyecto

```text
auto/
├── Backend/                      # API REST construida con NestJS
│   ├── src/
│   │   ├── config/               # Configuración de base de datos PostgreSQL
│   │   ├── vehicles/             # Módulo, entidad, servicio y controlador de vehículos
│   │   ├── drivers/              # Módulo de conductores y logs de actividad
│   │   ├── routes/               # Módulo de rutas de entrega
│   │   ├── stats/                # Módulo de estadísticas de flota
│   │   └── main.ts               # Punto de entrada del Backend
│   └── package.json
│
├── Frontend/                     # Aplicación Web en Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Componentes visuales (Sidebar, Cards, Modals, Stats)
│   │   │   ├── services/         # Servicios HTTP y comunicación con la API
│   │   │   ├── models/           # Interfaces y modelos TypeScript
│   │   │   └── app.ts            # Componente raíz
│   └── package.json
│
├── DOCUMENTACION_DATABASE_Y_CRUD.md  # Detalle de esquemas, relaciones y operaciones CRUD
└── README.md                     # Guía principal del proyecto
```

---

## 🎯 Funcionalidades Principales

- **Gestión de Vehículos (CRUD Completo):**
  - Registrar nuevos vehículos con asignación de conductor, categoría, placas y dimensiones.
  - Editar información técnica y estados en tiempo real.
  - Eliminar o cambiar estado de actividad.
- **Categorización y Filtrado:**
  - Filtrado rápido por: *Favoritos*, *Furgonetas (Vans)*, *Camiones (Trucks)*.
  - Filtro por estado operativo: *En camino*, *Cargando*, *Esperando*, *Descargando*.
- **Detalle y Métricas del Conductor:**
  - Visualización de viajes completados, horas trabajadas, combustible restante y puntuación.
  - Registro cronológico de actividades y rutas activas con conteo de paquetes.
- **Monitoreo de Estado de la Base de Datos:**
  - Indicador visual dinámico en la cabecera que notifica la conexión activa con PostgreSQL.
- **Visualizador de Documentos:**
  - Modal para consultar licencias de conducir, SOAT/seguros y registros del vehículo.

---

## 🔧 Solución de Problemas Frecuentes

### 1. Error de autenticación en PostgreSQL (`password authentication failed`)
- Verifica que la contraseña en `Backend/src/config/database.config.ts` coincida con la que configuraste al instalar PostgreSQL (por defecto `Admin123`).

### 2. Error al ejecutar `ng serve` en Windows PowerShell (`Execution_Policies`)
- Si PowerShell bloquea los scripts de Angular CLI, ejecuta el comando usando npm:
  ```bash
  npm start
  ```
- O permite la ejecución de scripts en la sesión actual:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

### 3. Puerto 3000 o 4200 en uso
- Asegúrate de no tener otra instancia del backend o frontend ejecutándose. Puedes cambiar el puerto del frontend con `npx ng serve --port 4201`.
