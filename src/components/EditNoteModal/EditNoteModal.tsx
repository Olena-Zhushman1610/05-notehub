import { useEffect } from "react";
import css from "./EditNoteModal.module.css";
import type { UpdateNoteDto } from "../../services/noteService";
import type { Note } from "../../types/note";
interface EditNoteModalProps {
  note: Note;
  onClose: () => void;
  onSubmit: (params: { id: string; dto: UpdateNoteDto }) => void;
}

export default function EditNoteModal({
  note,
  onClose,
  onSubmit,
}: EditNoteModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    onSubmit({
      id: note.id,
      dto: {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        tag: formData.get("tag") as string,
      },
    });

    onClose();
  };

  // Закриття по ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Edit note</h2>

        <form onSubmit={handleSubmit}>
          <input name="title" defaultValue={note.title} placeholder="Title" />

          <textarea name="content" defaultValue={note.content} />

          <input name="tag" defaultValue={note.tag} placeholder="Tag" />

          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
