import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getCurrentScoreboardCode, setCurrentPlayer, setCurrentScoreboardCode, setOnlineMode } from "../utils/storageFuncs"

import { apiGetStatus } from "../utils/api"


const defaultFormData = {
    body: ""
}

export default function Home() {

    const [menuPosition, setMenuPosition] = useState("welcome")
    const navigate = useNavigate()
    const [formData, setFormdata] = useState(defaultFormData);
    const [modal, setModal] = useState(false)
    const [joinMessage, setJoinMessage] = useState("")


    function selectScreenDeviceMode() {
        setOnlineMode("screenDevice")
        navigate("/create/templates")
    }

    function selectSameRightsMode() {
        setOnlineMode("sameRights")
        navigate('/create/templates')
    }

    function toggleModal() {
        setJoinMessage("")
        setModal(!modal)
    }

    const handleJoinAttempt = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const code = formData["body"]
        const scoreboardStatus = (await apiGetStatus(code))
        if (scoreboardStatus==="Closed") {
            if(getCurrentScoreboardCode()!==code) {
                setJoinMessage("Scoreboard is closed!")
            } else {
                navigate(`/scoreboard/${code}`)
            }
        } else if (scoreboardStatus==="DoNotExist") {
            setJoinMessage("Scoreboard doesn't exist!")
        } else {
            setCurrentScoreboardCode(code)
            navigate(`/scoreboard/${code}`)
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const modalWindow = 
    <div className="modal">
        <div className="overlay" onClick={toggleModal}></div>
        <div className="modal-content">
            <h3>Enter code:</h3>
            <a>{joinMessage}</a>
            <form onSubmit={handleJoinAttempt}>
                <input onChange={onChange} id="body"/>
                <div>
                    <button type="submit">connect</button>
                    <button type="button" onClick={toggleModal}>cancel</button>
                </div>
            </form>
        </div>
    </div>


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
        <button onClick={()=>toggleModal()}>Use code</button>
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
            {modal? modalWindow: <></>}
        </div>
    )
}