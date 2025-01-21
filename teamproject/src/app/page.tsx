"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from './styles/top.module.scss';
import './globals.css';

import Popup from './components/popup/popup';
import Footer from './components/footer/footer';
import Header from './components/header/header';

import ShopIcon from '../assets/shop.svg'
import BookIcon from '../assets/book.svg'
import PenIcon from '../assets/Pen.svg';
import SearchIcon from '../assets/search.svg'
import puypuy from '../assets/puypuy.png';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <main>
      <Header title='すとぴあ' />
      {showPopup && (
        <Popup closePopup={togglePopup} />
      )}
      <section className={styles.puypuy}>
        <Image src={puypuy} alt="puypuy"/>
      </section>
      <section className={`${styles.commonBox} ${styles.in_store}`}  onClick={togglePopup}>
        <Image src={ShopIcon} alt="ShopIcon" className={styles.imageBox} />
        <h2 className={styles.title}>入店</h2>
      </section>
      <section className={`${styles.commonBox} ${styles.history}`}>
        <Image src={BookIcon} alt="BookIcon" className={styles.imageBox} />
        <h2 className={styles.title}>学習履歴</h2>
      </section>

      <div className={styles.flexBox}>
        <section className={styles.shop}>
          <Link href={"/InStore"}>
            <Image src={PenIcon} alt="PenIcon" className={styles.imageBox} />
            <h3 className={styles.title}>文房具購入</h3>
          </Link>
        </section>
        <section className={styles.search}>
          <Link href={"/InStore"}>
            <Image src={SearchIcon} alt="SearchIcon" className={styles.imageBox} />
            <h3 className={styles.title}>店舗検索</h3>
          </Link>
        </section>
      </div>
      <Footer />
    </main>
  );
}
