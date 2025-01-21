import Link from "next/link";
import styles from './bbs.module.scss';

interface HeaderProps {
  title: string;
}

export default function bbs(){
  return (
    <div className={styles.bbs}>
      <Link href={"/inStore"} className={styles.backButton}>戻る</Link>
      <section className={styles.boardTitle}>
        <div className={styles.flexBox}>
          <h2>至急です！歴史の問題です。答えを教えてください。</h2>
          <p>2025年1月17日</p>
        </div>
        <p>「紀元前三世紀に中国を統一した始皇帝によって建てられた王朝をなんというか。」 お願いします！</p>
      </section>
      <section className={styles.chtaBox}>
        <div className={styles.icon}></div>
        <p className={styles.chatName}>もとむら</p>
        <p className={styles.chat}>「秦 (しん)」ですね</p>
        <div className={styles.icon2}></div>
        <p className={styles.chatName2}>もりた</p>
        <p className={styles.chat2}>ありがとうございます!</p>
      </section>
      <footer className={styles.footerBox}>
        <input type="text" className={styles.textBox} />
        <button>送る</button>
      </footer>
    </div>
  );
}
