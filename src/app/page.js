import Image from 'next/image'; // Importa o componente de Imagem
import styles from './page.module.css'; // Importa nossos novos estilos
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
      href="/hero"
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
      href="https://github.com/RyzzenDev" // <-- COLOQUE SEU LINK AQUI
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.footerLink}
    >
      RYZZENDEV
    </a>
  </span>
  <a
    href="https://github.com/RyzzenDev" // <-- COLOQUE O MESMO LINK AQUI
    target="_blank" 
    rel="noopener noreferrer"
    aria-label="GitHub Profile" // Bom para acessibilidade
  >
  <Image
    src="/images/github-mark-white.png" // <-- Mude se o nome do seu arquivo for outro
    alt="GitHub Icon"
    width={20} // Tamanho do ícone (ajuste se precisar)
    height={20}
    className={styles.footerIcon}
    />
  </a>
</div>
    </main>
  );
}