import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
// axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export interface FetchNotesParams {
  search?: string;
  tag?: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}

export interface NotesResponse {
  notes: Note[];

  totalPages: number;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

//

// функції
// 1) Отримання нотаток
export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
  sortBy,
}: FetchNotesParams): Promise<NotesResponse> {
  try {
    const response = await axios.get<NotesResponse>(BASE_URL, {
      params: { page, perPage, search, tag, sortBy },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Помилка запиту:", error);
    throw new Error("Не вдалося завантажити нотатки");
  }
}
// 2) createNote
// ----------------------

export async function createNote(dto: CreateNoteDto): Promise<Note> {
  try {
    const response: AxiosResponse<Note> = await api.post("", dto);
    return response.data;
  } catch (error) {
    console.error("❌ Помилка createNote:", error);
    throw new Error("Не вдалося створити нотатку");
  }
}

// ----------------------
// 3) deleteNote
// ----------------------

export async function deleteNote(id: string): Promise<Note> {
  try {
    const response: AxiosResponse<Note> = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Помилка deleteNote:", error);
    throw new Error("Не вдалося видалити нотатку");
  }
}
