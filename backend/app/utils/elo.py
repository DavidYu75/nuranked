async def calculate_elo(player_rating, opponent_rating, result, k_factor=32):
    """
    Calculate new ELO rating.
    
    Args:
        player_rating: Current ELO rating of the player
        opponent_rating: Current ELO rating of the opponent
        result: 1 for win, 0 for loss, 0.5 for draw
        k_factor: ELO K-factor (default: 32)
        
    Returns:
        New ELO rating
    """
    expected_score = 1 / (1 + 10 ** ((opponent_rating - player_rating) / 400))
    new_rating = player_rating + k_factor * (result - expected_score)
    return round(new_rating)
