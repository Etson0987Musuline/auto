# Documentación Completa: Conexión PostgreSQL y Operaciones CRUD

Esta guía documenta la integración completa entre la aplicación Web en **Angular**, el servidor backend en **NestJS** y la base de datos relacional **PostgreSQL** (`AngularDB`).

---

## 1. Arquitectura de la Aplicación

```
┌─────────────────────────┐       HTTP / REST API        ┌─────────────────────────┐       TypeORM Driver       ┌─────────────────────────┐
│     Frontend Angular    │ ───────────────────────────> │     Backend NestJS      │ ─────────────────────────> │   PostgreSQL Database   │
│  http://localhost:4200  │ <─────────────────────────── │  http://localhost:3000  │ <───────────────────────── │       (AngularDB)       │
└─────────────────────────┘                              └─────────────────────────┘                            └─────────────────────────┘
```

- **Frontend**: Angular 21 con componentes modulares standalone, plantillas `.html` y hojas de estilos aisladas `.scss` (< 200 líneas por archivo).
- **Backend**: NestJS con TypeORM ORM y controlador REST API en el prefijo `/api`.
- **Base de Datos**: PostgreSQL con la base de datos `AngularDB`.

---

## 2. Configuración de PostgreSQL

### Credenciales de Conexión
El archivo de configuración [`Backend/src/config/database.config.ts`](file:///c:/Users/Norah/Desktop/AngularDB/Backend/src/config/database.config.ts) define los siguientes parámetros por defecto:

```typescript
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Admin123',
  database: process.env.DB_NAME || 'AngularDB',
  entities: [Vehicle, Route],
  synchronize: true, // Sincronización automática de tablas en desarrollo
};
```

### Pasos para preparar PostgreSQL:
1. Asegúrate de que el servicio de **PostgreSQL** esté ejecutándose en tu equipo en el puerto `5432`.
2. Abre **pgAdmin** o la consola `psql` y crea la base de datos ejecutando:
   ```sql
   CREATE DATABASE "AngularDB";
   ```
3. Al iniciar el backend (`npm run start:dev` en `Backend/`), TypeORM creará automáticamente las tablas `vehicles` y `routes` mediante la propiedad `synchronize: true` y poblará los datos iniciales (*seed data*).

---

## 3. Estructura de Tablas en PostgreSQL

### Tabla `vehicles`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `PRIMARY KEY (SERIAL)` | Identificador único del vehículo |
| `driverName` | `VARCHAR` | Nombre completo del conductor |
| `driverIdCode` | `VARCHAR` | Código de identificación del conductor |
| `vehicleModel` | `VARCHAR` | Modelo del vehículo |
| `status` | `VARCHAR` | Estado (`ON THE WAY`, `LOADING`, `WAITING`, `UNLOADING`) |
| `category` | `VARCHAR` | Categoría (`FAVORITES`, `TRUCKS`, `VANS`) |
| `payload` | `VARCHAR` | Capacidad de carga (ej. `2,885 lbs`) |
| `loadVolume` | `VARCHAR` | Volumen de carga (ej. `0.55 in³`) |
| `loadLength` | `VARCHAR` | Largo de carga (ej. `117 in`) |
| `loadWidth` | `VARCHAR` | Ancho de carga (ej. `67 in`) |
| `licensePlate` | `VARCHAR` | Matrícula / Placa |

### Tabla `routes`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `PRIMARY KEY (SERIAL)` | Identificador de la ruta |
| `routeCode` | `VARCHAR` | Código de la ruta (ej. `107-591`) |
| `packageCount` | `INTEGER` | Número de paquetes |
| `origin` | `VARCHAR` | Dirección de origen |
| `destination` | `VARCHAR` | Dirección de destino |
| `vehicleId` | `FOREIGN KEY` | Relación con la tabla `vehicles` |

---

## 4. Guía de Pruebas de Operaciones CRUD

Puedes realizar y verificar las pruebas del ciclo CRUD completo directamente desde la interfaz Web o a través de comandos HTTP REST:

### A. CREATE (Crear Conductor / Vehículo)
- **Desde la Web**:
  1. En la barra lateral de vehículos, haz clic en el botón **`+ Add New Vehicle`**.
  2. Llena el formulario (Nombre del Conductor, Modelo de Vehículo, Categoría, Estado y Matrícula).
  3. Haz clic en **Save Vehicle**.
  4. El vehículo se inserta inmediatamente en PostgreSQL y aparece al instante en la lista de la aplicación Web.
- **Vía API REST**:
  ```bash
  curl -X POST http://localhost:3000/api/vehicles \
    -H "Content-Type: application/json" \
    -d '{"driverName": "Carlos Mendoza", "vehicleModel": "Volvo FL", "category": "TRUCKS", "status": "ON THE WAY", "licensePlate": "8XPT102"}'
  ```

### B. READ (Consultar Vehículos y Estado de la DB)
- **Desde la Web**:
  - Al cargar la página, se realiza la petición GET `/api/vehicles`.
  - El indicador superior muestra el estado de la conexión con la base de datos:
    - **Verde (`PostgreSQL AngularDB Connected`)**: Conexión viva y activa con PostgreSQL.
    - **Rojo (`Backend Offline or DB Disconnected`)**: En caso de que la DB no esté iniciada o las credenciales cambien.
- **Vía API REST**:
  ```bash
  curl http://localhost:3000/api/vehicles
  ```

### C. UPDATE (Actualizar Registro)
- **Desde la Web**:
  1. Selecciona cualquier vehículo de la lista.
  2. En la tarjeta superior del conductor, haz clic en el botón azul **`Edit`**.
  3. Cambia los datos en el modal (por ejemplo, modifica el nombre del conductor o el estado) y presiona **Update Vehicle**.
  4. La base de datos actualiza la fila mediante `PUT /api/vehicles/:id` y la vista se refresca automáticamente.
- **Vía API REST**:
  ```bash
  curl -X PUT http://localhost:3000/api/vehicles/3 \
    -H "Content-Type: application/json" \
    -d '{"driverName": "James Lubin Jr.", "status": "LOADING"}'
  ```

### D. DELETE (Eliminar Registro)
- **Desde la Web**:
  1. Selecciona el vehículo a eliminar.
  2. Haz clic en el botón rojo **`Delete`** en la tarjeta superior.
  3. Confirma el mensaje de advertencia.
  4. El registro se elimina permanentemente de PostgreSQL mediante `DELETE /api/vehicles/:id` y se remueve de la lista.
- **Vía API REST**:
  ```bash
  curl -X DELETE http://localhost:3000/api/vehicles/3
  ```

---

## 5. Navegación por las Secciones de la Barra Lateral

La barra lateral izquierda permite conmutar en tiempo real entre las siguientes 8 secciones:

1. 🚚 **Fleet Vehicles (`van`)**: Panel principal de gestión de vehículos, tarjeta de especificaciones, mapa de rutas y gráficos estadísticos.
2. ✉️ **Messages (`messages`)**: Buzón de mensajes de conductores e incidencias de entrega.
3. 📍 **Routes Map (`route`)**: Seguimiento interactivo en mapa GPS.
4. 🏠 **Overview (`home`)**: Resumen general de KPIs de la empresa.
5. 📄 **Documents (`docs`)**: Gestión de pólizas, licencias e inspecciones.
6. 📊 **Analytics (`analytics`)**: Gráficos de eficiencia de combustible y rendimiento.
7. 🔔 **Alerts (`alerts`)**: Alertas del sistema y mantenimientos programados.
8. 👤 **Profile (`profile`)**: Ajustes de usuario y configuración del servidor PostgreSQL.

---

## 6. Comandos para Ejecutar el Proyecto

### 1. Iniciar el Backend (NestJS)
```powershell
cd c:\Users\Norah\Desktop\AngularDB\Backend
npm run start:dev
```
Servidor backend escuchando en: `http://localhost:3000/api`

### 2. Iniciar el Frontend (Angular)
```powershell
cd c:\Users\Norah\Desktop\AngularDB\Frontend
npm start
```
Aplicación web disponible en: `http://localhost:4200`

---

## 7. Solución de Problemas Comunes (Troubleshooting)

- **Error: `password authentication failed for user "postgres"`**
  - Verifica que la contraseña del usuario `postgres` en tu equipo sea `Admin123`. Puedes ajustarla en `Backend/src/config/database.config.ts`.
- **Error: `database "AngularDB" does not exist`**
  - Asegúrate de haber ejecutado `CREATE DATABASE "AngularDB";` en tu cliente de PostgreSQL.
- **Error: `connect ECONNREFUSED 127.0.0.1:5432`**
  - Verifica que el servicio de PostgreSQL esté iniciado en tu sistema operativo Windows.
