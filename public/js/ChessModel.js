class ChessModel{
    chessboard;

    moved
    captured_piece
    castle
    en_passant
    promoted

    constructor(){
        this.chessboard = new Array(64).fill(null);

        for(let i = 0; i < PIECE_ROW.length; i++){
            let MyPiece = PIECE_ROW[i];
            let wid = i;
            let bid = this.chessboard.length - i - 1;
            
            this.chessboard[wid] = new MyPiece(TEAM.WHITE, wid);
            this.chessboard[wid + 8] = new Pawn(TEAM.WHITE, wid + 8);
            this.chessboard[bid] = new MyPiece(TEAM.BLACK, bid);
            this.chessboard[bid - 8] = new Pawn(TEAM.BLACK, bid - 8);
        }
    }

    insufficientMaterial(){
        let condition_0 = [["King"], ["King", "Knight"], ["Bishop", "King"]];
        let condition_1 = ["King", "King", "Knight", "Knight"];

        let w_pieces = [];
        let b_pieces = [];

        for(let p of this.chessboard){
            if(p && p.owner === TEAM.BLACK){
                b_pieces.push(p.toString());
            }
            if(p && p.owner === TEAM.WHITE){
                w_pieces.push(p.toString())
            }
        }

        w_pieces.sort();
        b_pieces.sort();

        const compareArrays = (a, b) =>
            a.length === b.length &&
            a.every((element, index) => element === b[index]);

        const meetsConditions = (array) => {
            return condition_0.reduce((acc, value) => acc || compareArrays(array, value), false);
        }
        // check condition_0
        if(meetsConditions(w_pieces) && meetsConditions(b_pieces))
            return true;
        
        // check condition_1
        if(compareArrays([...w_pieces, ...b_pieces].sort(), condition_1))
            return true;

        return false;
    }

    isCheck(turn){
        return Piece.isCheck(this.chessboard, turn, -turn);
    }

    isStall(turn){
        for(let p of this.chessboard){
            if(p === null) continue;
            if(p.owner === turn) continue;
            
            if(p.getValidMoves(this.chessboard).length > 0)
                return false;
        }
        return true;
    }

    isCheckMate(turn){
        return this.isCheck(turn) && this.isStall(turn);
    }

    static getCol(pos){
        return pos % 8;
    }

    static getRow(pos){
        return parseInt(pos / 8);
    }

    static getCanonicalPosition(pos){
        let col = ChessModel.getCol(pos);
        let row = ChessModel.getRow(pos);

        return `${COL_INDEXES[col]}${ROW_INDEXES[row]}`;
    }

    isPromotion(piece, dst){
        return piece && piece.toString() === "Pawn" && (ChessModel.getRow(dst) === 0 || ChessModel.getRow(dst) === 7)
    }

    move(src, dst){
        let piece = this.chessboard[src];
        
        if(!(piece && piece.getValidMoves(this.chessboard).includes(dst))) {
            this.moved = false;
            this.captured_piece = null;

            return;
        }

        this.captured_piece = this.chessboard[dst]

        if(piece.castle_moves){
            for(let move of piece.castle_moves){
                if(move.move === dst){
                    this.castle = move;
                }
            }
        }

        if(this.en_passant){
            this.en_passant = null;

            
        }

        if(piece.en_passant){
            let en_passant_move = piece.en_passant.current_position + piece.owner*MOVES[DIRECTIONS.UP]
            if(en_passant_move === dst){
                this.en_passant = piece.en_passant;
                this.captured_piece = this.en_passant;
            }
        }

        for(let p of this.chessboard){
            if(p && p.en_passant) 
                p.en_passant = null;
        }

        if(this.isPromotion(piece, dst))
        {
            this.promoted = piece;
        }

        piece.move(this.chessboard, dst);

        this.moved = true;
    }

    getPieceName(pos){
        let p = this.chessboard[pos];
        return p? p.toString() : "";
    }

    toString(){
        let str = "";
        for(let pos in this.chessboard){
            str += ChessModel.getCanonicalPosition(pos)+": "+this.getPieceName(pos)+"\n";
        }

        return str;
    }
}