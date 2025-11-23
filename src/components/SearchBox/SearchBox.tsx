import styles from "./SearchBox.module.css";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  const [value, setValue] = useState("");

  // відкладене значення (debounce 500ms)
  const [debouncedValue] = useDebounce(value, 500);

  // викликаємо onChange тільки після дебаунсу
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
    />
  );
}
