import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { CreateNoteDto, UpdateNoteDto } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  onSuccess: () => void;
  initialValues?: Partial<Note>;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string().trim().max(500, "Max length is 500 characters"),
  tag: Yup.string().oneOf(
    ["Todo", "Work", "Personal", "Meeting", "Shopping"],
    "Invalid tag"
  ),
});

export default function NoteForm({ onSuccess, initialValues }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (dto: CreateNoteDto) => createNote(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; dto: UpdateNoteDto }) =>
      updateNote(params.id, params.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  // 🔥 FORM INITIAL VALUES — правильне місце
  const formInitialValues: NoteFormValues = {
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
    tag: initialValues?.tag ?? "Todo",
  };

  const isEditing = Boolean(initialValues?.id);

  const handleSubmit = (values: NoteFormValues) => {
    if (isEditing) {
      updateMutation.mutate({
        id: initialValues!.id!,
        dto: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, handleReset }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => {
                handleReset();
                onSuccess();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isEditing ? "Update note" : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
