
class King extends Piece{
    castle_moves = [];

    getValidMoves(board){

        let col = this.current_position % 8;

        let max_up = this.current_position + MOVES[DIRECTIONS.UP];
        let min_down = this.current_position + MOVES[DIRECTIONS.DOWN];
        let max_right = this.current_position + MOVES[DIRECTIONS.RIGHT]*Math.min(1, 7 - col);
        let min_left = this.current_position + MOVES[DIRECTIONS.LEFT]*Math.min(1, col);

        let min_dl = this.current_position + MOVES[DIRECTIONS.DOWN_LEFT]*Math.min(1, col);
        let max_ur = this.current_position + MOVES[DIRECTIONS.UP_RIGHT]*Math.min(1, 7-col);
        let min_dr = this.current_position + MOVES[DIRECTIONS.DOWN_RIGHT]*Math.min(1, 7-col);
        let max_ul = this.current_position + MOVES[DIRECTIONS.UP_LEFT]*Math.min(1, col);

        const dl_moves = this.getStraightMoves(board, DIRECTIONS.DOWN_LEFT, min_dl, this.current_position);
        const ur_moves = this.getStraightMoves(board, DIRECTIONS.UP_RIGHT, this.current_position, max_ur);
        const dr_moves = this.getStraightMoves(board, DIRECTIONS.DOWN_RIGHT, min_dr, this.current_position);
        const ul_moves = this.getStraightMoves(board, DIRECTIONS.UP_LEFT, this.current_position, max_ul);

        const up_moves = this.getStraightMoves(board, DIRECTIONS.UP, this.current_position, max_up);
        const down_moves = this.getStraightMoves(board, DIRECTIONS.DOWN, min_down, this.current_position);
        const left_moves = this.getStraightMoves(board, DIRECTIONS.LEFT, min_left, this.current_position);
        const right_moves = this.getStraightMoves(board, DIRECTIONS.RIGHT, this.current_position, max_right);
        
        let moves = [...up_moves, ...down_moves, ...left_moves, ...right_moves, ...dl_moves, ...ur_moves, ...dr_moves, ...ul_moves]
        
        if(!this.being_visited){
            
            moves = moves.filter(p => !this.opponentCanTake(board, p));
        
            const [check, m] = this.checkCastle(board)
            if(check){
                moves = [...moves, ...m.map(({move}) => move)];
                this.castle_moves = m;
            }
        }

        return moves;
    }

    move(board, pos){
        super.move(board, pos);

        if(this.first_move){
            this.first_move = false;
        }
    }

    checkCastle(board) {
        let moves = [];

        if(!this.first_move) return false, moves;

        // look left
        let next = this.current_position + MOVES[DIRECTIONS.LEFT];
        if(board[next] === null && this.filterCheck(board, next)){

            if(board[next + MOVES[DIRECTIONS.LEFT]] === null){
                next += MOVES[DIRECTIONS.LEFT];
                if(this.filterCheck(board, next)) {

                    // find rook
                    let rook = null;
                    let i = next;
                    while( i % 8 > 0){
                        if(board[--i] === null) continue;
                        
                        if(board[i].toString() === "Rook"){
                            rook = board[i];
                            break;
                        }
                    }

                    if(rook && rook.first_move){
                        moves.push({move: next, rook, castle: next - MOVES[DIRECTIONS.LEFT]});
                    }
                }
            }
        }


        // look right
        next = this.current_position + MOVES[DIRECTIONS.RIGHT];
        if(board[next] === null && this.filterCheck(board, next)) {

            if(board[next + MOVES[DIRECTIONS.RIGHT]] === null){
                next += MOVES[DIRECTIONS.RIGHT];
                if(this.filterCheck(board, next)) {
                    // find rook
                    let rook = null;
                    let i = next;
                    while( i % 8 < 7){
                        if(board[++i] === null) continue;

                        if(board[i].toString() === "Rook"){
                            rook = board[i];
                            break;
                        }
                    }

                    if(rook && rook.first_move){
                        moves.push({move: next, rook, castle: next - MOVES[DIRECTIONS.RIGHT]});
                    }
                }
            }
        }
        
        return [true, moves];
    }
}
