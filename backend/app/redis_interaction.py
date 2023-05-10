from loguru import logger
from redis import Redis
from random import choices
from string import ascii_uppercase
from schemas import ScoreBoardData

def generate_random_code(lenght: int = 6) -> str:
    return "".join(choices(ascii_uppercase, k=lenght))

example = {
    "player1": {"cat1": 0, "cat2": 0, "cat3": 0},
    "player2": {"cat1": 0, "cat2": 0, "cat3": 0},
}

redis = Redis(host='localhost', port=6379)


def __get_redis_keys() -> list[str]:
    return [value.decode() for value in redis.keys("*")]


def __scoreboard_exists(code: str) -> bool:
    for key in __get_redis_keys():
        if f"scoreboards:{code}" in key:
            return True
    return False


def create_scoreboard(categories: list, players: list) -> str:

    code = generate_random_code()
    while __scoreboard_exists(code=code):
        code = generate_random_code()
        continue

    mapped_categories = {category: "none" for category in categories}
    mapped_categories.update({"total": "none"})

    for player in players:
        redis.hset(f"scoreboards:{code}:{player}", mapping=mapped_categories)

    logger.info(f"Scoreboard {code} created with players {players}, categories {categories}.")
    return code


def update_scoreboard(code: str, player: str, category: str, score: int) -> str:

    if not __scoreboard_exists(code=code):
        error = f"Cannot update {player}'s score in scoreboard {code} (Scoreboard doesn't exist)!"
        logger.error(error)  # ERR
        return error

    players = [player.replace(f"scoreboards:{code}:", "") for player in __get_redis_keys() if f"scoreboards:{code}" in player]

    if player not in players:
        error = f"Cannot update {player}'s score in scoreboard {code} (Player doesn't exist)!"
        logger.error(error)
        return error

    categories = [key.decode() for key in redis.hgetall(f"scoreboards:{code}:{player}").keys()]
    if category not in categories:
        error = f"Cannot update {player}'s score in scoreboard {code} (Category {category} doesn't exist)!"
        logger.error(error)  # ERR
        return error
    else:
        redis.hset(f"scoreboards:{code}:{player}", category, score)
        succes = f"Scoreboard {code} updated. {player}'s score in {category} is {score} now."
        logger.info(succes)
        return(succes)


def get_player_progress(code: str, player: str) -> float | str:

    if not __scoreboard_exists(code=code):
        error = f"Cannot get {player}'s progress in scoreboard {code} (Scoreboard doesn't exist)."
        logger.error(error)  # ERR
        return error

    player_score = {key.decode() : value.decode() for key, value in redis.hgetall(f"scoreboards:{code}:{player}").items()}
    if player_score:
        unfilled_lenght = list(player_score.values()).count("none") - 1
        full_lenght = len(player_score) - 1
        return (full_lenght - unfilled_lenght )/ full_lenght
    else:
        error = f"Cannot get {player}'s progress in scoreboard {code} (Player doesn't exist)."
        logger.error(error)
        return error


def get_counted_scoreboard(code: str):

    if not __scoreboard_exists(code=code):
        error = f"Cannot count scoreboard {code} (Scoreboard doesn't exist)."
        logger.error(error)
        return error

    scoreboard_players = [player.replace(f"scoreboards:{code}:", "") for player in __get_redis_keys() if f"scoreboards:{code}" in player]
    categories = [key.decode() for key in redis.hgetall(f"scoreboards:{code}:{scoreboard_players[0]}").keys()]
    max_in_category = {category: 0 for category in categories}
    category_leaders = {category: set() for category in categories}
    final_scoreboard = {}
    for player in scoreboard_players:
        player_score_uncounted = {key.decode() : value.decode() for key, value in redis.hgetall(f"scoreboards:{code}:{player}").items()}
        player_score_no_total = player_score_uncounted
        player_score_no_total.pop("total")
        if "none" in player_score_no_total.values():
            error = f"Score of player {player} is unfilled (scoreboard {code})!"
            logger.error(error)
            return error
        
        total_score = sum([int(value) for key, value in player_score_uncounted.items() if key != "total"])
        player_score_counted = player_score_uncounted
        player_score_counted["total"] = str(total_score)

        for category, score in player_score_counted.items():
            if int(score) > max_in_category[category]:
                max_in_category[category] = int(score)
                category_leaders[category] = {player, }
            if int(score) == max_in_category[category]:
                category_leaders[category].add(player)

        final_scoreboard[player] = player_score_counted

    return ScoreBoardData(
        scoreboard=final_scoreboard,
        max_score_in_categories=max_in_category,
        categories_leaders=category_leaders
    )
