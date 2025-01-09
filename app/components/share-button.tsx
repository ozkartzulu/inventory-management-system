import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// export function loader() {
//   const pdfUrl = "public/invoice/matias_marka_factura_6_enero_2025636472.pdf"; // URL pública o generada dinámicamente
//   console.log(pdfUrl);
  
//   return json({ pdfUrl });
// }

export default function SharePdf() {
//   const { pdfUrl } = useLoaderData<{ pdfUrl: string }>();
// console.log(pdfUrl);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Factura",
          text: "Hola, aquí está el enlace a tu factura",
          url: 'invoice/matias_marka_factura_6_enero_2025636472.pdf',
        });
        alert("Enlace compartido exitosamente");
      } catch (error) {
        console.error("Error al compartir", error);
      }
    } else {
      alert("Tu navegador no soporta compartir contenido.");
    }
  };

  return (
    <div>
      <p>Puedes compartir el enlace a tu factura usando el botón de abajo:</p>
      <button
        onClick={handleShare}
      >
        Compartir Factura
      </button>
    </div>
  );
}