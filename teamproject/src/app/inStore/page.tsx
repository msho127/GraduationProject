"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, doc, getDoc, query, orderBy, onSnapshot, Timestamp,} from "firebase/firestore";
import db from "../../lib/firebase";
import styles from "../inStore/inStore.module.scss";
import Header from "../components/header/header";
import BottomSheet from "../components/BottomSheet/BottomSheet";

import Board from "../../assets/board.svg";

interface Post {
  id: string;
  author: string;
  content: string;
  createdAt: Date | null;
}

export default function InStore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [storeName, setStoreName] = useState<string>("店名取得中...");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("qrData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const storeID = parsedData.rawValue;
        console.log("取得した storeID:", storeID);

        if (storeID) {
          const fetchStoreData = async () => {
            try {
              const storeDocRef = doc(db, "stores", storeID);
              const storeDocSnap = await getDoc(storeDocRef);

              if (storeDocSnap.exists()) {
                const storeData = storeDocSnap.data();
                console.log("取得した store データ:", storeData);
                setStoreName(storeData.store || "店名不明");

                // `posts` サブコレクションを取得
                const postsQuery = query(
                  collection(storeDocRef, "posts"),
                  orderBy("createdAt", "desc")
                );

                onSnapshot(postsQuery, (snapshot) => {
                  const posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                      id: doc.id,
                      author: data.author || "匿名",
                      content: data.content || "",
                      createdAt: data.createdAt
                        ? (data.createdAt as Timestamp).toDate()
                        : null,
                    };
                  });
                  setPosts(posts);
                });
              } else {
                console.warn("指定された storeID のデータが見つかりません:", storeID);
                setStoreName("該当データなし");
              }
            } catch (error) {
              console.error("店情報の取得中にエラーが発生しました:", error);
              setStoreName("エラーが発生しました");
            }
          };

          fetchStoreData();
        } else {
          console.error("storeID が取得できませんでした");
          setStoreName("storeID が見つかりません");
        }
      } catch (error) {
        console.error("セッションストレージのデータをパース中にエラーが発生しました:", error);
        setStoreName("データ形式エラー");
      }
    } else {
      console.log("セッションストレージにデータが見つかりません");
      setStoreName("データが見つかりません");
    }
  }, []);

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  return (
    <div className={styles.inStore}>
      <Header title={`${storeName} 入店中`} />
      <div className={styles.BoardWrap}>
        <section className={styles.board}>
          <div className={styles.boardTitle}>
            <Image src={Board} alt="Board" className={styles.BoardImg} />
            <h2>掲示板</h2>
            <button onClick={openBottomSheet} className={styles.BSbutton}></button>
          </div>
          <section>
            {posts.map((post) => (
              <div key={post.id} className={styles.post}>
                <Link
                  className={styles.flexBox}
                  href="/bbs"
                  onClick={() => {
                    const timeString = post.createdAt
                      ? post.createdAt.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : "時間情報なし";

                    sessionStorage.setItem(
                      "selectedPost",
                      JSON.stringify({
                        author: post.author,
                        content: post.content,
                        time: timeString,
                      })
                    );
                  }}
                >
                  <div className={styles.icon}></div>
                  <div>
                    <p className={styles.author}>{post.author}</p>
                    <p className={styles.content}>{post.content}</p>
                  </div>
                  <small className={styles.timestamp}>
                    {post.createdAt
                      ? post.createdAt.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : "日付情報なし"}
                  </small>
                </Link>
              </div>
            ))}
          </section>
        </section>
        <section>
          <h2 className={styles.pastQuestionText}>メンバー</h2>
          <div></div>
        </section>
        <section>
          <h2 className={styles.pastQuestionText}>過去問</h2>
          <div className={styles.pastQuestion}></div>
        </section>
        <Link  rel="stylesheet" href={"/"} className={styles.leaving} onClick={() => sessionStorage.removeItem("qrData")} >
          退出
        </Link>
        <Link rel="stylesheet" href={"/"} className={styles.back}>
          戻る
        </Link>
        <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet} />
      </div>
    </div>
  );
}
