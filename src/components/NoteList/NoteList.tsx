import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import css from "./NoteList.module.css";
import type { NotesResponse, UpdateNoteDto } from "../../services/noteService";
import { deleteNote, updateNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import EditNoteModal from "../EditNoteModal/EditNoteModal";
interface NoteListProps {
  data: NotesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function NoteList({ data, isLoading, isError }: NoteListProps) {
  const queryClient = useQueryClient();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  //  Мутація для видалення
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  //  Мутація для оновлення
  const updateMutation = useMutation({
    mutationFn: (params: { id: string; dto: UpdateNoteDto }) =>
      updateNote(params.id, params.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Помилка завантаження нотаток</p>;

  // Якщо немає нотаток — не рендеримо компонент
  if (!data || !data.notes || data.notes.length === 0) return null;

  return (
    <>
      <ul className={css.list}>
        {data.notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title ?? "Untitled"}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag ?? "General"}</span>
              {/* UPDATE — приклад */}
              <button
                className={css.button}
                onClick={() => setEditingNote(note)}
              >
                Update
              </button>
              <button
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Модалка редагування */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSubmit={(params: { id: string; dto: UpdateNoteDto }) => {
            updateMutation.mutate(params); // передаємо саме {id, dto}
            setEditingNote(null);
          }}
        />
      )}
    </>
  );
}
