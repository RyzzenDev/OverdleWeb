import Image from 'next/image'; 
import styles from './page.module.css'; 
import GameModeCard from '../components/GameModeCard'; 

export default function Home() {
  return (
    
    <main className={styles.main}> 
      <Image
        className={styles.logo} 
        src="/Images/Logo.svg" 
        alt="Overdle "
        width={500} 
        height={150} 
        priority 
      />
      <GameModeCard
      href="/overdleHero"
      title="HERO"
      subtitle="GUESS THE HERO"
      iconSrc="/images/Heroicon.svg"
      />
      <div className={styles.dividerLine}></div>
      <GameModeCard
      href="/ability"
      title="ABILITY"
      subtitle="GUESS THE ABILITY"
      iconSrc="/images/Abilityicon.svg"
      />
      <div className={styles.footerContainer}>
  
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
  <a
    href="https://github.com/RyzzenDev"
    target="_blank" 
    rel="noopener noreferrer"
    aria-label="GitHub Profile" 
  >
  <Image
    src="/images/github-mark-white.png" 
    alt="GitHub Icon"
    width={20}
    height={20}
    className={styles.footerIcon}
    />
  </a>
</div>
    </main>
  );
}