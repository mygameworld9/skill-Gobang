
import { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Cell, GameMode, Player } from '../lib/types';
import { BOARD_SIZE } from '../lib/constants';

// Initialize Gemini API
// Note: We create the instance here to ensure it's ready, but in a larger app 
// this might be in a Context or Service.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface UseGeminiAIProps {
  board: Cell[][];
  currentPlayer: Player;
  gameStatus: 'playing' | 'won' | 'draw';
  gameMode: GameMode;
  onMakeMove: (row: number, col: number, player: Player) => void;
}

export const useGeminiAI = ({ board, currentPlayer, gameStatus, gameMode, onMakeMove }: UseGeminiAIProps) => {
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (gameMode === 'pve' && currentPlayer === 'white' && gameStatus === 'playing') {
      const makeAiMove = async () => {
        setIsThinking(true);
        try {
          // Simple board representation for the prompt
          const boardStr = board.map(row => row.map(c => c === 'black' ? 'X' : c === 'white' ? 'O' : '.').join('')).join('\n');
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are playing Gomoku (15x15 board). You are White (O). Black is X.
            Current board state:
            ${boardStr}
            
            Analyze the board. Return the best move for White as a JSON object with "row" and "col" (0-indexed).
            Prioritize winning or blocking Black from winning.`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  row: { type: Type.INTEGER },
                  col: { type: Type.INTEGER }
                },
                required: ['row', 'col']
              }
            }
          });
          
          const result = JSON.parse(response.text);
          if (result && typeof result.row === 'number' && typeof result.col === 'number') {
            if (result.row >= 0 && result.row < BOARD_SIZE && result.col >= 0 && result.col < BOARD_SIZE && !board[result.row][result.col]) {
              onMakeMove(result.row, result.col, 'white');
            } else {
              // Fallback: find first empty spot
              fallbackMove();
            }
          }
        } catch (e) {
          console.error("AI move failed", e);
          fallbackMove();
        } finally {
          setIsThinking(false);
        }
      };

      const fallbackMove = () => {
        for(let r=0; r<BOARD_SIZE; r++) {
          for(let c=0; c<BOARD_SIZE; c++) {
            if(!board[r][c]) {
              onMakeMove(r, c, 'white');
              return;
            }
          }
        }
      }

      makeAiMove();
    }
  }, [currentPlayer, gameStatus, board, gameMode]); // Removed onMakeMove from dep array to prevent loops if reference unstable

  return { isThinking };
};
