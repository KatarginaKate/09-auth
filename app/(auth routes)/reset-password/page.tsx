"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        { token, password }
      );

      setStatus("Пароль успішно змінено.");
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Не вдалося змінити пароль.";
      setStatus(message);
    }
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Новий пароль</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
        <label>Новий пароль</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />

        <button type="submit" style={{ marginTop: "12px" }}>
          Змінити пароль
        </button>

        {status && <p style={{ marginTop: "12px" }}>{status}</p>}
      </form>
    </main>
  );
}
