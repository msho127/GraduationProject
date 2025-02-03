"use client";
import React, { useEffect, useState } from "react";
import styles from "./bbs.module.scss";
import Link from "next/link";

export default function BBSPage() {
  const [selectedPost, setSelectedPost] = useState<{ author: string; content: string; time?: string } | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("selectedPost");
    if (storedData) {
      setSelectedPost(JSON.parse(storedData));
    }
  }, []);

  if (!selectedPost) {
    return <p>データがありません。</p>;
  }

  return (
    <div className={styles.bbs}>
      <Link href={"/InStore"} className={styles.backButton}>戻る</Link>
      <section className={styles.boardTitle}>
        <div className={styles.flexBox}>
          <h2>{selectedPost.author}</h2>
          <p>{selectedPost.time || "時間情報なし"}</p>
        </div>
        <p>{selectedPost.content}</p>
      </section>
      <footer className={styles.footerBox}>
        <input type="text" className={styles.textBox} />
        <button>送る</button>
      </footer>
    </div>
  );
}
