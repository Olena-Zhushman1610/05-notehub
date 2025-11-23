import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { CreateNoteDto } from "../../services/noteService";

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  onSuccess: () => void;
  onCreate: (dto: CreateNoteDto) => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  content: Yup.string().trim().required("Content is required"),
  tag: Yup.string().oneOf(
    ["Todo", "Work", "Personal", "Meeting", "Shopping"],
    "Invalid tag"
  ),
});

export default function NoteForm({ onSuccess, onCreate }: NoteFormProps) {
  const handleSubmit = async (
    values: NoteFormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      //  Тут  запит створення нотатки через useMutation
      // await createNote(values);

      resetForm();
      onCreate(values); // ← прямо сюди летить mutate
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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

            <ErrorMessage name="tag" component="span" className={css.error} />
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
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
