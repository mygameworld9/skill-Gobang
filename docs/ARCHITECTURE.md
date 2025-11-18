
# Project Architecture

This project follows a feature-based modular architecture to ensure scalability and maintainability.

## Folder Structure

*   **`components/`**: Pure UI components. Should receive data via props and allow the parent to handle logic.
    *   `Board.tsx`: The visual grid.
    *   `GameHeader.tsx`: Title and global settings (Lang/Mode).
    *   `GameControls.tsx`: Action buttons (Skills, Reset).
    *   `PlayerStatus.tsx`: Indicators for whose turn it is and game results.
*   **`hooks/`**: Reusable logic and state management.
    *   `useGameState.ts`: Core Gomoku logic (board state, turns, winning).
    *   `useGeminiAI.ts`: Encapsulates all interactions with `@google/genai`.
*   **`lib/`**: Utilities, constants, and types.
    *   `types.ts`: Shared TypeScript interfaces.
    *   `constants.ts`: Configuration (Board size) and Translations.
    *   `utils.ts`: Pure functions (e.g., `checkWin` algorithm).
*   **`docs/`**: Documentation files.

## Development Guidelines for AI Agents

**CRITICAL:** When modifying this project, you MUST follow these rules:

1.  **Read First**: specificially check `docs/CHANGELOG.md` and `docs/ARCHITECTURE.md` before coding to understand the current state.
2.  **Update Documentation**: 
    *   If you add a feature, update `docs/README.md` and `docs/CHANGELOG.md`.
    *   If you refactor structure, update `docs/ARCHITECTURE.md`.
3.  **Maintain Modularity**:
    *   Do NOT put logic back into `App.tsx`.
    *   Keep `checkWin` in `lib/utils.ts`.
    *   Keep AI calls in `hooks/useGeminiAI.ts`.
4.  **AI SDK Rules**:
    *   Always use `new GoogleGenAI({ apiKey: process.env.API_KEY })`.
    *   Use `gemini-2.5-flash` for standard logic.
5.  **Styling**: Use Tailwind CSS for all styling.

## Data Flow

1.  `App.tsx` initializes `useGameState`.
2.  `board` and `currentPlayer` are passed to `useGeminiAI`.
3.  UI Components receive state and callbacks from `App.tsx`.
4.  When AI thinks, `isThinking` locks UI interactions.
