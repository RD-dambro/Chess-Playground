
class ChessView{
    black;
    model;
    onPointerDown;
    onPointerUp;
    onPointerEnter;
    onPointerLeave;
    onPromotionPicked;
    onRematchClick;

    chessboard;
    promotion_popup;
    gameend_popup;
    rematch_button;

    src = null;

    constructor({model, black, onPointerDown, onPointerUp, onPointerEnter, onPointerLeave, onPromotionPicked, onRematchClick}){
        this.model = model;
        this.black = black;
        this.onPointerDown = onPointerDown;
        this.onPointerUp = onPointerUp;
        this.onPointerEnter = onPointerEnter;
        this.onPointerLeave = onPointerLeave;
        this.onPromotionPicked = onPromotionPicked;
        this.onRematchClick = onRematchClick;


        this.chessboard = document.getElementById("chessboard");
        this.promotion_popup = document.getElementById("promotion-popup");
        this.gameend_popup = document.getElementById("gameend-popup");
        this.rematch_button = document.getElementById("rematch");

        this.gameend_popup.addEventListener("click", this.onRematchClick);

        for(let c of this.promotion_popup.getElementsByClassName("option")){
            c.removeEventListener("click", this.onPromotionPicked)
            c.addEventListener("click", this.onPromotionPicked)
        }
        
        if(!this.black)
            this.chessboard.classList.add("rotate");
        else
            this.chessboard.classList.remove("rotate");
        
        this.chessboard.textContent = "";
        for(let pos in this.model.chessboard){
            let cell = this.initCell(pos);
            this.chessboard.appendChild(cell);
        }

        delete this.constructor;
    }

    removeListeners(){
        for(let c of this.promotion_popup.getElementsByClassName("option")){
            c.removeEventListener("click", this.onPromotionPicked)
        }

        this.gameend_popup.removeEventListener("click", this.onRematchClick);
    }

    displayPromotionPopup(position, owner){
        this.promotion = position;
        this.promotion_popup.classList.remove("hidden");

        for(let c of this.promotion_popup.getElementsByClassName("option")){
            let light_or_dark = owner === 1? "light" : "dark";
            
            let className = `${light_or_dark}-${c.id}`.toLowerCase();
            
            c.classList.add("piece", className);
        }
    }

    hidePromotionPopup(owner){
        for(let c of this.promotion_popup.getElementsByClassName("option")){
            let light_or_dark = owner === 1? "light" : "dark";
            
            let className = `${light_or_dark}-${c.id}`.toLowerCase();
            
            c.classList.remove("piece", className);
        }

        this.promotion_popup.classList.add("hidden");

        this.chessboard.childNodes.item(this.promotion)
            .replaceWith(this.initCell(this.promotion))

        this.promotion = null;
    }

    createEmptySpan(){
        let span = document.createElement("span");
        span.classList.add("nopointer")
        return span
    }

    remove(position){
        let cell = document.getElementById(position);

        cell.removeChild(cell.firstChild)
        cell.appendChild(this.createEmptySpan());
    }

    move(src, dst){
        let src_cell = document.getElementById(src);
        let dst_cell = document.getElementById(dst);

        dst_cell.removeChild(dst_cell.firstChild);
        dst_cell.appendChild(src_cell.firstChild);
        src_cell.appendChild(this.createEmptySpan());
    }

    capture(){}

    initCell(pos){
        let col = ChessModel.getCol(pos);
        let row = ChessModel.getRow(pos);
        let cell = document.createElement("div");
        cell.id = pos;

        cell.appendChild(this.createEmptySpan());

        let piece = this.model.chessboard[pos]
        if(piece){
            let light_or_dark = piece.owner === 1? "light" : "dark";
            
            let className = `${light_or_dark}-${piece.toString()}`.toLowerCase()
            cell.firstChild.classList.add("piece", className);
        }
        
        let even_col = col % 2 == 0;
        let even_row = row % 2 == 0;
        let black_or_white = even_col != even_row ? "black" : "white"
        
        cell.classList.add("cell", black_or_white);
        if(!this.black) cell.classList.add("rotate");
        
        cell.addEventListener("pointerdown", this.onPointerDown);
        cell.addEventListener("pointerup", this.onPointerUp);
        cell.addEventListener("pointerenter", this.onPointerEnter);
        cell.addEventListener("pointerleave", this.onPointerLeave);

        return cell;
    }
}