
import React from 'react';
import { Globe, Users, Bot, Wifi } from 'lucide-react';
import { Lang, GameMode } from '../lib/types';
import { t } from '../lib/constants';

interface GameHeaderProps {
  lang: Lang;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  onModeChange: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ lang, setLang, gameMode, setGameMode, onModeChange }) => {
  const text = t(lang);
  
  const toggleMode = () => {
    if (gameMode === 'pvp') setGameMode('pve');
    else if (gameMode === 'pve') setGameMode('online');
    else setGameMode('pvp');
    onModeChange();
  };

  const getModeIcon = () => {
    if (gameMode === 'pvp') return <Users size={16} />;
    if (gameMode === 'pve') return <Bot size={16} />;
    return <Wifi size={16} />;
  };

  const getModeText = () => {
    if (gameMode === 'pvp') return text.modePvP;
    if (gameMode === 'pve') return text.modePvE;
    return text.modeOnline;
  };
  
  return (
    <>
      <div className="w-full max-w-[600px] flex justify-between items-center mb-4">
        <div className="flex gap-2">
             <button 
               onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
               className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-sm font-medium shadow-sm transition-colors"
             >
               <Globe size={16} />
               {text.switchLang}
             </button>
             <button 
               onClick={toggleMode}
               className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-sm font-medium shadow-sm transition-colors"
             >
               {getModeIcon()}
               {getModeText()}
             </button>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-6">{text.title}</h1>
    </>
  );
};
