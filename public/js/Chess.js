class Chess{
    black;
    model;
    view;
    turn;

    sound_played;
    moving_piece;

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
            onPointerMove: this.onPointerMove.bind(this),
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

    setValidMoves(pos){
        this.view.src = pos;

        this.view.chessboard.children.item(this.view.src).classList.add("grey");
        // segnala mosse valide
        this.model.chessboard[this.view.src].getValidMoves(this.model.chessboard)
            .map( i => this.view.chessboard.children.item(i).classList.add("valid"));
    }

    unsetValidMoves(pos){
        if(this.view.src === null) return;
        // rimuovi mosse valide
        this.model.chessboard[this.view.src].getValidMoves(this.model.chessboard)
        .map( i => this.view.chessboard.children.item(i).classList.remove("valid"))

        this.view.chessboard.children.item(this.view.src).classList.remove("grey");
        this.view.chessboard.children.item(pos).classList.remove("hover");
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

        if(!this.sound_played && this.model.isCheck(new_piece.owner)){
            this.play("check");
            this.sound_played = false;
        }
    }

    onPointerDown(e){
        if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }

        let id = parseInt(e.target.id);

        if(!this.moving_piece){
            if(!this.model.chessboard[id]) return;
            if(!this.isTheirTurn(id)) return;
            this.moving_piece = true;

            this.setValidMoves(id);
        }
        else{
            
            this.unsetValidMoves(id);

            if(id === this.view.src){
                this.view.src = null;
                this.moving_piece = false;
            }
        }
    }

    onPointerMove(e){
        // if(this.moving_piece){
        //     let el = this.view.chessboard.childNodes.item(this.view.src).firstChild;
        //     // el.style.position = "absolute";
        //     let [currY] = el.style.marginTop.split("px");
        //     let [currX] = el.style.marginLeft.split("px");

        //     currY = parseInt(currY) ? parseInt(currY) : 0;
        //     currX = parseInt(currX) ? parseInt(currX) : 0;

        //     el.style.marginTop = `${currY + e.movementY}px`;
        //     el.style.marginLeft = `${currX + e.movementX}px`;
        //     el.style.zIndex = 100;

        // }
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

        if(this.view.src !== dst){
            this.unsetValidMoves(dst);
            this.move(this.view.src, dst);
            this.view.src = null;
            this.moving_piece = false;
        }
        
        // if(this.released){

            

        //     this.released = false;
        // }
        // else {
        //     if(this.view.src !== dst){
        //         this.unsetValidMoves(dst);
        //         this.move(this.view.src, dst);
        //         this.view.src = null;
        //         this.moving_piece = false;            
        //     }

        //     this.released = true;
        // }

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