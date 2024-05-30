# Conexa Challenge

Este es un proyecto de desafío desarrollado utilizando NestJS, TypeORM y Swagger. El proyecto incluye la implementación de autenticación JWT, controladores para usuarios y películas, y DTOs para manejar la transferencia de datos.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tests](#tests)

## Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- PNPM (versión 6 o superior) o NPM/Yarn

### Pasos de Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/nachosabatini/conexa-challenge.git
   cd conexa-challenge
   ```

2. Instala las dependencias:

   ```sh
   pnpm install
   ```

3. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   DATABASE_URI=postgres://figlzrvj:w2xuRPbQ7V5RmzzWwa3TRd65jly_IpMl@fanny.db.elephantsql.com/figlzrvj
   PORT=4000
   NODE_ENV=development
   JWT_SECRET=f3c48d892dfb19e832b1a8e17e4ed2b4a5d91c5ff3c53deba39403fbf5e54e2b1e2f8e33a4b8f9f6b9cebdab17357d30b2a02e8b4f2d3a9a5c391aebe89c27f1
   ```

4. La base de datos esta hosteada por lo que no es necesario correr migracion

5. Inicia la aplicación:

   ```sh
   pnpm start
   ```

## Uso

Para interactuar con la API, puedes utilizar herramientas como Postman o directamente desde Swagger, que se encuentra en la ruta `/api` de tu servidor.

## Endpoints

### Autenticación

- `POST /auth/login` - Inicia sesión y obtiene un token JWT.
- `POST /auth/register` - Registra un nuevo usuario.

### Usuarios

- `GET /user` - Obtiene una lista de todos los usuarios.
- `GET /user/:id` - Obtiene un usuario por ID.
- `POST /user/register` - Crea un nuevo usuario.
- `PUT /user/:id` - Actualiza un usuario existente.
- `DELETE /user/:id` - Elimina un usuario por ID.

### Películas

- `GET /movie` - Obtiene una lista de todas las películas.
- `GET /movie/:id` - Obtiene una película por ID.
- `POST /movie` - Crea una nueva película.
- `PUT /movie/:id` - Actualiza una película existente.
- `DELETE /movie/:id` - Elimina una película por ID.

## Estructura del Proyecto

```bash
src
├── auth
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.guard.ts
├── config
│   └── role.enum.ts
├── utils
│   ├── decorators
│   │   └── roles.decorator.ts
│   └── guards
│   │ └── roles.guard.ts
│   └── pipes
│       └── typePipeValidation.ts
├── model
│   ├── dto
│   │   ├── user.dto.ts
│   │   └── movie.dto.ts
│   └── entities
│       ├── user.ts
│       └── movie.ts
├── user
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── user.service.ts
├── movie
│   ├── movie.controller.ts
│   ├── movie.module.ts
│   ├── movie.service.ts
└── main.ts
```

## Tests

Para ejecutar los tests, utiliza el siguiente comando:

```sh
pnpm test
```

o para ver el coverage

```sh
pnpm test:cov
```
