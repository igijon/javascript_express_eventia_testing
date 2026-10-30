# DESAFÍO · ¿Está Eventia preparada para producción?

## Contexto

Eventia es una plataforma web para consultar eventos y reservar entradas. La empresa quiere publicarla y solicita una auditoría técnica previa. Vuestro equipo debe estudiar la aplicación, evaluar sus riesgos y emitir una recomendación fundamentada.

Disponéis del código fuente de una aplicación formada por un frontend JavaScript y una API REST. La API devuelve JSON y mantiene los datos en memoria; no existe una base de datos real.

## Objetivo

Evaluar la seguridad de Eventia combinando análisis de arquitectura y amenazas, pruebas funcionales y negativas, análisis estático, análisis dinámico y revisión de la configuración HTTP.

No se trata de conseguir que las herramientas no muestren alertas. Se trata de interpretar los resultados, obtener evidencias y decidir qué debe corregirse antes de un despliegue.

---

## Parte 1. Preparación del entorno

### Requisitos

- Node.js 20 o superior.
- npm.
- Visual Studio Code u otro editor.
- Navegador actualizado.
- Semgrep y OWASP ZAP.

### 1. Obtener el proyecto

Descargad el ZIP facilitado por el profesorado y descomprimidlo. Abrid la carpeta `eventia-desafio` en vuestro editor. La estructura principal es:

```text
eventia-desafio/
├── client/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── api.js
│       ├── main.js
│       └── style.css
├── server/
│   ├── package.json
│   └── src/
│       ├── data.js
│       └── server.js
├── package.json
└── README.md
```

### 2. Instalar dependencias

Abre un terminal en la carpeta raíz del proyecto y ejecuta:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

También puedes ejecutar `npm run install:all` desde la raíz.

### 3. Arrancar la aplicación

```bash
npm run dev
```

Se iniciarán dos servicios:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`

No cierres el terminal mientras utilices la aplicación. Para detener los servicios, pulsa `Ctrl + C`.

### 4. Comprobar el funcionamiento

Abre `http://localhost:5173`.

| Perfil        | Correo              | Contraseña |
| ------------- | ------------------- | ---------- |
| Usuario       | ana@eventia.local   | usuario123 |
| Usuario       | luis@eventia.local  | usuario456 |
| Administrador | admin@eventia.local | admin123   |

Comprueba que puedes iniciar sesión, consultar eventos y realizar una reserva. La API también puede probarse directamente en `http://localhost:3000/api/health` y `http://localhost:3000/api/events`; ambas rutas devuelven JSON.

**Importante:** los datos se guardan en memoria. Al reiniciar el servidor, se pierden las reservas y los eventos creados y se recupera el estado inicial.

---

## Parte 2. Auditoría de seguridad

Organizad el trabajo como un equipo de auditoría. Antes de ejecutar herramientas, elaborad una estrategia: qué componentes vais a revisar, qué riesgos consideráis relevantes y qué evidencias necesitáis.

### Reto 1. Comprender el sistema

Documentad la arquitectura de Eventia. Identificad sus componentes, los datos que maneja, los activos que deberían protegerse, los perfiles y operaciones disponibles y los límites de confianza entre navegador y API.

Elaborad un pequeño modelo de amenazas. Utilizad STRIDE como referencia y seleccionad amenazas que tengan sentido en este contexto. No es necesario forzar todas las categorías: justificad las que consideréis relevantes.

### Reto 2. Diseñar pruebas

Proponed casos de prueba que permitan comprobar el comportamiento esperado y el comportamiento ante entradas o acciones no previstas. Incluid pruebas funcionales y negativas. Considerad, entre otras posibilidades:

- Datos incompletos o de formato incorrecto.
- Identificadores inexistentes.
- Cantidades negativas, cero o superiores al aforo.
- Peticiones sin autenticación.
- Operaciones que deberían estar reservadas a determinados perfiles.
- Acceso a recursos pertenecientes a otros usuarios.

Registrad para cada prueba el objetivo, los pasos o petición utilizada, el resultado esperado y el resultado obtenido.

### Reto 3. Análisis estático

Analizad el código con Semgrep. No os limitéis a ejecutar una configuración y copiar la salida. Investigad los hallazgos, localizad el código y determinad qué patrón ha detectado la herramienta, qué debilidad podría representar, si el código afectado se utiliza, qué condiciones serían necesarias para que tuviese impacto y si se trata de una vulnerabilidad, un riesgo potencial, una alerta no aplicable o un falso positivo.

Podéis utilizar reglas propias, reglas comunitarias o las configuraciones disponibles en Semgrep.

### Reto 4. Análisis dinámico con OWASP ZAP

Configurad ZAP para observar el tráfico entre el navegador y Eventia. Explorad la aplicación y sus operaciones. Analizad las peticiones y respuestas HTTP, los métodos, códigos de estado, cabeceras y datos intercambiados.

Utilizad el proxy para investigar cómo cambia el comportamiento de la API cuando se modifican parámetros, identificadores o datos del cuerpo de una petición.

Comprobad qué alertas genera ZAP y cuáles requieren investigación adicional. No asumáis que una alerta equivale automáticamente a una vulnerabilidad confirmada.

### Reto 5. Evaluar controles de seguridad

A partir de las evidencias, evaluad los controles de autenticación, autorización y separación de permisos, validación de datos, protección de información, configuración HTTP y cabeceras de seguridad, política de seguridad de contenidos (CSP), y gestión de sesión y almacenamiento de credenciales en el cliente.

Explicad qué controles están presentes, cuáles son insuficientes y cuáles no existen.

### Reto 6. Corregir y verificar

Seleccionad los hallazgos que deban corregirse y proponed cambios en el código. Priorizad según impacto y probabilidad, no según el número de alertas.

Después de realizar las modificaciones:

1. Repetid las pruebas relacionadas con cada cambio.
2. Comprobad que el comportamiento legítimo sigue funcionando.
3. Verificad que el problema identificado ya no se reproduce.
4. Conservad evidencias antes y después de la corrección.
5. Documentad los riesgos que permanezcan abiertos.

---

## Parte 3. Informe y defensa

Entregad un informe técnico que incluya:

1. Resumen ejecutivo y recomendación de despliegue.
2. Descripción de la arquitectura y activos.
3. Modelo de amenazas.
4. Plan de pruebas y resultados.
5. Hallazgos de Semgrep y ZAP interpretados.
6. Registro priorizado de riesgos.
7. Correcciones realizadas y evidencias de verificación.
8. Riesgos pendientes y medidas recomendadas.

En la defensa, cada equipo deberá explicar al menos un hallazgo, demostrar cómo lo investigó y justificar la solución elegida.

## Condiciones de trabajo

- Todas las pruebas se realizarán exclusivamente sobre el entorno local facilitado.
- No se realizarán pruebas contra servicios externos ni sistemas de terceros.
- No se introducirán datos personales reales.
- No se considerará válida una corrección que simplemente oculte una alerta de la herramienta.
- Cada conclusión deberá apoyarse en evidencias reproducibles.

## Evaluación

| Criterio                                        |      Peso |
| ----------------------------------------------- | --------: |
| Comprensión de arquitectura, activos y amenazas |      15 % |
| Diseño y ejecución de pruebas                   |      15 % |
| Análisis estático e interpretación de hallazgos |      15 % |
| Análisis dinámico y revisión HTTP con ZAP       |      20 % |
| Priorización, corrección y verificación         |      25 % |
| Informe y defensa técnica                       |      10 % |
| **Total**                                       | **100 %** |

## Pregunta final

**¿Recomendaríais poner Eventia en producción?** La respuesta debe ser una decisión técnica argumentada, basada en evidencias, riesgos pendientes y condiciones concretas de despliegue.
