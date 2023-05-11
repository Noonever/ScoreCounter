from fastapi import FastAPI, APIRouter, HTTPException
from redis_interaction import create_scoreboard, update_scoreboard, get_counted_scoreboard, get_player_progress
from schemas import ScoreBoardData

app = FastAPI(title="ScoreCounterAPI")

@app.post("/createScoreboard/")
async def create(categories: list, players: list) -> dict:
    func_response = create_scoreboard(categories=categories, players=players)
    return {"code": func_response}


@app.put("/updateScoreboard/")
async def update(code: str, player: str, category: str, score: int) -> dict:
    result = update_scoreboard(code=code, player=player, category=category, score=score)
    if "updated" not in result:
        raise HTTPException(404, result)
    else:
        return {"msg": result}
    

@app.get("/playersProgress")
async def get_progress(code: str, player: str)->float:
    result = get_player_progress(code=code, player=player)
    if type(result) == str:
        raise HTTPException(404, result)
    else:
        return result
    

@app.get("/count", response_model=ScoreBoardData)
async def get_counted(code: str):
    result = get_counted_scoreboard(code=code)
    if type(result) == str:
        raise HTTPException(404, result)
    else:
        return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")