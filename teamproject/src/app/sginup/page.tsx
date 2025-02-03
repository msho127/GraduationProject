'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in as:', userCredential.user.email);

      router.push('/');
    } catch (error) {
      console.error('Login Error:', error);

      // error を FirebaseError 型にキャスト
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case "auth/invalid-email":
            setError("無効なメールアドレスです。");
            break;
          case "auth/user-disabled":
            setError("このアカウントは無効化されています。");
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("メールアドレスまたはパスワードが正しくありません。");
            break;
          default:
            setError("ログインに失敗しました。再試行してください。");
        }
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="メールを入力してください"
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          ログイン
        </button>
      </form>
    </div>
  );
}
