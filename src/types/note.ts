export interface Note {
  id: string;
  content: string;
  createdAt: string; // або Date, якщо на сервері приходить ISO-рядок
  updatedAt?: string; // опціонально, якщо підтримуєте оновлення
}
