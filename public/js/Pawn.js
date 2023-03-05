
class Pawn extends Piece{
    en_passant = null;

    getValidMoves(board){
        let moves_on_empty = [MOVES[DIRECTIONS.UP]];
        if(this.first_move) {
            if(board[8*this.owner+this.current_position] === null)
                moves_on_empty.push(MOVES[DIRECTIONS.UP]*2);
        }

        moves_on_empty = moves_on_empty.map(m => m*this.owner+this.current_position)
            .filter(pos => pos in board)
            .filter(pos => board[pos] === null);
        
        let moves_on_take = this.getValidTakes(board)
            .filter(pos => board[pos] !== null)
            .filter(pos => board[pos].owner != this.owner);
        
        
        let moves = [...moves_on_empty, ...moves_on_take];

        // todo en passant
        if(this.en_passant){
            moves.push(this.en_passant.current_position + this.owner*MOVES[DIRECTIONS.UP])
        }

        if(!this.being_visited)
            moves = moves.filter(pos => this.filterCheck(board, pos));

        return moves;
    }

    getValidTakes(board){
        let col = this.current_position % 8;
        
        let moves_on_take = []

        if(this.owner === TEAM.WHITE)
        {
            moves_on_take = [
                MOVES[DIRECTIONS.UP_RIGHT]*Math.min(1, 7-col),
                MOVES[DIRECTIONS.UP_LEFT]*Math.min(1, col)
            ];
        }

        if(this.owner === TEAM.BLACK)
        {
            moves_on_take = [
                MOVES[DIRECTIONS.DOWN_RIGHT]*Math.min(1, 7-col),
                MOVES[DIRECTIONS.DOWN_LEFT]*Math.min(1, col)
            ];
        }
            
        
        let moves = moves_on_take.filter(m => m !== 0)
            .map(pos => pos + this.current_position)
            .filter(pos => pos in board)

        if(!this.being_visited)
            moves = moves.filter(pos => this.filterCheck(board, pos));

        return moves;
    }
    move(board, target){

        if(this.first_move && Math.abs(this.current_position - target) === 16){
            this.first_move = false;

            // check left
            let left = board[target + MOVES[DIRECTIONS.LEFT]];
            if( left !== null && left.toString() === "Pawn" && left.owner != this.owner){
                left.en_passant = this;
            }
            
            // check right
            let right = board[target + MOVES[DIRECTIONS.RIGHT]];
            if( right !== null && right.toString() === "Pawn" && right.owner != this.owner){
                right.en_passant = this;
            }
        }

        super.move(board, target);
    }
}