
import { useState, useCallback } from 'react';
import { Cell, Player, Coordinate, SkillType } from '../lib/types';
import { BOARD_SIZE, SKILL_COOLDOWNS } from '../lib/constants';
import { checkWin } from '../lib/utils';

export const useGameState = () => {
  const [board, setBoard] = useState<Cell[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winningLine, setWinningLine] = useState<Coordinate[] | null>(null);
  const [lastMove, setLastMove] = useState<Coordinate | null>(null);
  
  // Skills State
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<SkillType, number>>({
    thunder: 0,
    bomb: 0,
    convert: 0,
    portal: 0
  });
  const [selectedCell, setSelectedCell] = useState<Coordinate | null>(null);

  const handleMove = useCallback((r: number, c: number, player: Player) => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);
      newBoard[r][c] = player;
      
      const win = checkWin(newBoard, r, c, player);
      if (win) {
        setGameStatus('won');
        setWinningLine(win);
        // Do NOT switch player if won. Winner stays as current player.
      } else {
        // Standard turn switching logic
        setCooldowns(prev => {
          const newState = { ...prev };
          if (player === 'black') {
            newState.thunder = Math.max(0, newState.thunder - 1);
            newState.bomb = Math.max(0, newState.bomb - 1);
            setCurrentPlayer('white');
          } else {
            newState.convert = Math.max(0, newState.convert - 1);
            newState.portal = Math.max(0, newState.portal - 1);
            setCurrentPlayer('black');
          }
          return newState;
        });
      }
      return newBoard;
    });
    setLastMove({row: r, col: c});
  }, []);

  const useSkill = useCallback((r: number, c: number) => {
    let moveSuccessful = false;
    let turnConsumed = true; // Does this skill end the turn?
    let skillCooldownValue = 0;
    let gameWon = false; // Track if this skill resulted in a win

    // PORTAL SKILL LOGIC (2-Step)
    if (activeSkill === 'portal' && currentPlayer === 'white') {
      // Step 1: Select Source (Own Stone)
      if (!selectedCell) {
        if (board[r][c] === 'white') {
          setSelectedCell({ row: r, col: c });
          return false; // Don't consume turn yet, waiting for destination
        }
        return false; // Invalid selection
      } 
      // Step 2: Select Destination (Empty Cell)
      else {
        if (board[r][c] === null) {
           setBoard(prev => {
             const newBoard = prev.map(row => [...row]);
             newBoard[selectedCell.row][selectedCell.col] = null; // Remove from source
             newBoard[r][c] = 'white'; // Place at dest
             
             const win = checkWin(newBoard, r, c, 'white');
             if (win) {
               setGameStatus('won');
               setWinningLine(win);
               gameWon = true;
             }
             return newBoard;
           });
           setLastMove({row: r, col: c}); // Update last move to new position
           moveSuccessful = true;
           skillCooldownValue = SKILL_COOLDOWNS.whitePortal;
        } else if (board[r][c] === 'white') {
          // Change selection
          setSelectedCell({ row: r, col: c });
          return false;
        }
      }
    }

    else {
      // ONE-STEP SKILLS
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
        
        // BLACK SKILL: THUNDER (Destroy)
        if (activeSkill === 'thunder' && currentPlayer === 'black') {
           if (newBoard[r][c] !== null) {
             newBoard[r][c] = null;
             moveSuccessful = true;
             skillCooldownValue = SKILL_COOLDOWNS.blackThunder;
           }
        }
        // BLACK SKILL: BOMB (AOE Destroy)
        else if (activeSkill === 'bomb' && currentPlayer === 'black') {
           // Destroy everything in 3x3 area
           for (let i = r - 1; i <= r + 1; i++) {
             for (let j = c - 1; j <= c + 1; j++) {
               if (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE) {
                 newBoard[i][j] = null;
               }
             }
           }
           
           moveSuccessful = true;
           turnConsumed = true;
           skillCooldownValue = SKILL_COOLDOWNS.blackBomb;
           setLastMove({row: r, col: c});
        }
        // WHITE SKILL: CONVERT
        else if (activeSkill === 'convert' && currentPlayer === 'white') {
          if (newBoard[r][c] === 'black') {
            newBoard[r][c] = 'white';
            const win = checkWin(newBoard, r, c, 'white');
            if (win) {
               setGameStatus('won');
               setWinningLine(win);
               gameWon = true;
            }
            moveSuccessful = true;
            skillCooldownValue = SKILL_COOLDOWNS.whiteConvert;
          }
        }
        
        return newBoard;
      });
    }

    if (moveSuccessful) {
      // Apply Cooldowns
      setCooldowns(prev => {
        const newState = { ...prev };
        if (currentPlayer === 'black') {
          // Decrement others
          if (activeSkill !== 'thunder') newState.thunder = Math.max(0, newState.thunder - 1);
          if (activeSkill !== 'bomb') newState.bomb = Math.max(0, newState.bomb - 1);
          
          // Set active
          if (activeSkill) newState[activeSkill] = skillCooldownValue;
          
          // Switch player only if game not won
          if (turnConsumed && !gameWon) setCurrentPlayer('white');
        } else {
          // Decrement others
          if (activeSkill !== 'convert') newState.convert = Math.max(0, newState.convert - 1);
          if (activeSkill !== 'portal') newState.portal = Math.max(0, newState.portal - 1);
          
          // Set active
          if (activeSkill) newState[activeSkill] = skillCooldownValue;
          
          // Switch player only if game not won
          if (turnConsumed && !gameWon) setCurrentPlayer('black');
        }
        return newState;
      });

      setActiveSkill(null);
      setSelectedCell(null);
      
      // Special case: Thunder might remove the 'lastMove' highlight if we destroyed the last piece
      if (activeSkill === 'thunder' && lastMove?.row === r && lastMove?.col === c) {
        setLastMove(null);
      }
    }
    
    return moveSuccessful;
  }, [activeSkill, currentPlayer, lastMove, board, selectedCell]);

  // Reset active skill if user clicks cancel or changes mind
  const toggleSkill = (skill: SkillType) => {
    if (activeSkill === skill) {
      setActiveSkill(null);
      setSelectedCell(null);
    } else {
      setActiveSkill(skill);
      setSelectedCell(null);
    }
  };

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setGameStatus('playing');
    setWinningLine(null);
    setLastMove(null);
    setCurrentPlayer('black');
    setActiveSkill(null);
    setSelectedCell(null);
    setCooldowns({ thunder: 0, bomb: 0, convert: 0, portal: 0 });
  }, []);

  return {
    board,
    currentPlayer,
    gameStatus,
    winningLine,
    lastMove,
    activeSkill,
    cooldowns,
    selectedCell,
    setActiveSkill: toggleSkill,
    handleMove,
    useSkill,
    resetGame
  };
};
