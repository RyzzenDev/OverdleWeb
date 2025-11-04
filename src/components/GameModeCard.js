import Image from 'next/image';
import Link from 'next/link'; // Importa o componente de Link do Next.js
import styles from './GameModeCard.module.css'; // Importa nossos estilos

// Nosso componente recebe "props" (propriedades)
export default function GameModeCard({ title, subtitle, iconSrc, href }) {
  return (
    // O componente todo é um link
    <Link href={href} className={styles.card}>

      {/* 1. O ÍCONE */}
      <Image
        src={iconSrc}
        alt={`${title} icon`}
        width={80} // Defina a largura real da sua imagem de ícone
        height={80} // Defina a altura real da sua imagem de ícone
        className={styles.icon}
      />

      {/* 2. O BLOCO DE TEXTO E LINHAS */}
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.orangeLine}></div>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.whiteLine}></div>
      </div>

    </Link>
  );
}