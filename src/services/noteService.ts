import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/docs";

const API_TOKEN = import.meta.env.VITE_NOTE_HUB_TOKEN;

interface FetchNotesParams {
  query: string;
  page?: number;
}

export interface NotesResponse {
  page: number;
  results: Note[];
  total_pages: number;
  total_results: number;
}

export async function fetchNotes({
  query,
  page = 1,
}: FetchNotesParams): Promise<NotesResponse> {
  if (!query.trim()) {
    throw new Error("Порожній запит");
  }

  try {
    const response = await axios.get<NotesResponse>(BASE_URL, {
      params: {
        query,
        page,
        include_adult: false,
        language: "en-US",
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Помилка запиту:", error);
    throw new Error("Не вдалося завантажити нотатки");
  }
}
