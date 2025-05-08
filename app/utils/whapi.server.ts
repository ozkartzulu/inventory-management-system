import { prisma } from "./prisma.server";


export const sendWhatsAppMessage = async (to: any, message: string) => {
    try {
        const url = "https://gate.whapi.cloud/messages/text";
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
            },
            body: JSON.stringify({
                to, 
                body: message,
            }),
        };

        return await fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
    } catch (error:any) {
      console.error(`Error al enviar mensaje a ${to}:`, error.response.data);
    }
};

let initialized = false;

export async function runCron() {
    if (initialized) return;
    initialized = true;

    const now = new Date();
    const targetHour = 11;
    const targetMinutes = 34;

    const firstRun = new Date();
    firstRun.setHours(targetHour, targetMinutes, 0, 0);

    if (now > firstRun) {
        firstRun.setDate(firstRun.getDate() + 1);
    }

    const timeout = firstRun.getTime() - now.getTime();

  setTimeout(() => {
    enviarMsgClientes();

    setInterval(() => {
        enviarMsgClientes();
        // 1000 * 60 * 60 * 24 -> 24 horas
    }, 1000 * 60 * 2); // 24 horas

  }, timeout);
    
    // preguntar si nro de días son mayores o iguales de 30
    // si es false no envio, si es true envio msm whatsapp recordatorio
    // despues de enviar al cliente, pongo su estado en false, para que ya no vuelva a enviar sms
    // el día que venga el cliente a hacer cambio de aceite, se va modificar la fecha del servicio y el estado a true
}

async function enviarMsgClientes() {
    
    // request de todos los clientes activos
    const customers = await prisma.customer.findMany({
        where: { state: true },
    });

    if(customers) {
        customers.forEach( customer => {
            const proximoCambio = sumarDias(customer.dateService, 30);
            const ahora = new Date();
            if (esHoy(proximoCambio, ahora)) {
                const msg = `Hola mi estimado(a) ${customer.name}, le recuerdo que hoy le toca hacer cambio de aceite, Saludos Lubricantes Rojas`;
                const to = `591${customer.phone}`;

                sendWhatsAppMessage(to, msg);
                console.log('se envio recordatorio al cliente '+customer.name+' con telf '+to)
                // despues de enviar al cliente, pongo su estado en false, para que ya no vuelva a enviar sms
                changeStateCustomer(customer.id);

            }
        })
    }
}

async function changeStateCustomer(customerId: number) {
    const customer = await prisma.customer.update({
		where: {
            id: customerId,
        },
        data: {
			state: false,
		},
	});
}

function sumarDias(fecha: Date, dias: number): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
}

function esHoy(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
}