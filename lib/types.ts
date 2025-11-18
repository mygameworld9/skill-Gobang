
export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Lang = 'zh' | 'en';
export type GameMode = 'pvp' | 'pve' | 'online';
export type SkillType = 'thunder' | 'convert' | 'bomb' | 'portal' | 'double' | 'swap';

export interface Coordinate {
  row: number;
  col: number;
}

export interface GameState {
  board: Cell[][];
  currentPlayer: Player;
  gameStatus: 'playing' | 'won' | 'draw';
  winningLine: Coordinate[] | null;
  lastMove: Coordinate | null;
  cooldowns: Record<SkillType, number>;
  activeSkill: SkillType | null;
  selectedCell: Coordinate | null;
}

// Network Types
export type NetworkActionType = 'SYNC_CLICK' | 'SYNC_SKILL' | 'SYNC_RESET';

export interface NetworkMessage {
  type: NetworkActionType;
  payload?: any;
}
