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
      // Firebase でログイン
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in as:', user.email);

      // ログイン成功後にプロフィールページへ遷移
      router.push('/');
    } catch (error: any) {
      console.error('Login Error:', error);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };


  return (
    <div >
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
