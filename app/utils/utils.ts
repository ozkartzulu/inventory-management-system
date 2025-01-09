
export function removeSpace(name: string) {
    return name.toLocaleLowerCase().split(' ').join('_');
}

export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    const day = date.getUTCDate();
    const monthName = date.toLocaleString("es-ES", { month: "long" }); // Mes en texto en español
    const year = date.getUTCFullYear();
    const time = date.toLocaleTimeString("es-ES", { hour12: false }); // Hora en formato 24 horas
  
    return `${day} de ${monthName} del ${year} horas: ${time}`;
}

export const formatDateUnSpace = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    const day = date.getUTCDate();
    const monthName = date.toLocaleString("es-ES", { month: "long" }); // Mes en texto en español
    const year = date.getUTCFullYear();
    const time = date.toLocaleTimeString("es-ES", { hour12: false }); // Hora en formato 24 horas
  
    return `${day}_${monthName}_${year}`;
}

export const capitalizeWords = (name: string): string => {
    return name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");    // Une las palabras nuevamente
}

export function generateRandomDigits(): number {
    return Math.floor(100000 + Math.random() * 900000);
}