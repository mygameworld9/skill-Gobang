
# Skill Gobang (技能五子棋)

A Gomoku (Five in a Row) game with RPG-like skill elements, powered by Google Gemini AI.

## Features

*   **Modes**:
    *   **PvP (Player vs Player)**: Local multiplayer.
    *   **PvE (Player vs AI)**: Play against Gemini 2.5 Flash.
    *   **Online PvP**: Remote P2P multiplayer using PeerJS.
*   **Skills System** (Independent Cooldowns):
    *   **Black Skills (Aggressive)**:
        *   **Thunder (雷击)**: Destroy any stone on the board. (CD: 5)
        *   **Bomb (轰炸)**: Destroy all stones in a selected 3x3 area. (CD: 10)
    *   **White Skills (Tactical)**:
        *   **Convert (策反)**: Convert an opponent's stone into yours. (CD: 7)
        *   **Portal (传送)**: Move one of your stones to any empty spot. (CD: 4)
*   **Language**:
    *   Dual language support: Chinese (ZH) and English (EN).
*   **Tech Stack**:
    *   React 19
    *   Tailwind CSS
    *   Google GenAI SDK
    *   PeerJS (WebRTC)
    *   Lucide React Icons

## Getting Started

The project uses ES Modules in the browser. Ensure `index.html` loads `index.tsx` as a module.
The API Key is injected via `process.env.API_KEY`.
