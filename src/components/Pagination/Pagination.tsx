import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;

  onChange: (selectedPage: number) => void;
  page: number;
}

export default function Pagination({
  pageCount,
  page,
  onChange,
}: PaginationProps) {
  if (pageCount <= 1) return null; // умовний рендер

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={({ selected }) => onChange(selected + 1)}
      pageCount={pageCount}
      forcePage={page - 1}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeLinkClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
    />
  );
}
