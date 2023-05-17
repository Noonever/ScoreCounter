import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PlayerAdd from "../components/PlayerAdd";
import { apiCloseScoreboard, apiGetCategories, apiGetPlayers, apiGetStatus } from "../utils/api";
import { getCurrentScoreboardCode, IsHost } from "../utils/storageFuncs"

export default function Scoreboard() {
    const {code} = useParams();
    const [isHost, setIsHost] = useState(code? IsHost(code): false)
    const [categories, setCategories] = useState()
    const [players, setPlayers] = useState<{[char: string]:string}>({})
    const [isOpened, setIsOpened] = useState(true)

    const playersItems = Object.entries(players).map(([player, color])=>
      <a className="ask-text" style={{color: color}}>{player}</a>
    )
    
    const navigate = useNavigate()

    useEffect(() => {
      const checkForAccess = setTimeout(async () => {
          const scoreboardStatus = code? (await apiGetStatus(code)): null
          const host = isHost
          const currentScoreboard = getCurrentScoreboardCode()
          console.log(scoreboardStatus)
          console.log(host)
          console.log(currentScoreboard)
          if (scoreboardStatus==="DoNotExist" && host===false && currentScoreboard!==code) {
            navigate("/")
          }
          
      }, 0);
    }, []);

    useEffect(() => {
      const interval = setInterval(async () => {
        const scoreboardStatus = code? (await apiGetStatus(code)): []
        if (scoreboardStatus==="Closed") {
          setIsOpened(false)
        }
      }, 500);
      return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const getCats = setTimeout(async () => {
            const categories = code? (await apiGetCategories(code)): []
            setCategories(categories)
        }, 0);
    }, []);


    useEffect(() => {
        if (isHost) {
        const interval = setInterval(async () => {
          const players = code? (await apiGetPlayers(code)): []
          setPlayers(players)
        }, 500);
        return () => clearInterval(interval);
      }}, []);


    const closeScoreboard = async(code: string | undefined) => {
      if (code) {
        await apiCloseScoreboard(code)
      }
    }

    if (isHost) {
    return (
        <>
        {isOpened?
        <>
        <p>{JSON.stringify(isOpened)}</p>
        <h1>Scoreboard {code}</h1>
        <a>current players:</a>
        <div>{playersItems}</div>
        <button onClick={async()=> await closeScoreboard(code)}>everybody is here!</button>
        </>:
        <></>}
        </>
    )
    }
    return (
        <>
        {isOpened?
        <PlayerAdd code={code? code: ""}/>
        : <a>score entering</a>}
        </>
    )   
}   