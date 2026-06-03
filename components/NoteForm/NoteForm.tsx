import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../../lib/api";
import css from "./NoteForm.module.css";

export interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Max 500 characters"),

  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag"
    )
    .required("Tag is required"),
});

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    // api.createNote may not be typed on the imported module; use a safe any-cast wrapper
    mutationFn: (newNote: FormValues) => (api as any).createNote(newNote),
    onSuccess: () => {
      // інвалідація кешу
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      // закриття модалки після успіху
      onClose();
    },
  });

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        createMutation.mutate(values, {
          onSuccess: () => resetForm(),
        });
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" className={css.input} />
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
          <ErrorMessage name="content" component="span" className={css.error} />
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
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default NoteForm;
