from pydantic import BaseModel

class ScoreBoardData(BaseModel):
    scoreboard: dict
    max_score_in_categories: dict
    categories_leaders: dict