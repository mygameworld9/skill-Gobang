
import { Cell, Player, Coordinate } from './types';
import { BOARD_SIZE } from './constants';

export const checkWin = (boardState: Cell[][], row: number, col: number, player: Player): Coordinate[] | null => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
        const line: Coordinate[] = [{row, col}];
        // Check positive direction
        for (let i = 1; i < 5; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === player) {
                line.push({row: r, col: c});
            } else break;
        }
        // Check negative direction
        for (let i = 1; i < 5; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === player) {
                line.push({row: r, col: c});
            } else break;
        }
        if (line.length >= 5) return line;
    }
    return null;
};
