// BottomSheet.tsx
import React, { useEffect, useState } from "react";
import styles from "./BottomSheet.module.scss";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from "../../../lib/firebase";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose }) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("qrData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setStoreId(parsedData.rawValue || null);
      } catch (error) {
        console.error("セッションストレージのデータをパース中にエラーが発生しました:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content || !storeId) {
      console.warn("すべての項目を入力してください");
      return;
    }
    try {
      const postsCollection = collection(db, `stores/${storeId}/posts`);
      await addDoc(postsCollection, {
        author,
        content,
        createdAt: serverTimestamp(),
      });
      setAuthor("");
      setContent("");
    } catch (err) {
      console.error("投稿の追加に失敗しました:", err);
    }
  };

  return (
    <div className={`${styles.bottomSheet} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.closeButton}>×</button>
      </div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="タイトル"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="説明文"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>
            投稿
          </button>
        </form>
      </div>
    </div>
  );
};

export default BottomSheet;
