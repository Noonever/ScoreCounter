import "./ClickableItem.css"

type ClickableItemProps = {
    itemName: string,
    onButtonClickAction: Function,
    onDivClickAction: Function | null,
    textColor: string | null
}

export default function ClickableItem({itemName, onButtonClickAction, onDivClickAction, textColor}: ClickableItemProps) {
    return (
        <div className="clickable-container">
            <div className="clickable" onClick={()=>onDivClickAction? onDivClickAction(): null}></div>
            <a style={{color: textColor? textColor: "#000000"}} className="clickable-text">{itemName}</a>
            <button className="remove" onClick={()=> onButtonClickAction? onButtonClickAction(): null}>x</button>
        </div>
    )
}