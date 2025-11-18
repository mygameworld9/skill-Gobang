
import React from 'react';
import { Player, Lang, GameMode } from '../lib/types';
import { t } from '../lib/constants';

interface PlayerStatusProps {
  currentPlayer: Player;
  gameMode: GameMode;
  isAiThinking: boolean;
  gameStatus: 'playing' | 'won' | 'draw';
  lang: Lang;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({ currentPlayer, gameMode, isAiThinking, gameStatus, lang }) => {
  const text = t(lang);

  return (
    <>
      <div className="flex gap-4 mb-6">
         <div className={`px-4 py-2 rounded shadow transition-all flex items-center gap-2 ${currentPlayer === 'black' ? 'bg-stone-800 text-white scale-105' : 'bg-stone-300 text-stone-600'}`}>
             <div className="w-3 h-3 rounded-full bg-black border border-stone-500"></div>
             {text.black} {gameMode === 'pve' ? text.you : text.p1}
         </div>
         <div className={`px-4 py-2 rounded shadow transition-all flex items-center gap-2 ${currentPlayer === 'white' ? 'bg-white text-stone-800 scale-105' : 'bg-stone-300 text-stone-600'}`}>
             <div className="w-3 h-3 rounded-full bg-white border border-stone-300"></div>
             {text.white} {gameMode === 'pve' ? text.ai : text.p2} {isAiThinking && text.thinking}
         </div>
      </div>

      {gameStatus !== 'playing' && (
          <div className="mb-4 text-2xl font-bold text-amber-600 animate-bounce">
              {gameStatus === 'won' 
                ? `${currentPlayer === 'black' ? text.black : text.white} ${text.wins}` 
                : text.draw}
          </div>
      )}
    </>
  );
};
