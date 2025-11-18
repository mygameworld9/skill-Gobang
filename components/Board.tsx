
import React, { useState } from 'react';
import { Cell, Coordinate, SkillType } from '../lib/types';
import { BOARD_SIZE, t } from '../lib/constants';

interface BoardProps {
  board: Cell[][];
  handleCellClick: (r: number, c: number) => void;
  winningLine: Coordinate[] | null;
  lastMove: Coordinate | null;
  activeSkill: SkillType | null;
  selectedCell: Coordinate | null;
  isAiThinking: boolean;
  gameStatus: 'playing' | 'won' | 'draw';
}

export const Board: React.FC<BoardProps> = ({
  board, handleCellClick, winningLine, lastMove, activeSkill, selectedCell, isAiThinking, gameStatus
}) => {
  const [hoverCell, setHoverCell] = useState<Coordinate | null>(null);
  
  // Helper to determine cursor style and feedback text
  const getBoardCursor = () => {
    if (gameStatus !== 'playing') return 'default';
    if (activeSkill === 'thunder') return 'crosshair';
    if (activeSkill === 'convert') return 'alias';
    if (activeSkill === 'portal') return selectedCell ? 'copy' : 'grab';
    if (activeSkill === 'swap') return selectedCell ? 'alias' : 'grab';
    if (activeSkill === 'bomb') return 'crosshair';
    if (activeSkill === 'double') return 'copy';
    if (!activeSkill && !isAiThinking) return 'pointer';
    return 'wait';
  };

  return (
      <div className="relative bg-[#eecfa1] rounded-lg shadow-2xl overflow-hidden select-none transition-all"
           style={{
               width: 'min(95vw, 600px)',
               height: 'min(95vw, 600px)',
               padding: '1rem',
               cursor: getBoardCursor()
           }}
           onMouseLeave={() => setHoverCell(null)}
           >
           
          {/* Board Grid Lines */}
          <div className="absolute inset-4 pointer-events-none" style={{ zIndex: 0 }}>
               {/* Horizontal Lines */}
               {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                   <div key={`h-${i}`} className="absolute bg-stone-800/40 h-px w-full" 
                        style={{ top: `calc(${(i / (BOARD_SIZE - 1)) * 100}%)` }}></div>
               ))}
               {/* Vertical Lines */}
               {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                   <div key={`v-${i}`} className="absolute bg-stone-800/40 w-px h-full" 
                        style={{ left: `calc(${(i / (BOARD_SIZE - 1)) * 100}%)` }}></div>
               ))}
          </div>

          {/* Active Skill Indicator Overlay */}
          {activeSkill && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold pointer-events-none backdrop-blur-sm whitespace-nowrap">
               {activeSkill === 'portal' && !selectedCell ? 'Select Stone to Move' : ''}
               {activeSkill === 'portal' && selectedCell ? 'Select Empty Space' : ''}
               {activeSkill === 'swap' && !selectedCell ? 'Select Your Stone' : ''}
               {activeSkill === 'swap' && selectedCell ? 'Select Opponent Stone' : ''}
               {activeSkill === 'bomb' ? 'Select Area to Bomb (3x3)' : ''}
               {activeSkill === 'thunder' ? 'Select Stone to Destroy' : ''}
               {activeSkill === 'convert' ? 'Select Opponent Stone' : ''}
               {activeSkill === 'double' ? 'Place Free Stone' : ''}
            </div>
          )}

          {/* Board Cells Container */}
          <div className="relative w-full h-full z-10"
               style={{
                   display: 'grid',
                   gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                   gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
               }}>
              {board.map((row, rIndex) => (
                row.map((cell, cIndex) => {
                  const isWinningPiece = winningLine?.some(p => p.row === rIndex && p.col === cIndex);
                  const isLastMove = lastMove?.row === rIndex && lastMove?.col === cIndex;
                  const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
                  
                  // Bomb Hover Logic
                  const isInBombRadius = activeSkill === 'bomb' && hoverCell && 
                                         Math.abs(hoverCell.row - rIndex) <= 1 && 
                                         Math.abs(hoverCell.col - cIndex) <= 1;

                  // Hover Logic
                  let hoverClass = '';
                  if (!isAiThinking && gameStatus === 'playing') {
                    if (activeSkill === 'thunder' && cell) hoverClass = 'hover:bg-red-500/50 rounded-full';
                    else if (activeSkill === 'convert' && cell === 'black') hoverClass = 'hover:ring-4 hover:ring-purple-400 rounded-full';
                    else if (activeSkill === 'portal') {
                      if (!selectedCell && cell === 'white') hoverClass = 'hover:ring-4 hover:ring-blue-400 rounded-full';
                      else if (selectedCell && !cell) hoverClass = 'hover:bg-blue-500/30 rounded-full hover:after:content-[""] hover:after:w-3 hover:after:h-3 hover:after:bg-blue-500 hover:after:rounded-full flex justify-center items-center';
                    }
                    else if (activeSkill === 'swap') {
                      if (!selectedCell && cell === 'white') hoverClass = 'hover:ring-4 hover:ring-emerald-400 rounded-full';
                      else if (selectedCell && cell === 'black') hoverClass = 'hover:ring-4 hover:ring-emerald-600 hover:bg-emerald-500/30 rounded-full';
                    }
                    else if (activeSkill === 'double' && !cell) hoverClass = 'hover:after:content-[""] hover:after:w-3 hover:after:h-3 hover:after:bg-black/60 hover:after:rounded-full flex justify-center items-center ring-2 ring-yellow-400/50 rounded-full';
                    else if (!activeSkill && !cell) hoverClass = 'hover:after:content-[""] hover:after:w-3 hover:after:h-3 hover:after:bg-black/20 hover:after:rounded-full flex justify-center items-center';
                  }

                  return (
                  <div
                    key={`${rIndex}-${cIndex}`}
                    onClick={() => handleCellClick(rIndex, cIndex)}
                    onMouseEnter={() => activeSkill === 'bomb' && setHoverCell({row: rIndex, col: cIndex})}
                    className={`relative z-10 ${hoverClass} ${isInBombRadius ? 'bg-red-500/40 transition-colors duration-100 rounded-sm' : ''}`}
                  >
                    {/* Ripple Effect for Last Move */}
                    {isLastMove && cell && !isSelected && (
                       <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[70%] h-[70%] rounded-full bg-stone-600/30 animate-ping"></div>
                       </div>
                    )}

                    {/* Selection Ring */}
                    {isSelected && (
                       <div className={`absolute inset-[-4px] z-0 border-2 rounded-full animate-pulse ${activeSkill === 'swap' ? 'border-emerald-500' : 'border-blue-500'}`}></div>
                    )}

                    {cell && (
                      <div className={`
                        w-[85%] h-[85%] rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.4)] mx-auto my-auto
                        transition-all duration-300 transform scale-100 relative z-10
                        ${cell === 'black' 
                          ? 'bg-stone-900 bg-[radial-gradient(at_30%_30%,_#666,_#000)]' 
                          : 'bg-stone-100 bg-[radial-gradient(at_30%_30%,_#fff,_#ccc)] border border-stone-300'}
                        
                        ${activeSkill === 'thunder' ? 'hover:scale-90 hover:brightness-75' : ''}
                        ${isSelected ? 'scale-90 opacity-80 ring-2 ring-blue-400' : ''}
                        
                        ${isWinningPiece ? 'ring-4 ring-amber-500/80 scale-110 z-20 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)]' : ''}
                      `}>
                         {/* Last Move Marker (Dot) */}
                         {isLastMove && (
                           <div className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${cell === 'black' ? 'bg-red-500' : 'bg-red-400'}`} />
                         )}
                      </div>
                    )}
                  </div>
                )})
              ))}
          </div>
      </div>
  );
};
