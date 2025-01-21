'use client';

import styles from './popup.module.scss';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouter をインポート
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface PopupProps {
  closePopup: () => void;
}

const Popup: React.FC<PopupProps> = ({ closePopup }) => {
  const [scanResult, setScanResult] = useState({ format: '', rawValue: '' });
  const [isCameraReady, setIsCameraReady] = useState(false); // カメラ起動状態
  const router = useRouter(); // useRouter フックを使用

  // セッションストレージにデータが存在する場合、直接ページ遷移
  useEffect(() => {
    const storedData = sessionStorage.getItem('qrData');
    if (storedData) {
      router.push('/InStore'); // セッションデータがある場合に直接遷移
    }
  }, [router]);

  // 1秒後にカメラを起動する処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCameraReady(true);
    }, 1000);

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      setScanResult({
        format: results[0].format,
        rawValue: results[0].rawValue,
      });
    }
  };

  // カスタムトラッカー
  const customTracker = (
    detectedCodes: IDetectedBarcode[],
    ctx: CanvasRenderingContext2D
  ) => {
    detectedCodes.forEach((code) => {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        code.boundingBox.x,
        code.boundingBox.y,
        code.boundingBox.width,
        code.boundingBox.height
      );

      ctx.fillStyle = 'white';
      ctx.fillRect(
        code.boundingBox.x,
        code.boundingBox.y + code.boundingBox.height,
        code.boundingBox.width,
        20
      );
      ctx.fillStyle = 'black';
      ctx.fillText(
        code.rawValue,
        code.boundingBox.x,
        code.boundingBox.y + code.boundingBox.height + 15
      );
    });
  };

  // スキャン結果が更新されたらセッションストレージに保存し、ページ遷移
  useEffect(() => {
    if (scanResult.rawValue) {
      sessionStorage.setItem('qrData', JSON.stringify(scanResult));
      router.push('/inStore'); // 読み取り完了後に inStore ページへ移動
    }
  }, [scanResult, router]);

  return (
    <div className={styles.popup}>
      <button onClick={closePopup}>Close</button>
      <div className={styles.box}>
        <div className={styles.scanner}>
          {isCameraReady ? (
            <Scanner
              onScan={handleScan}
              formats={['qr_code', 'micro_qr_code']}
              allowMultiple={true}
              components={{
                tracker: customTracker,
                audio: true,
                onOff: true,
                zoom: true,
                finder: false,
                torch: true,
              }}
            />
          ) : (
            <p>カメラを準備中...</p> // カメラが起動するまでの表示
          )}
        </div>
        {scanResult.rawValue && (
          <div>
            <p>
              <strong>内容:</strong> {scanResult.rawValue}
            </p>
          </div>
        )}
        <div className={styles.moneyBox}>
          <p className={styles.money}>利用可能金額</p>
          <p className={styles.remainingMoney}>1000円</p>
        </div>
        <div className={styles.planBox}>
          <p className={styles.plan}>ご利用プラン</p>
          <p className={styles.planDetail}>わくわくすたでぃプラン</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
