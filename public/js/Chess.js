class Chess{
    black;
    model;
    view;
    turn;

    sound_played;

    constructor(black = false){
        this.init(black);
    }

    init(black){
        this.black = black;

        this.model = new ChessModel();
        this.view = new ChessView({
            model: this.model,
            black: this.black,
            onPointerDown: this.onPointerDown.bind(this),
            onPointerUp: this.onPointerUp.bind(this),
            onPointerEnter: this.onPointerEnter.bind(this),
            onPointerLeave: this.onPointerLeave.bind(this),
            onPromotionPicked: this.onPromotionPicked.bind(this),
            onRematchClick: this.onRematchClick.bind(this)
        });

        this.turn = TEAM.WHITE;

        this.play("start");
        this.sound_played = false;
    }

    onDraw(reason){
        let element = document.getElementById("result");
        element.innerText = `Draw by ${reason}`
        this.play("stalemate")
    }

    onWin(turn){
        let player = turn === TEAM.WHITE? "White" : "Black";

        let element = document.getElementById("result");
        element.innerText = `${player} wins by checkmate`
        this.play("checkmate")
    }

    isTheirTurn(pos){
        if (this.model.chessboard[pos] === null) return false;
        return this.turn === this.model.chessboard[pos].owner;
    }

    onRematchClick(e){
        this.view.removeListeners();

        delete this.model;
        delete this.view;

        this.init(!this.black);

        this.view.gameend_popup.classList.add("hidden");
        let element = document.getElementById("result");
        element.innerText = "";
    }

    onPromotionPicked(e){
        let old_piece = this.model.chessboard[this.view.promotion]
        let new_piece = new PIECES[e.target.id](old_piece.owner, old_piece.current_position)
        
        this.model.chessboard[this.view.promotion] = new_piece;

        this.view.hidePromotionPopup(new_piece.owner);

        this.turn = -new_piece.owner

        if(this.endCondition()){
            this.turn = 0;
            this.view.gameend_popup.classList.remove("hidden");
        }
    }

    onPointerDown(e){
        let id = parseInt(e.target.id);
        if(!this.model.chessboard[id]) return;
        if(!this.isTheirTurn(id)) return;
        this.view.src = id;
        this.view.chessboard.children.item(this.view.src).classList.add("grey");
        // segnala mosse valide
        this.model.chessboard[this.view.src].getValidMoves(this.model.chessboard)
            .map( i => this.view.chessboard.children.item(i).classList.add("valid"))
    }

    onPointerEnter(e){
        if(!this.view.src) return;
        if(this.view.src == e.target.id) return;

        this.view.chessboard.children.item(e.target.id).classList.add("hover");
    }

    onPointerLeave(e){
        if(!this.view.src) return;

        this.view.chessboard.children.item(e.target.id).classList.remove("hover");
    }

    onPointerUp(e){
        let dst = parseInt(e.target.id);

        if(this.view.src === null) return

        // rimuovi mosse valide
        this.model.chessboard[this.view.src].getValidMoves(this.model.chessboard)
            .map( i => this.view.chessboard.children.item(i).classList.remove("valid"))

        this.move(this.view.src, dst);
        this.view.chessboard.children.item(this.view.src).classList.remove("grey");
        this.view.chessboard.children.item(dst).classList.remove("hover");
        this.view.src = null;

        
    }

    play(effect){
        var audio = new Audio(`sounds/${effect}.wav`);
        audio.play();
        this.sound_played = true;
    }

    move(src, dst){
        if(src == dst) return;

        this.model.move(src, dst);

        if(this.model.isCheck(this.turn)){
            this.play("check");
        }

        if(this.model.captured_piece) {
            if(!this.sound_played){
                this.play("capture");
            }
            this.view.capture(this.model.captured_piece);
            this.model.captured_piece = null;
        }
        
        if(this.model.moved) {
            this.model.moved = false;
            this.view.move(src, dst);

            if(this.model.promoted){
                this.view.displayPromotionPopup(this.model.promoted.current_position, this.model.promoted.owner);
                this.model.promoted = null;

                this.turn = 0;
            }

            if(this.model.en_passant){
                this.model.chessboard[this.model.en_passant.current_position] = null;
                this.view.remove(this.model.en_passant.current_position);

                this.model.en_passant = null;
            }
            if(this.model.castle){
                this.play("castle");
                this.view.move(this.model.castle.rook.current_position, this.model.castle.castle)
                this.model.castle.rook.move(this.model.chessboard, this.model.castle.castle);

                this.model.castle = null;
            }
            
            if(this.endCondition()){
                this.turn = 0;
                this.view.gameend_popup.classList.remove("hidden");
                return;
            }

            if(!this.sound_played){
                this.play("move");
            }
            this.sound_played = false;

            this.turn *= -1;
        }
    }

    endCondition(){
        // check checkmate
        if(this.model.isCheckMate(this.turn)){
            this.onWin(this.turn);
            return true;
        }

        // check stall
        if(this.model.isStall(this.turn)){
            this.onDraw("stall");
            return true;
        }

        if(this.model.insufficientMaterial()){
            this.onDraw("insufficient material");
            return true;
        }

        return false;
    }

    toString(){
        return this.model.toString();
    }
}