from typing import Literal, Optional
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_interaction import *
from schemas import ScoreBoardData

app = FastAPI(title="ScoreCounterAPI")
router = APIRouter(prefix="/api")

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost",
    "http://172.22.22.149:3000",
    "http://172.22.22.149:8080",
    "http://172.22.22.149"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Scoreboard(BaseModel):
    mode: str
    categories: list[str]
    players: Optional[dict[str, str]]


@router.post("/createScoreboard/")
async def create(scoreboard: Scoreboard) -> dict[str, str]:
    result = create_scoreboard(
        mode=scoreboard.mode,
        categories=scoreboard.categories,
        players=scoreboard.players if scoreboard.players else {}
    )
    return {"code": result}

    
@router.get("/scoreboardPlayers")
async def get_players(code: str)-> dict[str, str]:
    result = get_scoreboard_players(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:   
        return result


@router.get("/playersProgress")
async def get_progress(code: str)-> dict[str, float]:
    result = get_players_progress(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return result


@router.get("/scoreboardCategories")
async def get_categories(code: str)-> dict[str, list]:
    result = get_scoreboard_categories(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"categories": result}


@router.get("/scoreboardStatus")
async def get_status(code: str)-> dict[str, str]:
    result = get_scoreboard_status(code=code)
    return {"msg": result}


@router.get("/scoreboardMode")
async def get_mode(code: str) -> dict[str, str]:
    result = get_scoreboard_mode(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"mode": result}


@router.put("/addPlayer")
async def add(code: str, player: str, color: str)-> dict[str, str]:
    result = add_player(code=code, player=player, color=color)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}


@router.post("/closeScoreboard")
async def close(code: str) -> dict[str, str]:
    result = close_scoreboard(code=code)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}


@router.put("/updateScoreboard/")
async def update(code: str, player: str, category: str, score: int)-> dict:
    result = update_scoreboard(code=code, player=player, category=category, score=score)
    if "ERR:" in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}
    

@router.get("/getCountedScoreboard", response_model=ScoreBoardData)
async def get_counted(code: str):
    result = get_counted_scoreboard(code=code)
    if type(result) == str:
        raise HTTPException(404, result)
    else:
        return result

app.include_router(router=router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="172.22.22.149", port=8001, log_level="debug")