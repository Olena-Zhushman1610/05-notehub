import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { useState, useEffect, useCallback } from "react";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  deleteNote,
  updateNote,
} from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import type { UpdateNoteDto } from "../../services/noteService";

function App() {
  const [search, setSearch] = useState<string>(""); // поточний пошуковий запит
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("notesPage");
    return saved ? Number(saved) : 1;
  });
  useEffect(() => {
    localStorage.setItem("notesPage", page.toString());
  }, [page]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  //  відкладене значення пошуку
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useQuery({
    // Пошук тепер впливає на кеш
    queryKey: ["notes", { page, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData, // передаємо у бекенд
  });
  // CREATE
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNoteDto }) =>
      updateNote(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  // Обробка нового пошукового запиту
  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    // скидаємо на першу сторінку при новому запиті
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Закриття по Escape
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, closeModal]);
  const pageCount = data?.totalPages ?? 1;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onChange={handleSearch} />}
        {/* Пагінація (тільки якщо сторінок > 1) */}
        {data && pageCount > 1 && (
          <Pagination page={page} onChange={setPage} pageCount={pageCount} />
        )}
        {
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        }
      </header>
      {/* Рендеримо лише якщо є нотатки — це всередині самого NoteList */}
      <NoteList
        data={data}
        isLoading={isLoading}
        isError={isError}
        onDelete={deleteMutation.mutate}
        onUpdate={updateMutation.mutate}
      />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} onCreate={createMutation.mutate} />
        </Modal>
      )}
    </div>
  );
}
export default App;
