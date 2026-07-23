"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/request-reset-email`,
        { email }
      );

      setStatus("Інструкції для відновлення пароля надіслано на вашу пошту.");
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Не вдалося надіслати лист.";
      setStatus(message);
    }
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Відновлення пароля</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" style={{ marginTop: "12px" }}>
          Надіслати лист
        </button>

        {status && <p style={{ marginTop: "12px" }}>{status}</p>}
      </form>
    </main>
  );
}
