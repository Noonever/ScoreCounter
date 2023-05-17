import axios from "axios";

const api = axios.create({
    baseURL: "http://172.22.22.149:8001/api/",
    timeout: 500,
  });

async function createScoreboard(scoreboardMode: string, categories: string[], players?: string[]) {
    try {
    const response = await api.post("createScoreboard", {
        "mode": scoreboardMode,
        "categories": categories,
        "players": players
      })
    return response.data["code"]
    } catch {

    }
}

async function apiGetCategories(code: string) {
    try {
    const response = await api.get(`scoreboardCategories?code=${code}`)
    return response.data["categories"]
    } catch {
        
    }
}

async function apiGetPlayers(code: string) {
    try {
    const response = await api.get(`scoreboardPlayers?code=${code}`)
    return response.data
    } catch {
        
    }
}

async function apiGetStatus(code: string) {
    try {
    const response = await api.get(`scoreboardStatus?code=${code}`)
    return response.data["msg"]
    } catch {
        
    }
}

async function apiAddPlayer(code: string, player: string, color: string) {
    try {
    await api.put(`addPlayer?code=${code}&player=${player}&color=${color}`)
    } catch {
        
    }
}


async function apiCloseScoreboard(code: string) {
    try {
    await api.post(`closeScoreboard?code=${code}`)
    } catch {
        
    }
}

export {
    createScoreboard,
    apiGetCategories, 
    apiGetPlayers, 
    apiGetStatus, 
    apiAddPlayer,
    apiCloseScoreboard,
}