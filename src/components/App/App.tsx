import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { useState, useEffect, useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

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

  // Обробка нового пошукового запиту
  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

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
      <NoteList data={data} isLoading={isLoading} isError={isError} />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
export default App;
