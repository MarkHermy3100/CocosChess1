import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('Bot')
export class Bot extends Component {
    @property
    private color: number = 0;

    onLoad() {
        if (this.color == 1) {
            BoardState.flipped = true;
        }
    }

    chooseMove(): number[][][] {
        let moves: number[][] = [];
        let aftMoves: number[][] = [];
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                if (BoardState.board[i][j] * BoardState.turn > 0) {
                    for (let aft_i: number = 0; aft_i < 8; aft_i++) {
                        for (let aft_j: number = 0; aft_j < 8; aft_j++) {
                            if (BoardState.isValidMove(BoardState.board[i][j], 
                                BoardState.convertUIPosition([i, j]), BoardState.convertUIPosition([aft_i, aft_j]))) {
                                moves.push([i, j]);
                                aftMoves.push([aft_i, aft_j]);
                            }
                        }
                    }
                }
            }
        }
        return [moves, aftMoves];
    }

    openingFilter(moves: number[][], aftMoves: number[][]) {
        let filMoves: number[][] = [];
        let aftFilMoves: number[][] = [];
        if (BoardState.moves > 6) {
            return;
        }
        for (let i: number = 0; i < moves.length; i++) {
            if (BoardState.board[moves[i][0]][moves[i][1]] == -1) {
                if (aftMoves[i][1] == 2 || aftMoves[i][1] == 3 || aftMoves[i][1] == 4) {
                    filMoves.push(moves[i]);
                    aftFilMoves.push(aftMoves[i]);
                }
            }
            else if (BoardState.board[moves[i][0]][moves[i][1]] == 1) {
                if (aftMoves[i][1] == 5 || aftMoves[i][1] == 3 || aftMoves[i][1] == 4) {
                    filMoves.push(moves[i]);
                    aftFilMoves.push(aftMoves[i]);
                }
            }
            else if (Math.abs(BoardState.board[moves[i][0]][moves[i][1]]) == 2) {
                if (aftMoves[i][1] >= 2 && aftMoves[i][1] <= 5) {
                    filMoves.push(moves[i]);
                    aftFilMoves.push(aftMoves[i]);
                }
            }
        }
        moves = filMoves;
        aftMoves = aftFilMoves;

    }

    materialFilter(depth: number) {
        for (let d: number = 0; d < depth; d++) {
            //something
            
        }
    }

    mateFilter() {

    }

    update (deltaTime: number) {
        if (BoardState.gameOver) {
            return;
        }
        if (BoardState.turn == this.color && BoardState.promoting.x == -1000) {
            if (BoardState.nextBotMove[0][0] == -1) {
                let moveList = this.chooseMove();
                if (moveList[0].length == 0) {
                    BoardState.gameOver = true;
                    return;
                }
                let roll: number = Math.floor(Math.random() * moveList[0].length);
                BoardState.nextBotMove[0] = moveList[0][roll];
                BoardState.nextBotMove[1] = moveList[1][roll];
                this.schedule(function() {
                    BoardState.turn *= -1;
                    BoardState.moves += 1;
                    BoardState.justMoved = true;
                }, 0, 0, 4);
            }
                   
        }
    }
}
