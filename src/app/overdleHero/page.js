"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// 1. Importamos o nosso arquivo de estilos
import styles from './page.module.css';

export default function OverdleHeroPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [allHeroes, setAllHeroes] = useState([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch('http://localhost:8080/Heroes/ListDB');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados da API. Status: ' + response.status);
        }

        const data = await response.json();
        setAllHeroes(data);

      } catch (error) {
        console.error("ERRO AO CONECTAR COM A API:", error);
      }
    };

    fetchHeroes();

  }, []);

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

  // --- [ NOVA FUNÇÃO ADICIONADA ] ---
  // Esta função é chamada QUANDO o usuário clica em um herói no dropdown
  const handleHeroSelect = async (hero) => {
    // 1. Atualiza a barra de pesquisa com o nome
    setSearchTerm(hero.heroName);
    // 2. Fecha o dropdown
    setFilteredHeroes([]);

    // 3. Pega o ID para a PathVariable
    const heroId = hero.id;

    // --- IMPORTANTE: Ajuste esta URL se for diferente ---
    const apiUrl = `http://localhost:8080/Heroes/Guess/${heroId}`;

    console.log("Enviando palpite (via dropdown) para:", apiUrl);

    try {
      // 4. Faz a requisição para a API
      const response = await fetch(apiUrl, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar palpite para a API');
      }

      // 5. Pega a resposta (o JSON de volta)
      const resultData = await response.json();

      // Por enquanto, só mostramos no console
      console.log("Resposta da API:", resultData);

      // --- FUTURAMENTE ---
      // Aqui é onde vamos mostrar os quadrados coloridos

    } catch (error) {
      console.error("Erro ao enviar palpite:", error);
    }
  };
  // --- [ FIM DA NOVA FUNÇÃO ] ---

  // 2. Usamos as classes do nosso CSS Module
  return (
    <main className={styles.main}>

      <div className={styles.logoContainer}>
        <Image
          src="/Images/Logo.svg" // Corrigido para o caminho que você usou
          alt="Overdle Logo"
          width={500}
          height={150}
          priority
        />
      </div>

      <div className={styles.guessBox}>
        <h2 className={styles.guessBoxTitle}>
          CAN YOU GUESS THE HERO?
        </h2>
      </div>

      <div className={styles.searchContainer}>

        {/* --- MUDANÇA ESTRUTURAL AQUI --- */}
        {/* Este novo div usa a classe .searchRow do seu CSS */}
        <div className={styles.searchRow}>

          {/* A searchBar agora só contém o input */}
          <div className={styles.searchBar}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          {/* Os botões agora são "irmãos" da searchBar */}
          <button className={styles.searchButton}>
            {"?"}
          </button>
        </div>
        {/* --- FIM DA MUDANÇA ESTRUTURAL --- */}


        {filteredHeroes.length > 0 && (
          <div className={styles.dropdown}>
            {filteredHeroes.map((hero) => (
              <div
                key={hero.id}
                className={styles.dropdownItem}
                // --- [ ONCLICK ATUALIZADO ] ---
                // Agora chama a nova função que faz o 'fetch'
                onClick={() => handleHeroSelect(hero)}
                // --- [ FIM DA ATUALIZAÇÃO ] ---
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
    </main>
  );
}