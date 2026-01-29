![Logo do OverDaily](/public/Images/icon.svg)
# ⚛️ OverDaily Frontend

> The user interface (UI) and client application for the daily guessing game set in the Overwatch universe.

This repository holds the complete frontend codebase for **OverDaily**, a daily challenge game that tests players' knowledge of Overwatch Heroes based on their attributes, data, and various clues. Developed with **Next.js** and **React**, the project focuses on offering a fast, responsive, and visually immersive user experience.

## 🔗 Backend Connection

The frontend application communicates with the **OverDaily API** to fetch daily challenge data, the complete list of heroes, and submit guesses for validation.

The dedicated backend repository, which manages the core game logic and data persistence using **Java 21 / Spring Boot 3** and **Redis**, can be found here:

### [👉 OverDaily API Repository](https://github.com/RyzzenDev/Overdle-API)

## 🎮 Play Now

The application is hosted on Vercel and the live game can be accessed directly at:

### [👉 overdle.com](https://www.overdle.com)

---

## ⚡ Key Features

* **Daily Challenge Interface:** Presents the main interface for the hero guessing game, showing clues and user guesses.
* **Guessing System:** Handles user input, search functionality, and displays color-coded feedback (Green/Red with directional arrows).
* **Performance:** Leverages **Next.js**'s App Router architecture for efficient rendering and fast loading speeds.
* **State Persistence:** Uses Local Storage to maintain game continuity (current game ID and previous guesses).
* **Game Modes Platform:** Features a modular homepage ready to host future game mode expansions.

---

## 🚀 Tech Stack

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white) | The core framework, built on React, for routing and rendering. |
| **Library** | ![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat&logo=react&logoColor=black) | UI library. |
| **Language** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Primary development language. |
| **Styling** | ![CSS Modules](https://img.shields.io/badge/CSS_Modules-264DE4?style=flat&logo=css3&logoColor=white) | Modular, highly customized styling. |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) | Hosting platform. |

---

## 🔮 Roadmap & Future Features

The frontend architecture is designed to seamlessly integrate the following new game modes planned for the backend, showing continuous development commitment:

* **Ability Mode:** Guess the Hero based on ability icons or descriptions.
* **Voice Line Mode:** Challenge your knowledge by identifying Heroes from obscure voice lines.
* **Map Guessing:** A visual mode to guess the Overwatch map from a screenshot.
* **Ultimate Mode:** A specialized mode focusing entirely on Ultimate voice lines and sound effects.

---

## 📝 License & Disclaimer

The code in this repository is licensed under the **GNU General Public License, Version 3**.

**Disclaimer:** OverDaily is a non-official, fan-made project created as a tribute to the Overwatch™ universe. Overwatch™ and all related intellectual properties (characters, names, art, sounds, etc.) are registered trademarks and property of Blizzard Entertainment, Inc.©. The project is entirely free and non-profit.
