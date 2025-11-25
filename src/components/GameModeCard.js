import Image from 'next/image';
import Link from 'next/link';
import styles from './GameModeCard.module.css';

export default function GameModeCard({ title, subtitle, iconSrc, href, disabled }) {

  const Component = disabled ? 'div' : Link;

  return (
    <Component
      href={!disabled ? href : undefined}
      className={`${styles.card} ${disabled ? styles.disabled : ''}`}
    >
      <Image
        src={iconSrc}
        alt={`${title} icon`}
        width={80}
        height={80}
        className={styles.icon}
      />

      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.orangeLine}></div>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.whiteLine}></div>
      </div>
      {disabled && (
        <div className={styles.developmentOverlay}>
          Still in development
        </div>
      )}

    </Component>
  );
}