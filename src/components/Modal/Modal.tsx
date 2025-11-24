import type { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const modalRoot = document.getElementById("modal-root");
  // Якщо немає контейнера — нічого не рендеримо
  if (!modalRoot) return null;

  // Закриваємо по натисканню Escape
  useEffect(() => {
    //  Забороняємо скролінг тіла сторінки
    document.body.style.overflow = "hidden";

    //  Додаємо слухач клавіші Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    //  При розмонтуванні компонента:
    return () => {
      // Відновлюємо прокручування
      document.body.style.overflow = "auto";
      // Прибираємо слухач
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  // Закриваємо по кліку на фон (backdrop)

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
