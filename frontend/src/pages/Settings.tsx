import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionCategories, getOnlineMode, setCurrentScoreboardCode, addHosted } from "../utils/storageFuncs";
import { createScoreboard } from "../utils/api";

export default function Settings() {

    const [categories, setCategories] = useState(getSessionCategories())
    const [mode, setMode] = useState(getOnlineMode())

    const navigate = useNavigate()


    const categoriesItems = categories.map((category)=>
        <a key={category} className="ask-text-mini">{category}</a>
    )

    const onCreateClick = async () => {
        const code = await createScoreboard(mode? mode: "sameRights", categories)  
        addHosted(code)
        setCurrentScoreboardCode(code)
        navigate(`/scoreboard/${code}`)
    }

    return (
        <div className="column-container">
        <a className="ask-text-mini">Current categories:</a>
        {categoriesItems}
        {(mode==="screenDevice")? <a>Score will be displayed on this screen</a>: <a>Score will be displayed on every device</a>}
        <div>
        <button onClick={()=>onCreateClick()}>Create scoreboard</button>
        <button onClick={()=>{navigate("/")}}>cancel</button>
        </div>
        </div>
    )
}