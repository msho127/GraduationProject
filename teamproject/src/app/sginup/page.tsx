"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app"; // Firebase エラー型をインポート
import { auth } from "../../lib/firebase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("新規登録成功:", userCredential.user);
      setSuccess("アカウント登録が完了しました！");
    } catch (error: unknown) { // unknown に変更
      console.error("登録エラー:", error);

      if (error instanceof FirebaseError) { // Firebase のエラー型にキャスト
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("このメールアドレスはすでに登録されています。");
            break;
          case "auth/weak-password":
            setError("パスワードは6文字以上で入力してください。");
            break;
          case "auth/invalid-email":
            setError("無効なメールアドレス形式です。");
            break;
          default:
            setError(`登録エラー: ${error.message}`);
        }
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">アカウント登録</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="パスワード確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          登録
        </button>
      </form>
    </div>
  );
}
