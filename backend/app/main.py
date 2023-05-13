from typing import Literal
from fastapi import FastAPI, APIRouter, HTTPException
from redis_interaction import *
from schemas import ScoreBoardData

app = FastAPI(title="ScoreCounterAPI")

@app.post("/createScoreboard/")
async def create(mode: Literal["screenDevice", "sameRights"], categories: list, players: list = []) -> dict[str, str]:
    result = create_scoreboard(mode=mode, categories=categories, players=players)
    return {"code": result}


@app.get("/scoreboardPlayers")
async def get_players(code: str)-> dict[str, list]:
    result = get_scoreboard_players(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"players": result}


@app.get("/playersProgress")
async def get_progress(code: str)-> dict[str, float]:
    result = get_players_progress(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return result


@app.get("/scoreboardCategories")
async def get_categories(code: str)-> dict[str, list]:
    result = get_scoreboard_categories(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"categories": result}


@app.get("/scoreboardStatus")
async def get_status(code: str)-> dict[str, str]:
    result = get_scoreboard_status(code=code)
    return {"msg": result}


@app.get("/scoreboardMode")
async def get_mode(code: str) -> dict[str, str]:
    result = get_scoreboard_mode(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"mode": result}


@app.put("/addPlayer")
async def add(code: str, player: str)-> dict[str, str]:
    result = add_player(code=code, player=player)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}


@app.post("/closeScoreboard")
async def close(code: str) -> dict[str, str]:
    result = close_scoreboard(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}


@app.put("/updateScoreboard/")
async def update(code: str, player: str, category: str, score: int)-> dict:
    result = update_scoreboard(code=code, player=player, category=category, score=score)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}
    

@app.get("/getCountedScoreboard", response_model=ScoreBoardData)
async def get_counted(code: str):
    result = get_counted_scoreboard(code=code)
    if type(result) == str:
        raise HTTPException(404, result)
    else:
        return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001, log_level="debug")