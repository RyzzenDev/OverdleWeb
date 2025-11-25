"use client";

import { useState, useEffect, useRef } from "react";
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
    const isValidImage = value && value !== "";

    return (
      <div className={cellClass} style={animationStyle}>
        {isValidImage ? (
          <Image
            src={value}
            alt="Hero Portrait"
            width={50}
            height={50}
            className={styles.guessCellImage}
            unoptimized={true}
          />
        ) : (
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>?</span>
        )}
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentGameId, setCurrentGameId] = useState(null);
  const STORAGE_KEY = 'overdleHero_gameState';

  const inputRef = useRef(null);

  const handleSearch = (e) => {
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
    const apiUrl = `${API_URL}/Heroes/Guess/${heroId}`

    console.log("Sending guess (via dropdown) for:", apiUrl);

    try {
      const response = await fetch(apiUrl, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to send guess to API');
      }

      const resultData = await response.json();
      console.log("API Response:", resultData);

      const newGuess = { ...resultData, id: `guess-${Date.now()}-${Math.random()}` };
      const newGuesses = [newGuess, ...guesses];
      setGuesses(newGuesses);

      let stateToSave = {};

      if (checkWinCondition(resultData)) {
        const newWinData = {
          name: resultData.guessedName,
          portrait: resultData.guessedHeroPortrait,
          attempts: newGuesses.length
        };
        setWinData(newWinData);
        setShowWinModal(true);
        setIsGameWon(true);

        stateToSave = {
          gameId: currentGameId,
          guesses: newGuesses,
          winData: newWinData
        };

      } else {

        stateToSave = {
          gameId: currentGameId,
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

  useEffect(() => {
    const fetchHeroes = async () => {
      const HEROES_STORAGE_KEY = 'overdleHero_heroesList';
      const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

      try {
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(HEROES_STORAGE_KEY);
          if (cachedData) {
            const { heroes, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();

            if (now - timestamp < CACHE_DURATION) {
              setAllHeroes(heroes);
              setIsLoading(false);
              return;
            }
          }
        }

        const response = await fetch(`${API_URL}/Heroes/ListDB`);
        if (!response.ok) {
          throw new Error('Failed to fetch API data. Status: ' + response.status);
        }
        const data = await response.json();
        setAllHeroes(data);

        if (typeof window !== 'undefined') {
          localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify({
            heroes: data,
            timestamp: new Date().getTime()
          }));
        }

      } catch (error) {
        console.error("ERROR CONNECTING TO API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeGame = async () => {
      let gameIsAlreadyWon = false; // Flag local
      let fetchedGameId = null;

      try {
        const idResponse = await fetch(`${API_URL}/Heroes/GameCount`);
        if (!idResponse.ok) {
          throw new Error('Failed to fetch current game ID');
        }
        fetchedGameId = await idResponse.json();
        setCurrentGameId(fetchedGameId);

        if (typeof window !== 'undefined') {
          const storedState = localStorage.getItem(STORAGE_KEY);

          if (storedState) {
            const savedState = JSON.parse(storedState);

            if (savedState.gameId === fetchedGameId) {
              if (savedState.guesses) {
                const loadedGuesses = savedState.guesses.map((g, i) => ({
                  ...g,
                  id: `loaded-${i}-${Date.now()}-${Math.random()}`
                }));
                setGuesses(loadedGuesses);
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
      } else {
        setIsLoading(false);
      }
    };

    const formatDuration = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const fetchNextHeroTime = async () => {
      const TIMER_STORAGE_KEY = 'overdleHero_nextHeroTime';
      try {
        let releaseTime;

        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(TIMER_STORAGE_KEY);
          if (cached) {
            const parsed = new Date(parseInt(cached));
            if (parsed.getTime() > new Date().getTime()) {
              releaseTime = parsed;
            }
          }
        }

        if (!releaseTime) {
          const response = await fetch(`${API_URL}/Heroes/Date`);
          if (!response.ok) throw new Error('Failed to fetch timer');
          const generationTimestamp = await response.json();
          const generationTime = new Date(generationTimestamp);

          if (isNaN(generationTime.getTime())) {
            throw new Error("Formato de data inválido recebido do backend: " + generationTimestamp);
          }

          releaseTime = new Date(generationTime.getTime() + (24 * 60 * 60 * 1000));

          if (typeof window !== 'undefined') {
            localStorage.setItem(TIMER_STORAGE_KEY, releaseTime.getTime().toString());
          }
        }

        const timerInterval = setInterval(() => {
          const now = new Date();
          const remainingTime = releaseTime.getTime() - now.getTime();

          if (remainingTime <= 0) {
            setCountdown("New hero available!");
            clearInterval(timerInterval);
            if (typeof window !== 'undefined') {
              localStorage.removeItem(TIMER_STORAGE_KEY);
            }

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

    initializeGame();
    fetchNextHeroTime();

  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src="/Images/icon.svg"
            alt="Overdle Logo"
            width={300}
            height={90}
            priority
          />
        </Link>
      </div>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Loading Heroes...</div>
        </div>
      )}

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
            <div
              className={styles.searchBar}
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
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
          <div key={guess.id} className={styles.guessRow}>
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