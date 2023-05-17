import { json } from "stream/consumers"

type Templates = {[char: string]: string[]}
type Categories = string[]
type ScoreboardMode = string


function setOnlineMode(mode: ScoreboardMode): void {
    sessionStorage.setItem("onlineMode", mode)
}

function getOnlineMode(): ScoreboardMode | null {
    let mode = sessionStorage.getItem("onlineMode")
    return mode    
}

function setScoreboardMode(mode: ScoreboardMode): void {
    sessionStorage.setItem("scoreboardMode", mode)
}

function getScoreboardMode(): ScoreboardMode | null {
    const mode = sessionStorage.getItem("scoreboardMode")
    return mode
} 

function setSessionCategories(categories: Categories): void {
    sessionStorage.setItem("categories", JSON.stringify(categories))
}

function setLocalTemplates(templates: Templates): void {
    localStorage.setItem("templates", JSON.stringify(templates))
}

function getSessionCategories(): Categories {
    const strCategories = sessionStorage.getItem("categories")
    return strCategories? JSON.parse(strCategories): []
}

function getLocalTemplates(): Templates {
    const strTemplates = localStorage.getItem("templates")
    return strTemplates? JSON.parse(strTemplates): {}
}

//return categories of a template by its key
function getTemplateCategories(templateKey: string): Categories {
    const templates = getLocalTemplates()
    const template = templates[templateKey]
    return template
}


//code of scoreboaard, user in now
function setCurrentScoreboardCode(code: string){
    localStorage.setItem("currentCode", code)
}

function getCurrentScoreboardCode() {
    const code = localStorage.getItem("currentCode")
    return code
}

function IsHost(code: string) {
    const hostedStr = localStorage.getItem("hosted")
    let hosted: string[] = hostedStr? JSON.parse(hostedStr): []
    return hosted.includes(code)
}

function addHosted(code: string) {
    if (!IsHost(code)) {
        const hostedStr = localStorage.getItem("hosted")
        let hosted: string[] = hostedStr? JSON.parse(hostedStr): []
        hosted.push(code)
        localStorage.setItem("hosted", JSON.stringify(hosted))
    }
}


function setCurrentPlayer(player: {[char: string]: string}) {
    localStorage.setItem("currentPlayer", JSON.stringify(player))
}

function getCurrentPlayer() {
    const strPlayer = localStorage.getItem("currentPlayer")
    const player: {[char: string]: string} = strPlayer? JSON.parse(strPlayer): {}
    return player
}


export {
    setOnlineMode,
    getOnlineMode,
    setSessionCategories,
    setLocalTemplates,
    getSessionCategories,
    getLocalTemplates,
    getTemplateCategories,
    setCurrentScoreboardCode,
    getCurrentScoreboardCode,
    addHosted,
    IsHost,
    setCurrentPlayer,
    getCurrentPlayer,
}