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
      const user = userCredential.user;
      console.log('Logged in as:', user.email);

      // ログイン成功後にプロフィールページへ遷移
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login Error:', error.message);
        setError(error.message);
      } else {
        setError('予期しないエラーが発生しました');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="メールを入力してください"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}
