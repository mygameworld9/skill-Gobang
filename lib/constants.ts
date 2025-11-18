
import { Lang } from './types';

export const BOARD_SIZE = 15;

// Cooldowns (in turns)
export const SKILL_COOLDOWNS = {
  blackThunder: 5,
  blackBomb: 10,
  blackDouble: 12,
  whiteConvert: 7,
  whitePortal: 4,
  whiteSwap: 9
};

export const TRANSLATIONS = {
  zh: {
    title: "技能五子棋",
    black: "黑方",
    white: "白方",
    you: "(你)",
    ai: "(AI)",
    p1: "(玩家1)",
    p2: "(玩家2)",
    host: "(房主)",
    guest: "(访客)",
    skillThunder: "⚡ 雷击",
    skillBomb: "💣 轰炸",
    skillDouble: "⚡⚡ 连动",
    skillConvert: "🔮 策反",
    skillPortal: "🌀 传送",
    skillSwap: "🔄 交换",
    cancelSkill: "取消",
    selectSource: "选择棋子",
    selectDest: "选择位置",
    restart: "重新开始",
    wins: "获胜!",
    draw: "平局!",
    modePvP: "双人模式",
    modePvE: "人机模式",
    modeOnline: "在线对战",
    thinking: "思考中...",
    switchLang: "English",
    aiError: "AI 思考失败",
    cooldown: "冷却",
    turns: "回合",
    // Online
    createRoom: "创建房间",
    joinRoom: "加入房间",
    roomId: "房间 ID",
    enterRoomId: "输入房间 ID",
    connect: "连接",
    waiting: "等待连接...",
    connected: "已连接!",
    copy: "复制",
    onlineDesc: "P2P 远程对战模式"
  },
  en: {
    title: "Skill Gomoku",
    black: "Black",
    white: "White",
    you: "(You)",
    ai: "(AI)",
    p1: "(P1)",
    p2: "(P2)",
    host: "(Host)",
    guest: "(Guest)",
    skillThunder: "⚡ Thunder",
    skillBomb: "💣 Bomb",
    skillDouble: "⚡⚡ Double",
    skillConvert: "🔮 Convert",
    skillPortal: "🌀 Portal",
    skillSwap: "🔄 Swap",
    cancelSkill: "Cancel",
    selectSource: "Select Stone",
    selectDest: "Select Pos",
    restart: "Restart",
    wins: "Wins!",
    draw: "Draw!",
    modePvP: "PvP Mode",
    modePvE: "PvE Mode",
    modeOnline: "Online PvP",
    thinking: "Thinking...",
    switchLang: "中文",
    aiError: "AI Move Failed",
    cooldown: "CD",
    turns: "turns",
    // Online
    createRoom: "Create Room",
    joinRoom: "Join Room",
    roomId: "Room ID",
    enterRoomId: "Enter Room ID",
    connect: "Connect",
    waiting: "Waiting for player...",
    connected: "Connected!",
    copy: "Copy",
    onlineDesc: "P2P Remote Play"
  }
};

export const t = (lang: Lang) => TRANSLATIONS[lang];
