

class Piece{
    owner;
    current_position;
    being_visited;
    first_move;

    constructor(owner, pos, being_visited = false, first_move = true){
        this.owner = owner;
        this.current_position = pos;
        this.being_visited = being_visited;
        this.first_move = first_move;
    }

    static isCheck(board, attacker, defender){

        let king;

        // console.log(board)
        for(let p of board){
            if(p === undefined){
                debugger;
            }
            if(p === null) continue;
            if(p.owner === attacker) continue;

            if(p.isKing()){
                king = p;
            }
        }

        if(!king) return false;

        for(let p of board){
            if(p === undefined){
                debugger;
            }
            if(p === null) continue;
            if(p.owner === defender) continue;

            p.being_visited = true;

            if(p.getValidTakes(board).includes(king.current_position)){
                p.being_visited = false;
                return true;
            }
            p.being_visited = false;
        }

        return false;
    }

    filterCheck(board, pos){
        let deepCopy = board.map(p => p ? p.clone() : null);

        deepCopy[this.current_position].current_position = pos;
        deepCopy[pos] = deepCopy[this.current_position];
        deepCopy[this.current_position] = null;
        
        return !Piece.isCheck(deepCopy, -this.owner, this.owner);
    }

    clone(){
        let MyPiece = PIECES[this.toString()];
        return new MyPiece(this.owner, this.current_position, this.being_visited, this.first_move);
    }

    isKing(){
        return this.toString() == "King";
    }

    getValidMoves(board){}

    getValidTakes(board){
        return this.getValidMoves(board).filter(p => !this.isEmpty(board, p))
    }

    opponentCanTake(board, pos){
        let deepCopy = board.map(p => p ? p.clone() : null);

        deepCopy[this.current_position].current_position = pos;
        deepCopy[pos] = deepCopy[this.current_position];
        deepCopy[this.current_position] = null;

        for(let p of deepCopy){
            if(p === undefined){
                debugger;
            }
            if(p === null) continue;
            if(p.owner === this.owner) continue;
            
            p.being_visited = true;

            let valid_takes = p.getValidTakes(deepCopy);
            if(valid_takes.includes(pos)) {
                p.being_visited = false;
                return true;
            }

            p.being_visited = false;
        }

        return false;
    }

    isNotFriendly(board, pos){
        if(board[pos] === null) return true;

        return board[pos].owner != this.owner;
    }

    isInBoard(board, pos){
        return pos in board;
    }

    isEmpty(board, pos){
        return board[pos] === null;
    }

    getStraightMoves(board, direction, min, max){
        let pos = this.current_position + MOVES[direction];
        let moves = [];

        while(min <= pos && pos <= max){
            if(!this.isInBoard(board, pos)) break;
            if(this.isEmpty(board, pos)){
                moves.push(pos);
            }
            else{
                if(this.isNotFriendly(board, pos)){
                    moves.push(pos);
                }
                break;
            }

            pos += MOVES[direction];
        }

        return moves;
    }

    move(board, target_position){
        board[this.current_position] = null;

        this.current_position = target_position;

        board[target_position] = this; 
    }

    toString(){
        return `${this.constructor.name}`;
    }
}
