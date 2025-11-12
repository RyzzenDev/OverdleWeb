import Image from 'next/image';
import Link from 'next/link'; 
import styles from './GameModeCard.module.css'; 


export default function GameModeCard({ title, subtitle, iconSrc, href }) {
  return (
  
    <Link href={href} className={styles.card}>

     
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

    </Link>
  );
}