
class Bishop extends Piece{
    getValidMoves(board){
        let row = parseInt(this.current_position / 8)
        let col = this.current_position % 8;

        let min_dl = this.current_position 
            + Math.min(col, row)*MOVES[DIRECTIONS.DOWN_LEFT];
        let max_ur = this.current_position 
            + Math.min(8 - col - 1, 8 - row - 1)*MOVES[DIRECTIONS.UP_RIGHT];
        let min_dr = this.current_position 
            + Math.min(8 - col - 1, row)*MOVES[DIRECTIONS.DOWN_RIGHT];
        let max_ul = this.current_position 
            + Math.min(col, 8 - row - 1)*MOVES[DIRECTIONS.UP_LEFT];

        const dl_moves = this.getStraightMoves(board, DIRECTIONS.DOWN_LEFT, min_dl, this.current_position);
        const ur_moves = this.getStraightMoves(board, DIRECTIONS.UP_RIGHT, this.current_position, max_ur);
        const dr_moves = this.getStraightMoves(board, DIRECTIONS.DOWN_RIGHT, min_dr, this.current_position);
        const ul_moves = this.getStraightMoves(board, DIRECTIONS.UP_LEFT, this.current_position, max_ul);
        
        let moves = [...dl_moves, ...ur_moves, ...dr_moves, ...ul_moves];
        if(!this.being_visited)
            moves = moves.filter(pos => this.filterCheck(board, pos));

        return moves;
    }
}
