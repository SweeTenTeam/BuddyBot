//import historyData from "@/json/history.json";
//import historyData1 from "@/json/history1.json";
//import { generateId } from "@/utils/generateId";
import { CustomError } from "@/types/CustomError";

export class AdapterFacade {
    async fetchHistory(id: string, offset: number): Promise<any[]> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        //if (id === "") return historyData1;
        //else if (id == "240") return historyData;
        //return [];

        try {
            const response = await fetch(`http://${process.env.API_GATEWAY ?? 'localhost'}/api/get-storico?id=${id}&num=${offset}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Eventuali header necessari
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.status >= 500) throw new CustomError(500, "SERVER", "Errore interno del server");
            if (response.status >= 400) throw new CustomError(400, "CONNESSIONE", "Errore interno del server");
            if (!response.ok) throw new CustomError(500, "SERVER", "Errore interno del server");
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof DOMException && error.name === "AbortError") throw new CustomError(408, "TIMEOUT", "Timeout della richiesta");
            if (error instanceof TypeError && error.message === "Failed to fetch") throw new CustomError(400, "CONNESSIONE", "Errore di connessione");
            if (error instanceof CustomError) throw error;
            throw new CustomError(500, "SERVER", "Errore interno del server");
        }
    }

    async fetchQuestion(data: any): Promise<any> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        //return { answer: { content: data.text, timestamp: data.date }, id: generateId(), lastUpdated: data.date };

        try {
            const response = await fetch(`http://${process.env.API_GATEWAY ?? 'localhost'}/api/get-risposta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Eventuali header necessari
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.status >= 500) throw new CustomError(501, "SERVER", "Errore interno del server");
            if (response.status >= 400) throw new CustomError(401, "CONNESSIONE", "Errore interno del server");
            if (!response.ok) throw new CustomError(501, "SERVER", "Errore interno del server");
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof DOMException && error.name === "AbortError") throw new CustomError(409, "TIMEOUT", "Timeout della richiesta");
            if (error instanceof TypeError && error.message === "Failed to fetch") throw new CustomError(401, "CONNESSIONE", "Errore di connessione");
            if (error instanceof CustomError) throw error;
            throw new CustomError(501, "SERVER", "Errore interno del server");
        }
    }
}