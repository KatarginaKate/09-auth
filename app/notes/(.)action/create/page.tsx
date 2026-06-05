"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function CreateNoteModal() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NoteForm />
    </Modal>
  );
}
