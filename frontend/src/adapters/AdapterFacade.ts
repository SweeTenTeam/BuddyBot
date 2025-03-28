import historyData from "@/json/history.json";
import historyData1 from "@/json/history1.json";
//import { generateId } from "@/utils/generateId";

export class AdapterFacade {
    async fetchHistory(id: string, offset: number): Promise<any[]> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        //if (id === "") return historyData1;
        //else if (id == "240") return historyData;
        //return [];

        try {
            const response = await fetch(`http://api-gateway/api/get-storico/${id}?num=${offset}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Eventuali header necessari
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error("Error fetching history");
            return await response.json();
        } catch (error) {
            throw new Error("Error fetching history");
        }
    }

    async fetchQuestion(data: any): Promise<any> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        //return { answer: { content: data.question, timestamp: data.timestamp }, id: generateId() };

        try {
            const response = await fetch(`http://api-gateway/api/get-risposta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Eventuali header necessari
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error("Error sending message");
            return await response.json();
        } catch (error) {
            throw new Error("Error sending message");
        }
    }
}