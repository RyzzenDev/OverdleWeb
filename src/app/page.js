"use client";

import Image from 'next/image';
import styles from './page.module.css';
import GameModeCard from '../components/GameModeCard';
import DisclaimerModal from '../components/DisclaimerModal';
import { useState } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className={styles.main}>
      <Image
        className={styles.logo}
        src="/Images/icon.svg"
        alt="Overdle "
        width={500}
        height={150}
        priority
      />
      <GameModeCard
        href="/overdleHero"
        title="HERO"
        subtitle="GUESS THE HERO"
        iconSrc="/Images/Heroicon.svg"
      />
      <div className={styles.dividerLine}></div>
      <GameModeCard
        href="/ability"
        title="ABILITY"
        subtitle="GUESS THE ABILITY"
        iconSrc="/Images/Abilityicon.svg"
        disabled
      />
      <div className={styles.footerContainer}>
        <div className={styles.footerTextGroup}>
          <span>
            MADE WITH LOVE 💗 BY{' '}
            <a
              href="https://github.com/RyzzenDev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              RYZZENDEV
            </a>
          </span>

        </div>
        <a
          href="https://github.com/RyzzenDev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
        >
          <Image
            src="/Images/github-mark-white.png"
            alt="GitHub Icon"
            width={20}
            height={20}
            className={styles.footerIcon}
          />
        </a>
        <span className={styles.disclaimerSeparator}>|</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.disclaimerButton}
        >
          DISCLAIMER
        </button>
      </div>
      <DisclaimerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}