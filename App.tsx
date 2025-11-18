
import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGeminiAI } from './hooks/useGeminiAI';
import { usePeerJS } from './hooks/usePeerJS';
import { GameHeader } from './components/GameHeader';
import { PlayerStatus } from './components/PlayerStatus';
import { GameControls } from './components/GameControls';
import { Board } from './components/Board';
import { RemoteConnection } from './components/RemoteConnection';
import { Lang, GameMode, SkillType, NetworkMessage } from './lib/types';

const App = () => {
  const [lang, setLang] = useState<Lang>('zh');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');

  const { 
    board, currentPlayer, gameStatus, winningLine, lastMove, 
    activeSkill, setActiveSkill, cooldowns, selectedCell,
    handleMove, useSkill, resetGame 
  } = useGameState();

  // PeerJS Integration
  const { 
    peerId, connectionStatus, isHost, 
    hostGame, joinGame, sendMessage, setOnMessage 
  } = usePeerJS();

  // Determine local player's role in Online mode
  const myOnlineRole = gameMode === 'online' ? (isHost ? 'black' : 'white') : null;

  // Handle incoming network messages
  useEffect(() => {
    if (gameMode === 'online') {
      setOnMessage((msg: NetworkMessage) => {
        if (msg.type === 'SYNC_CLICK') {
          const { r, c } = msg.payload;
          // Execute the action remotely
          // We need to check if a skill is active LOCALLY? 
          // No, the state should be synced. 
          // To ensure state is synced, we assume valid inputs.
          if (activeSkill) {
             useSkill(r, c);
          } else {
             handleMove(r, c, msg.payload.player); // Player payload is just for verification
          }
        }
        else if (msg.type === 'SYNC_SKILL') {
          setActiveSkill(msg.payload);
        }
        else if (msg.type === 'SYNC_RESET') {
          resetGame();
        }
      });
    }
  }, [gameMode, activeSkill, handleMove, useSkill, resetGame, setActiveSkill, setOnMessage]);

  const { isThinking } = useGeminiAI({
    board,
    currentPlayer,
    gameStatus,
    gameMode,
    onMakeMove: handleMove
  });

  // Wrapped Actions that sync to network
  const handleReset = () => {
    if (gameMode === 'online') sendMessage('SYNC_RESET');
    resetGame();
  };

  const handleSetActiveSkill = (skill: SkillType) => {
    // In online mode, only allowed to set skill if it's my turn
    if (gameMode === 'online' && currentPlayer !== myOnlineRole) return;
    
    if (gameMode === 'online') sendMessage('SYNC_SKILL', skill);
    setActiveSkill(skill);
  };

  const onCellClick = (r: number, c: number) => {
    if (gameStatus !== 'playing' || isThinking) return;
    
    // PvE Restriction
    if (gameMode === 'pve' && currentPlayer === 'white') return;

    // Online Restriction
    if (gameMode === 'online') {
      if (connectionStatus !== 'connected') return;
      // General Rule: Can only click if it's my turn
      // Exception: Portal Step 1 (Selecting own piece) - handled by checking ownership logic
      // But simplified: 
      // If I am Black, and it is White's turn, I generally cannot do anything.
      // Unless it's a skill that allows out-of-turn interaction? (None so far).
      if (currentPlayer !== myOnlineRole) return;
    }

    // Execute Logic Locally
    let actionTaken = false;

    if (activeSkill) {
       const used = useSkill(r, c);
       actionTaken = true; 
       // Note: useSkill might return false (e.g. selecting source for portal), but we still clicked
    } else {
       if (!board[r][c]) {
          handleMove(r, c, currentPlayer);
          actionTaken = true;
       }
    }

    // Sync if action taken
    if (actionTaken && gameMode === 'online') {
      sendMessage('SYNC_CLICK', { r, c, player: currentPlayer });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4 font-sans text-stone-800">
      <GameHeader 
        lang={lang} 
        setLang={setLang} 
        gameMode={gameMode} 
        setGameMode={setGameMode}
        onModeChange={resetGame}
      />

      {gameMode === 'online' && (
        <RemoteConnection 
          lang={lang}
          peerId={peerId}
          connectionStatus={connectionStatus}
          isHost={isHost}
          onHost={hostGame}
          onJoin={joinGame}
        />
      )}

      <PlayerStatus 
        currentPlayer={currentPlayer} 
        gameMode={gameMode} 
        isAiThinking={isThinking} 
        gameStatus={gameStatus} 
        lang={lang} 
      />

      <GameControls 
        activeSkill={activeSkill} 
        setActiveSkill={handleSetActiveSkill} 
        resetGame={handleReset} 
        gameMode={gameMode} 
        currentPlayer={currentPlayer} 
        gameStatus={gameStatus} 
        cooldowns={cooldowns}
        lang={lang} 
      />

      <Board 
        board={board}
        handleCellClick={onCellClick}
        winningLine={winningLine}
        lastMove={lastMove}
        activeSkill={activeSkill}
        selectedCell={selectedCell}
        isAiThinking={isThinking}
        gameStatus={gameStatus}
      />
    </div>
  );
};

export default App;
