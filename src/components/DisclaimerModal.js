
import styles from './DisclaimerModal.module.css';

export default function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h3>About This Project</h3>
        <p>
          This is a fan-made game created as a tribute to the Overwatch™ universe.
        </p>
        <p>
          Non-Profit: This project is entirely free and does not generate any revenue.
        </p>
          <p>
          Intellectual Property: Overwatch™ and all related intellectual properties, including (but not limited to) characters, names, art, and sounds, are registered trademarks and property of Blizzard Entertainment, Inc.©
          </p>
          <p>
          Unofficial: This project is not an official Blizzard product and is not affiliated with or endorsed by the company.
          </p>
      </div>
    </div>
  );
}