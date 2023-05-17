import { useState, useEffect } from "react";
import { Circle } from "@uiw/react-color";
import { apiAddPlayer } from "../utils/api";

const defaultFormData = {
    body: ""
}

type PlayerAddProps = {
    code: string
}

export default function PlayerAdd({code}: PlayerAddProps) {

    const [formData, setFormdata] = useState(defaultFormData);
    const { body } = formData;
    const [currentColor, setCurrentColor] = useState("#000000")
    const [joined, setJoined] = useState(false)
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const player = formData["body"]
        if (player) {
            setFormdata(defaultFormData)
            apiAddPlayer(code, player, currentColor.replace("#", "%23"))
            setJoined(!joined)
        }
    }   

    return (
        <div className="column-container">
            {!joined?
            <form onSubmit={(e)=>onSubmit(e)}>
                <a className="ask-text">Enter name:</a>
                <input style={{color: currentColor}} type="text" id="body" value={body} onChange={(e)=>onChange(e)}></input>
                <button type="submit">join</button>

                <Circle 
                colors={["#000000","#FF0000"]}
                color={currentColor}
                onChange={(color)=>{setCurrentColor(color.hex)}}
                />
            </form>
            : <a>Waiting for players!</a>}
        </div>
    )
}