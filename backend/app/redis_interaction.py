from loguru import logger
from redis import Redis
from random import choices
from string import ascii_uppercase
from schemas import ScoreBoardData

def generate_random_code(lenght: int = 2) -> str:
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


def __check_for_scoreboard_existance(error_message):
    def _check_for_scoreboard_existance(func):
        def wrapper(*args, **kwargs):
            code = {**kwargs}["code"]
            if __scoreboard_exists(code):
                return func(*args, **kwargs)
            else:
                final_error_message = error_message + f"(Scoreboard {code} doesn't exist)!"
                logger.error(final_error_message)
                return final_error_message
        return wrapper
    return _check_for_scoreboard_existance


@__check_for_scoreboard_existance(error_message=f"ERR: Cannot get categories")
def get_scoreboard_categories(code: str) -> list[str]:
    categories = [key.decode() for key in redis.hgetall(f"scoreboards:{code}:categories").keys()]
    return categories


@__check_for_scoreboard_existance(error_message="ERR: Cannot get players")
def get_scoreboard_players(code: str) -> dict[str, str]:
    
    final = {}
    for key in __get_redis_keys():
        if f"scoreboards:{code}" in key and "categories" not in key and "open" not in key and "mode" not in key and "color" not in key:
            player = key.replace(f"scoreboards:{code}:", "")
            color = redis.get(f"scoreboards:{code}:{player}:color").decode()
            final[player] = color
    return final


def __check_for_player_existance(error_message): 
    def _check_for_player_existance(func):
        def wrapper(*args, **kwargs):
            player = {**kwargs}["player"]
            code = {**kwargs}["code"]
            if player in get_scoreboard_players(code=code):
                return func(*args, **kwargs)
            else:
                final_error_message = error_message + f"(Player {player} doesn't exist!)"
                logger.error(final_error_message)
                return final_error_message
        return wrapper
    return _check_for_player_existance


def create_scoreboard(mode: str, categories: list, players: dict[str, str] = {}) -> str:
    code = generate_random_code()
    while __scoreboard_exists(code=code):
        code = generate_random_code()
        continue

    mapped_categories = {category: "none" for category in categories}
    mapped_categories.update({"total": "none"})

    if players:
        for player in players.keys():
            redis.hset(f"scoreboards:{code}:{player}", mapping=mapped_categories)

        for color in players.values():
            redis.set(f"scoreboards:{code}:{player}:color", color)

    redis.hset(f"scoreboards:{code}:categories", mapping=mapped_categories)
    redis.set(f"scoreboards:{code}:open", "Closed" if players else "Opened")
    redis.set(f"scoreboard:{code}:mode", mode)

    players_message = f", players {players}" if players else ""
    logger.info(f"Scoreboard {code} created with categories {categories}{players_message}.")

    return code


@__check_for_scoreboard_existance(error_message="ERR: Cannot get mode")
def get_scoreboard_mode(code: str) -> str:
    mode = redis.get(f"scoreboard:{code}:mode").decode()
    return mode


def get_scoreboard_status(code: str) -> str:
    if not __scoreboard_exists(code=code):
        return "DoNotExist"
    status = redis.get(f"scoreboards:{code}:open").decode()
    return status


@__check_for_scoreboard_existance(error_message="ERR: Cannot close scoreboard")
def close_scoreboard(code: str) -> str:
    redis.set(f"scoreboards:{code}:open", "Closed")
    return f"Scoreboard {code} closed."


@__check_for_scoreboard_existance(error_message="ERR: Cannot add player")
def add_player(code: str, player: str, color: str):
    scoreboard_status = get_scoreboard_status(code=code)
    if scoreboard_status == "Closed":
        error = f"ERR: Cannot add player {player}(Scoreboard{code} is closed)!"
        logger.error(error)
        return error
    categories = get_scoreboard_categories(code=code)
    mapped_categories = {category: "none" for category in categories}
    mapped_categories.update({"total": "none"})
    redis.hset(f"scoreboards:{code}:{player}", mapping=mapped_categories)
    redis.set(f"scoreboards:{code}:{player}:color", color)
    success = f"Player {player} with color {color} added to scoreboard {code}"
    logger.info(success)
    return success


def __check_for_category_existance(error_message): 
    def _check_for_category_existance(func):
        def wrapper(*args, **kwargs):
            code = {**kwargs}["code"]
            category = {**kwargs}["category"]
            if category in get_scoreboard_categories(code=code):
                return func(*args, **kwargs)
            else:
                final_error_message = error_message + f"(Category {category} doesn't exist!)"
                logger.error(final_error_message)
                return final_error_message

        return wrapper
    return _check_for_category_existance


@__check_for_scoreboard_existance(error_message="ERR: Cannot update scoreboard")
@__check_for_player_existance(error_message="ERR: Cannot update scoreboard")
@__check_for_category_existance(error_message="ERR: Cannot update scoreboard")
def update_scoreboard(code: str, player: str, category: str, score: int) -> str:
    redis.hset(f"scoreboards:{code}:{player}", category, score)
    succes = f"Scoreboard {code} updated. {player}'s score in {category} is {score} now."
    logger.info(succes)
    return(succes)


@__check_for_scoreboard_existance(error_message="ERR: Cannot get player's progress")
def get_players_progress(code: str) -> dict[str, float] | str:
    players = get_scoreboard_players(code=code)
    players_progress = {}
    for player in players:
        player_score = {key.decode() : value.decode() for key, value in redis.hgetall(f"scoreboards:{code}:{player}").items()}
        unfilled_lenght = list(player_score.values()).count("none") - 1
        full_lenght = len(player_score) - 1
        player_progress = (full_lenght - unfilled_lenght )/ full_lenght
        players_progress.update({player: player_progress})

    return players_progress 


@__check_for_scoreboard_existance(error_message="ERR: Cannot count scoreboard")
def get_counted_scoreboard(code: str):
    scoreboard_players = get_scoreboard_players(code=code)
    categories = [key.decode() for key in redis.hgetall(f"scoreboards:{code}:{scoreboard_players[0]}").keys()]
    max_in_category = {category: 0 for category in categories}
    category_leaders = {category: set() for category in categories}
    final_scoreboard = {}
    for player in scoreboard_players:
        player_score_uncounted = {key.decode() : value.decode() for key, value in redis.hgetall(f"scoreboards:{code}:{player}").items()}
        player_score_no_total = player_score_uncounted
        player_score_no_total.pop("total")
        if "none" in player_score_no_total.values():
            error = f"ERR: Score of player {player} is unfilled (scoreboard {code})!"
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