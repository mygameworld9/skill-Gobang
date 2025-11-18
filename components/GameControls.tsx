
import React from 'react';
import { RefreshCw, Zap, Sparkles, Bomb, Repeat } from 'lucide-react';
import { Lang, GameMode, Player, SkillType } from '../lib/types';
import { t, SKILL_COOLDOWNS } from '../lib/constants';

interface GameControlsProps {
  activeSkill: SkillType | null;
  setActiveSkill: (skill: SkillType) => void;
  resetGame: () => void;
  gameMode: GameMode;
  currentPlayer: Player;
  gameStatus: 'playing' | 'won' | 'draw';
  cooldowns: Record<SkillType, number>;
  lang: Lang;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  activeSkill, setActiveSkill, resetGame, gameMode, currentPlayer, gameStatus, 
  cooldowns, lang 
}) => {
  const text = t(lang);

  const renderSkillButton = (
    player: Player, 
    skill: SkillType, 
    cooldown: number, 
    maxCooldown: number,
    icon: React.ReactNode, 
    label: string,
    colorClass: string,
    activeColorClass: string
  ) => {
    const isMyTurn = currentPlayer === player;
    const isReady = cooldown === 0;
    const isActive = activeSkill === skill;
    const isAiOpponent = gameMode === 'pve' && player === 'white';

    return (
      <div className="relative flex flex-col items-center group">
        <button 
          onClick={() => setActiveSkill(skill)}
          disabled={!isMyTurn || !isReady || gameStatus !== 'playing' || isAiOpponent}
          className={`
            w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-md
            ${isActive 
              ? activeColorClass 
              : isMyTurn && isReady && !isAiOpponent
                ? `${colorClass} hover:scale-110 hover:brightness-110` 
                : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'}
          `}
          title={label}
        >
          {icon}
          
          {/* Cooldown Overlay */}
          {!isReady && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl text-white font-bold text-sm backdrop-blur-[1px]">
               {cooldown}
             </div>
          )}
        </button>
        
        {/* Label & CD Info */}
        <div className="hidden md:block absolute -bottom-6 whitespace-nowrap text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
           {label} ({maxCooldown})
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-6 bg-stone-200/50 p-2 rounded-2xl">
        
        {/* Black Skills (Left) */}
        <div className="flex gap-3 items-center">
           {renderSkillButton(
             'black', 'thunder', cooldowns.thunder, SKILL_COOLDOWNS.blackThunder,
             <Zap size={22} className={activeSkill === 'thunder' ? 'fill-current' : ''} />, 
             text.skillThunder, 'bg-stone-800 text-white', 'bg-red-600 text-white ring-4 ring-red-200'
           )}
           {renderSkillButton(
             'black', 'bomb', cooldowns.bomb, SKILL_COOLDOWNS.blackBomb,
             <Bomb size={22} className={activeSkill === 'bomb' ? 'fill-current animate-pulse' : ''} />, 
             text.skillBomb, 'bg-stone-800 text-white', 'bg-orange-600 text-white ring-4 ring-orange-200'
           )}
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          <div className="w-px h-10 bg-stone-400/40 hidden sm:block"></div>
          <button
            onClick={resetGame}
            className="w-12 h-12 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors shadow-sm border-2 border-white"
            title={text.restart}
          >
            <RefreshCw size={20} />
          </button>
          <div className="w-px h-10 bg-stone-400/40 hidden sm:block"></div>
        </div>

        {/* White Skills (Right) */}
        <div className="flex gap-3 items-center">
           {renderSkillButton(
             'white', 'convert', cooldowns.convert, SKILL_COOLDOWNS.whiteConvert,
             <Sparkles size={22} className={activeSkill === 'convert' ? 'fill-current' : ''} />, 
             text.skillConvert, 'bg-white text-stone-800 border-2 border-stone-300', 'bg-purple-600 text-white ring-4 ring-purple-200 border-transparent'
           )}
           {renderSkillButton(
             'white', 'portal', cooldowns.portal, SKILL_COOLDOWNS.whitePortal,
             <Repeat size={22} className={activeSkill === 'portal' ? 'animate-spin-slow' : ''} />, 
             text.skillPortal, 'bg-white text-stone-800 border-2 border-stone-300', 'bg-blue-500 text-white ring-4 ring-blue-200 border-transparent'
           )}
        </div>
    </div>
  );
};
