
class Knight extends Piece{
    getValidMoves(board){
        let row = parseInt(this.current_position / 8);
        let col = this.current_position % 8;
        let moves = [];
        
        // up moves
        if(row <= 5){
            if(col >= 1){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.UP] + MOVES[DIRECTIONS.LEFT])
            }
            if( col <= 6){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.UP] + MOVES[DIRECTIONS.RIGHT])
            }
        }

        // down moves
        if(row >= 2){
            if(col >= 1){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.DOWN] + MOVES[DIRECTIONS.LEFT])
            }
            if( col <= 6){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.DOWN] + MOVES[DIRECTIONS.RIGHT])
            }
        }

        // left moves
        if(col >= 2){
            if(row >= 1){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.LEFT] + MOVES[DIRECTIONS.DOWN])
            }
            if( row <= 6){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.LEFT] + MOVES[DIRECTIONS.UP])
            }
        }

        // right moves
        if(col <= 5){
            if(row >= 1){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.RIGHT] + MOVES[DIRECTIONS.DOWN])
            }
            if( row <= 6){
                moves.push(this.current_position + 2*MOVES[DIRECTIONS.RIGHT] + MOVES[DIRECTIONS.UP])
            }
        }

        moves = moves.filter(p => this.isInBoard(board, p))
            .filter(p => this.isNotFriendly(board, p));

        if(!this.being_visited)
            moves = moves.filter(pos => this.filterCheck(board, pos));

        return moves;
    }
}
