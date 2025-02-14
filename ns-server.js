import { createRequestHandler } from "@netlify/remix-adapter";
import * as build from "./build/index.js";

export default async function handler(event, context) {
  try {
    return await createRequestHandler({ build })(event, context);
  } catch (error) {
    console.error("🔥 ERROR EN REMIX SERVER:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
}