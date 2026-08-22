"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

import { useAuthStore } from "@/lib/store/authStore";
import { updateMe, updateAvatar } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? "");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await updateMe({ username });

      let updatedUser = {
        ...user,
        username: updated.username,
      };

      if (avatar) {
        const avatarResponse = await updateAvatar(avatar);

        updatedUser = {
          ...updatedUser,
          avatar: avatarResponse.avatar,
        };
      }

      setUser(updatedUser);

      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={avatarPreview}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />

          <label htmlFor="avatar" className={css.avatarButton}>
            Change avatar
          </label>

          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>

            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}