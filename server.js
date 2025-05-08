import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequestHandler } from '@remix-run/express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, './build/client/')));

// Maneja todas las rutas con el manejador de Remix
app.all(
  '*',
  createRequestHandler({
    build: await import('./build/server/index.js'), // Asegúrate de apuntar al archivo de construcción
    mode: process.env.NODE_ENV || 'development', // Configura el modo según el entorno
    getLoadContext() {
      // Pasar cualquier contexto al loader o acción
      return {};
    },
  })
);


const port = process.env.PORT || 3000;
const HOST = "0.0.0.0" || "localhost";
app.listen(port, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${port}`);
});