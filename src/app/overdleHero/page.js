"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';

import styles from './page.module.css';

function GuessCell({ value, result, isPortrait = false, delay = 0 }) {

  const getColorClass = () => {
    if (result === 'Correct') return styles.correct; // Verde
    if (result) return styles.wrong;
    return '';
  };

  const getArrow = () => {
    if (result === 'Younger' || result === 'Less' || result === 'Earlier') {
      return <span className={`${styles.arrow} ${styles.down}`}>↓</span>;
    }
    if (result === 'Older' || result === 'More' || result === 'Later') {
      return <span className={`${styles.arrow} ${styles.up}`}>↑</span>;
    }
    return null;
  };

  const renderContent = () => {
    const arrow = getArrow();
    if (arrow) {
      return (
        <div className={styles.valueWithArrow}>
          <span>{value}</span>
          {arrow}
        </div>
      );
    }
    return <span className={styles.guessCellValue}>{value}</span>;
  };

  const cellClass = `${styles.guessCell} ${getColorClass()}`;

  const animationStyle = { animationDelay: `${delay * 0.15}s` };

  if (isPortrait) {
    return (
      <div className={cellClass} style={animationStyle}>
        <Image
          src={value}
          alt="Hero Portrait"
          width={50}
          height={50}
          className={styles.guessCellImage}
        />
      </div>
    );
  }

  return (
    <div className={cellClass} style={animationStyle}>
      {renderContent()}
    </div>
  );
}


export default function OverdleHeroPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [allHeroes, setAllHeroes] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winData, setWinData] = useState(null);
  const [isGameWon, setIsGameWon] = useState(false);

  const [countdown, setCountdown] = useState("Loading timer...");

  const [currentGameId, setCurrentGameId] = useState(null);


  const STORAGE_KEY = 'overdleHero_gameState';


  useEffect(() => {

    const fetchHeroes = async () => {
      try {
        const response = await fetch('https://overdle-api.onrender.com/Heroes/ListDB');
        if (!response.ok) {
          throw new Error('Failed to fetch API data. Status: ' + response.status);
        }
        const data = await response.json();
        setAllHeroes(data);
      } catch (error) {
        console.error("ERROR CONNECTING TO API:", error);
      }
    };


    const initializeGame = async () => {
      let gameIsAlreadyWon = false; // Flag local
      let fetchedGameId = null;

      try {
        const idResponse = await fetch('https://overdle-api.onrender.com/Heroes/GameCount');
        if (!idResponse.ok) {
          throw new Error('Failed to fetch current game ID');
        }
        fetchedGameId = await idResponse.json();

        setCurrentGameId(fetchedGameId);

        // --- [ 2. VERIFICAR CACHE (LocalStorage) ] ---
        if (typeof window !== 'undefined') {
          const storedState = localStorage.getItem(STORAGE_KEY);

          if (storedState) {
            const savedState = JSON.parse(storedState);

            if (savedState.gameId === fetchedGameId) {
              if (savedState.guesses) {
                setGuesses(savedState.guesses);
              }

              if (savedState.winData) {
                setWinData(savedState.winData);
                setIsGameWon(true);
                setShowWinModal(true);
                gameIsAlreadyWon = true;
              }
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        }

      } catch (error) {
        console.error("Falha ao inicializar o jogo (ID ou Cache):", error);

      }


      if (!gameIsAlreadyWon) {
        fetchHeroes();
      }
    };
    initializeGame();

  }, []);
  useEffect(() => {
    const formatDuration = (totalSeconds) => {
      if (totalSeconds <= 0) {
        return "New hero available!";
      }
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const fetchNextHeroTime = async () => {
      try {
        const response = await fetch('https://overdle-api.onrender.com/Heroes/Date');
        if (!response.ok) throw new Error('Failed to fetch timer');
        const generationTimestamp = await response.json();
        const generationTime = new Date(generationTimestamp);

        if (isNaN(generationTime.getTime())) {
          throw new Error("Formato de data inválido recebido do backend: " + generationTimestamp);
        }

        const releaseTime = new Date(generationTime.getTime() + (24 * 60 * 60 * 1000));

        const timerInterval = setInterval(() => {
          const now = new Date();
          const remainingTime = releaseTime.getTime() - now.getTime();

          if (remainingTime <= 0) {
            setCountdown("New hero available!");
            clearInterval(timerInterval);

          } else {
            setCountdown(formatDuration(Math.floor(remainingTime / 1000)));
          }
        }, 1000);

        return () => clearInterval(timerInterval);

      } catch (error) {
        console.error("Erro ao buscar o contador:", error);
        setCountdown("Error loading timer");
      }
    };


    if (!isGameWon) {
      fetchNextHeroTime();
    } else {
      setCountdown("Guessed!");
    }

  }, [isGameWon]);
  const handleSearch = (e) => {
    if (isGameWon) return;

    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = allHeroes.filter((hero) =>
        hero.heroName.toLowerCase().startsWith(term.toLowerCase())
      );
      setFilteredHeroes(filtered);
    } else {
      setFilteredHeroes([]);
    }
  };

  const checkWinCondition = (result) => {
    const isWin =
      result.name === 'Correct' &&
      result.affiliation === 'Correct' &&
      result.gender === 'Correct' &&
      result.age === 'Correct' &&
      result.role === 'Correct' &&
      result.composition === 'Correct' &&
      result.composition2 === 'Correct' &&
      result.launchYear === 'Correct' &&
      result.health === 'Correct';

    return isWin;
  };
  const handleHeroSelect = async (hero) => {
    if (isGameWon) return;

    setSearchTerm(hero.heroName);
    setFilteredHeroes([]);

    const heroId = hero.id;
    const apiUrl = `https://overdle-api.onrender.com/Heroes/Guess/${heroId}`;

    console.log("Sending guess (via dropdown) for:", apiUrl);

    try {
      const response = await fetch(apiUrl, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to send guess to API');
      }

      const resultData = await response.json();
      console.log("API Response:", resultData);

      const newGuesses = [resultData, ...guesses];
      setGuesses(newGuesses);

      let stateToSave = {};

      if (checkWinCondition(resultData)) {
        // --- [ O USUÁRIO GANHOU ] ---
        const newWinData = {
          name: resultData.guessedName,
          portrait: resultData.guessedHeroPortrait,
          attempts: newGuesses.length
        };
        setWinData(newWinData);
        setShowWinModal(true);
        setIsGameWon(true);

        stateToSave = {
          gameId: currentGameId, // <-- Salva o ID do jogo atual (ex: 69)
          guesses: newGuesses,
          winData: newWinData
        };

      } else {

        stateToSave = {
          gameId: currentGameId, // <-- Salva o ID do jogo atual (ex: 69)
          guesses: newGuesses,
          winData: null
        };
      }


      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      }

    } catch (error) {
      console.error("Error sending guess:", error);
    }
  };
  const handleCloseInstructions = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowInstructions(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <Link href="/">
        <Image
          src="/Images/Logo.svg"
          alt="Overdle Logo"
          width={500}
          height={150}
          priority
        />
        </Link>
      </div>

      <div className={styles.guessBox}>
        <h2 className={styles.guessBoxTitle}>
          CAN YOU GUESS THE HERO?
        </h2>
      </div>

      <div className={styles.countdownTimer}>
        {isGameWon ? "Guessed!" : `Next Hero In: ${countdown}`}
      </div>

      {!isGameWon && (
        <div className={styles.searchContainer}>
          <div className={styles.searchRow}>
            <div className={styles.searchBar}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
            <button
              className={styles.searchButton}
              onClick={() => setShowInstructions(true)}
            >
              {"?"}
            </button>
          </div>

          {filteredHeroes.length > 0 && (
            <div className={styles.dropdown}>
              {filteredHeroes.map((hero) => (
                <div
                  key={hero.id}
                  className={styles.dropdownItem}
                  onClick={() => handleHeroSelect(hero)}
                >
                  <Image
                    src={hero.heroPortrait}
                    alt={hero.heroName}
                    width={60}
                    height={60}
                    className={styles.dropdownImage}
                  />
                  <span className={styles.dropdownName}>
                    {hero.heroName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.guessesContainer}>
        <div className={styles.guessHeader}>
          <div className={styles.headerCell}>HERO</div>
          <div className={styles.headerCell}>AFFILIATION</div>
          <div className={styles.headerCell}>GENDER</div>
          <div className={styles.headerCell}>AGE</div>
          <div className={styles.headerCell}>ROLE</div>
          <div className={styles.headerCell}>COMPOSITION</div>
          <div className={styles.headerCell}>SECOND COMP</div>
          <div className={styles.headerCell}>LAUNCH YEAR</div>
          <div className={styles.headerCell}>HEALTH</div>
        </div>

        {guesses.map((guess, index) => (
          <div key={index} className={styles.guessRow}>
            {/* Note a prop 'delay' incrementando sequencialmente */}
            <GuessCell
              value={guess.guessedHeroPortrait}
              isPortrait={true}
              result={guess.name}
              delay={0}
            />
            <GuessCell
              value={guess.guessedAffiliation}
              result={guess.affiliation}
              delay={1}
            />
            <GuessCell
              value={guess.guessedGender}
              result={guess.gender}
              delay={2}
            />
            <GuessCell
              value={guess.guessedAge}
              result={guess.age}
              delay={3}
            />
            <GuessCell
              value={guess.guessedRole}
              result={guess.role}
              delay={4}
            />
            <GuessCell
              value={guess.guessedComposition}
              result={guess.composition}
              delay={5}
            />
            <GuessCell
              value={guess.guessedComposition2}
              result={guess.composition2}
              delay={6}
            />
            <GuessCell
              value={guess.guessedLaunchYear}
              result={guess.launchYear}
              delay={7}
            />
            <GuessCell
              value={guess.guessedHealth}
              result={guess.health}
              delay={8}
              />
          </div>
        ))}
      </div>

      {(showInstructions || isClosing) && (
        <div
          className={`${styles.modalOverlay} ${isClosing ? styles.modalOverlayClosing : ''}`}
          onClick={handleCloseInstructions}
        >
          <div
            className={`${styles.modalContent} ${isClosing ? styles.modalContentClosing : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseButton}
              onClick={handleCloseInstructions}
            >
              &times;
            </button>
            <h2 className={styles.modalTitle}>How to Play</h2>
            <ul className={styles.modalList}>
              <li>Type a hero's name in the search bar.</li>
              <li>Click the desired hero from the menu to submit your guess.</li>
              <li>A new row will appear with your guess's results.</li>
            </ul>
            <h3 className={styles.modalSubtitle}>Understanding Colors and Arrows</h3>
            <ul className={styles.modalList}>
              <li><span className={styles.modalColorCorrect}>Green</span>: The attribute is correct.</li>
              <li><span className={styles.modalColorWrong}>Red</span>: The attribute is wrong.</li>
              <li><span className={styles.modalColorWrong}>Red with an Arrow (↑)</span>: The correct number is **HIGHER** (e.g., Age, Health, Year).</li>
              <li><span className={styles.modalColorWrong}>Red with an Arrow (↓)</span>: The correct number is **LOWER** (e.g., Age, Health, Year).</li>
            </ul>
          </div>
        </div>
      )}
      {showWinModal && winData && (
        <div
          className={`${styles.modalOverlay}`}
        >
          <div
            className={`${styles.modalContent} ${styles.winModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>You Guessed It!</h2>
            <h2 className={styles.modalTitle}>come back tomorrow for more!</h2>
            <Image
              src={winData.portrait}
              alt={winData.name}
              width={150}
              height={150}
              className={styles.winModalImage}
            />
            <h3 className={styles.winModalHeroName}>{winData.name}</h3>
            <p className={styles.winModalAttempts}>
              You guessed it in {winData.attempts} {winData.attempts === 1 ? 'try' : 'tries'}!
            </p>
            <div className={styles.winModalAttempts}>
              Next Hero In: {countdown}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}