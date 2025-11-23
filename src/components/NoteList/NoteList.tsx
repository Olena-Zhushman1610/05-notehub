//import { useQuery } from "@tanstack/react-query";
//import { fetchNotes } from "../../services/noteService";
import css from "./NoteList.module.css";
import type { NotesResponse, UpdateNoteDto } from "../../services/noteService";

interface NoteListProps {
  data: NotesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: string) => void;
  onUpdate: (params: { id: string; dto: UpdateNoteDto }) => void;
}

export default function NoteList({
  data,
  isLoading,
  onDelete,
  onUpdate,
  isError,
}: NoteListProps) {
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Помилка завантаження нотаток</p>;

  // Якщо немає нотаток — не рендеримо компонент
  if (!data || !data.notes || data.notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title ?? "Untitled"}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag ?? "General"}</span>
            <button className={css.button} onClick={() => onDelete(note.id)}>
              Delete
            </button>
            {/* UPDATE — простий приклад */}
            <button
              className={css.button}
              onClick={() =>
                onUpdate({
                  id: note.id,
                  dto: {
                    title: note.title,
                    content: note.content + " (updated)",
                    tag: note.tag,
                  },
                })
              }
            >
              Update
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
