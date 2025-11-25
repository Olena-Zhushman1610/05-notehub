import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteList.module.css";
import type { NotesResponse } from "../../services/noteService";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  data: NotesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function NoteList({ data, isLoading, isError }: NoteListProps) {
  const queryClient = useQueryClient();

  //  Мутація для видалення
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
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
    </>
  );
}
