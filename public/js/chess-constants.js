const PIECE_ROW = Object.freeze([Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]);
const ROW_INDEXES = Object.freeze(["1", "2", "3", "4", "5", "6", "7", "8"]);
const COL_INDEXES = Object.freeze(["A", "B", "C", "D", "E", "F", "G", "H"]);
const TEAM = Object.freeze({ WHITE: 1, BLACK: -1})

const DIRECTIONS = Object.freeze({   
    UP_LEFT: 0,     UP: 1,      UP_RIGHT:2,
    LEFT: 3,                    RIGHT: 4,
    DOWN_LEFT: 5,   DOWN: 6,    DOWN_RIGHT: 7,
})

const MOVES = Object.freeze([7, 8, 9, -1, 1, -9, -8, -7]);

const PIECES = Object.freeze({
    "Rook": Rook, 
    "Knight": Knight, 
    "Bishop": Bishop, 
    "Queen": Queen, 
    "King": King, 
    "Pawn": Pawn
});