
class Rook extends Piece{
    getValidMoves(board){
        let max_up = 64 - 8 + (this.current_position % 8);
        let min_down = this.current_position % 8;
        let max_right = (parseInt(this.current_position / 8) + 1) * 8 - 1;
        let min_left = (parseInt(this.current_position / 8) + 1) * 8 - 8;

        const up_moves = this.getStraightMoves(board, DIRECTIONS.UP, this.current_position, max_up);
        const down_moves = this.getStraightMoves(board, DIRECTIONS.DOWN, min_down, this.current_position);
        const left_moves = this.getStraightMoves(board, DIRECTIONS.LEFT, min_left, this.current_position);
        const right_moves = this.getStraightMoves(board, DIRECTIONS.RIGHT, this.current_position, max_right);

        let moves = [...up_moves, ...down_moves, ...left_moves, ...right_moves];

        if(!this.being_visited)
            moves = moves.filter(pos => this.filterCheck(board, pos));

        return moves;
    }
    move(...args){
        super.move(...args);

        if(this.first_move){
            this.first_move = false;
        }
    }
}
