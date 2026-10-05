# CLAUDE.md

## Proyecto

Este proyecto es un cliente web para Navidrome desarrollado con Angular.

El objetivo es crear una interfaz moderna para navegar por artistas, álbumes y canciones, y reproducir música utilizando la API de Navidrome/Subsonic.

## Tecnologías

- Angular
- TypeScript
- SCSS
- Navidrome
- Subsonic API
- RxJS

## Reglas generales

- Usar TypeScript estricto.
- No usar `any` salvo que sea absolutamente necesario.
- No instalar librerías nuevas sin preguntarme primero.
- No modificar `package.json` sin mi permiso.
- No modificar `angular.json` sin mi permiso.
- No eliminar archivos sin preguntarme.
- No cambiar configuraciones globales del proyecto sin autorización.
- No introducir Tailwind, Bootstrap u otros frameworks CSS.
- Usar SCSS para los estilos.

## Angular

- Usar componentes standalone.
- Usar las características modernas de Angular.
- Evitar APIs obsoletas/deprecated.
- Separar la lógica de negocio de los componentes.
- Las llamadas a Navidrome deben estar en services.
- Los componentes no deben realizar peticiones HTTP directamente.
- Crear interfaces TypeScript para las respuestas de la API.
- Mantener los componentes pequeños y reutilizables.

Ejemplo:

src/app/
├── core/
│   ├── models/
│   └── services/
├── components/
├── pages/
└── app.routes.ts

## Navidrome

Todas las llamadas a Navidrome deben centralizarse en:

src/app/core/services/

No guardar usuario o contraseña directamente en el código.

Nunca escribir:

const password = "miPassword";

Las credenciales deben gestionarse mediante el sistema de autenticación de la aplicación.

## Seguridad

- Nunca incluir contraseñas, tokens o secretos en el repositorio.
- Nunca mostrar contraseñas en logs.
- No guardar secretos en archivos TypeScript.
- No desactivar medidas de seguridad para solucionar errores.
- Avisarme si una solución puede tener implicaciones de seguridad.

## Cambios en el código

Antes de hacer un cambio grande:

1. Explicar brevemente qué se va a cambiar.
2. Indicar qué archivos serán afectados.
3. Esperar mi confirmación si el cambio afecta a la arquitectura.

Para cambios pequeños no es necesario pedir confirmación.

## Límites

Claude puede:

- Crear componentes.
- Crear servicios.
- Crear interfaces.
- Crear páginas.
- Escribir SCSS.
- Corregir errores.
- Refactorizar código local.

Claude debe preguntarme antes de:

- Instalar dependencias.
- Eliminar archivos.
- Cambiar la arquitectura.
- Modificar configuración de Angular.
- Modificar package.json.
- Añadir un framework.
- Cambiar el sistema de autenticación.
- Realizar cambios grandes en múltiples partes del proyecto.

Claude nunca debe:

- Borrar código que no entiende.
- Sustituir archivos completos cuando basta con modificar unas líneas.
- Introducir credenciales reales.
- Desactivar comprobaciones de TypeScript para evitar errores.
- Usar `any` como solución rápida.

## Estilo de código

Preferir código sencillo y legible.

Evitar funciones excesivamente grandes.

Usar nombres descriptivos:

Bien:

getAlbums()
getArtistById()
currentSong
isPlaying

Mal:

getData()
doStuff()
x
temp

## Comentarios

No añadir comentarios innecesarios.

Evitar:

// Incrementamos el contador
counter++;

Usar comentarios únicamente cuando expliquen decisiones que no sean evidentes.

## Cuando haya un error

No aplicar cambios aleatorios.

Primero:

1. Analizar el error.
2. Identificar la causa probable.
3. Explicar brevemente la causa.
4. Aplicar la solución mínima necesaria.

## Prioridades

En orden:

1. Que funcione correctamente.
2. Seguridad.
3. Código sencillo.
4. Mantenibilidad.
5. Rendimiento.
6. Diseño visual.

No complicar la arquitectura prematuramente.