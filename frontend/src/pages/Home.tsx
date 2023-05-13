import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { setScoreboardMode } from "../utils/storageFuncs"

export default function Home() {

    const [menuPosition, setMenuPosition] = useState("welcome")
    const navigate = useNavigate()

    function selectScreenDeviceMode() {
        setScoreboardMode("screenDevice")
        navigate("/create/templates")
    }

    function selectSameRightsMode() {
        setScoreboardMode("sameRights")
        navigate('/create/templates')
    }

    const welcomeMenu = 
    <>
    <a className="welcome-text">Welcome to</a>
    <a className="welcome-text">score counter!</a>
    <div>
        <button onClick={()=>setMenuPosition("create")}>Create Scoreboard</button>
        <button onClick={()=>setMenuPosition("connect")}>Connect to Scoreboard</button>
    </div>
    </>
    const createMenu =
    <>
    <a className="ask-text">Choose mode:</a>
    <div>   
        <button onClick={selectScreenDeviceMode}>Use this device as a screen</button>
        <button onClick={selectSameRightsMode}>I am a player too</button>
        <button onClick={()=> setMenuPosition("welcome")}>back</button>
    </div>
    </>
    const connectMenu =
    <>
    <a className="ask-text">How would u like to connect?</a>
    <div>
        <button>Use code</button>
        <button>Use QR</button>
        <button onClick={()=> setMenuPosition("welcome")}>back</button>
    </div>
    </>
    return (
        <div className="column-container">
            {{
                "welcome": welcomeMenu,
                "create": createMenu,
                "connect": connectMenu,
            }[menuPosition]}
        </div>
    )
}