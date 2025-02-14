/** @type {import('@remix-run/dev').AppConfig} */
export default {
    future: {},
    ignoredRouteFiles: ["**/.*"],
    tailwind: true,
    serverModuleFormat: "esm",
    // publicPath: "/build/client/",
    server: "./server.js", // Netlify necesita este archivo
  };