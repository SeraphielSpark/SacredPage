import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import random
import math

# Telegram bot token
TOKEN = "7808164126:AAEPbC_p5z9xsADgo2gtuqpTEZPqokRa0iw"
bot = telebot.TeleBot(TOKEN)

# Game data: {game_id: {board: [...], players: [...], current_turn: 0, difficulty: "easy"}}
games = {}

# Difficulty levels
DIFFICULTY_LEVELS = ["easy", "medium", "hard", "legend"]

# Create a new game
def create_game(player_id, difficulty):
    game_id = str(player_id)
    games[game_id] = {
        "board": [" "] * 9,  # 3x3 grid
        "players": [player_id, "computer"],  # First player is the user, second is the computer
        "current_turn": 0,  # 0 for user, 1 for computer
        "difficulty": difficulty,
    }
    return game_id

# Check for a winner or draw
def check_winner(board):
    winning_combinations = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # Rows
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # Columns
        (0, 4, 8), (2, 4, 6),            # Diagonals
    ]
    for combo in winning_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] and board[combo[0]] != " ":
            return board[combo[0]]  # Return "X" or "O"
    if " " not in board:
        return "draw"
    return None

# Generate game board
def generate_board_markup(game_id):
    board = games[game_id]["board"]
    markup = InlineKeyboardMarkup()
    for i in range(3):
        row = [
            InlineKeyboardButton(
                board[j] if board[j] != " " else "⬜", callback_data=f"{game_id}:{j}"
            )
            for j in range(i * 3, (i + 1) * 3)
        ]
        markup.row(*row)
    return markup

# Start command
@bot.message_handler(commands=["start"])
def start_game(message):
    player_id = message.chat.id
    # Ask for difficulty level
    markup = InlineKeyboardMarkup()
    for difficulty in DIFFICULTY_LEVELS:
        markup.add(InlineKeyboardButton(difficulty.capitalize(), callback_data=f"set_difficulty:{difficulty}"))
    bot.send_message(player_id, "Select difficulty level:", reply_markup=markup)

# Set difficulty level
@bot.callback_query_handler(func=lambda call: call.data.startswith("set_difficulty:"))
def set_difficulty(call):
    difficulty = call.data.split(":")[1]
    player_id = call.from_user.id
    game_id = create_game(player_id, difficulty)
    bot.send_message(player_id, f"Starting game against the computer at {difficulty} level...")
    start_turn(game_id)

# Start a player's turn
def start_turn(game_id):
    game = games[game_id]
    current_player = game["players"][game["current_turn"]]
    if current_player == "computer":
        # Simulate computer move based on difficulty
        bot.send_message(game["players"][0], "Computer is making its move...")
        move = computer_move(game_id)  # Computer makes a move
        board = game["board"]
        board[move] = "O"
        bot.send_message(game["players"][0], f"Computer made its move at position {move + 1}.")
        check_and_switch_turn(game_id, board)
    else:
        # User's turn
        bot.send_message(
            game["players"][0],
            "Your turn! Make a move:",
            reply_markup=generate_board_markup(game_id),
        )

# Handle button clicks (user making a move)
@bot.callback_query_handler(func=lambda call: True)
def handle_move(call):
    game_id, move = call.data.split(":")
    move = int(move)
    game = games[game_id]
    board = game["board"]
    current_player = game["players"][game["current_turn"]]

    # Check if it's the correct player's turn
    if call.from_user.id != current_player:
        bot.answer_callback_query(call.id, "Not your turn!")
        return

    # Check if the move is valid
    if board[move] != " ":
        bot.answer_callback_query(call.id, "Invalid move!")
        return

    # Update the board with the player's move
    board[move] = "X"
    check_and_switch_turn(game_id, board)

# Function to handle the end of a turn (switch turn or end game)
def check_and_switch_turn(game_id, board):
    game = games[game_id]
    winner = check_winner(board)
    
    if winner:
        if winner == "draw":
            for player in game["players"]:
                bot.send_message(player, "It's a draw!")
        else:
            for player in game["players"]:
                bot.send_message(player, f"Player {winner} wins!")
        del games[game_id]
        return

    # Switch turn (0 for user, 1 for computer)
    game["current_turn"] = 1 - game["current_turn"]
    start_turn(game_id)

# Function to simulate computer's move based on difficulty
def computer_move(game_id):
    game = games[game_id]
    difficulty = game["difficulty"]
    board = game["board"]
    available_moves = [i for i, cell in enumerate(board) if cell == " "]

    if difficulty == "easy":
        return random.choice(available_moves)  # Random move

    if difficulty == "medium":
        # Block user or make a winning move
        for move in available_moves:
            board_copy = board[:]
            board_copy[move] = "O"
            if check_winner(board_copy) == "O":
                return move  # Winning move
            board_copy[move] = "X"
            if check_winner(board_copy) == "X":
                return move  # Block user's winning move

    if difficulty == "hard" or difficulty == "legend":
        # Minimax algorithm for hard and legend
        return minimax(board, "O" if difficulty == "hard" else "X")  # Make optimal move for hard/legend

# Function to check for two-way system in moves
def check_two_way_system(board):
    two_way_positions = [0, 6, 8]  # 1 → 7 → 9 pattern in 3x3 grid
    if board[0] == "X" and board[6] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[0] == "X" and board[8] == "X" and board[6] == " ":
        return 6  # Block at position 7
    if board[6] == "X" and board[8] == "X" and board[0] == " ":
        return 0  # Block at position 1
    if board[2] == "X" and board[8] == "X" and board[6] == " ":
        return 6  # Block at position 9
    if board[8] == "X" and board[6] == "X" and board[2] == " ":
        return 2  # Block at position 9
    if board[6] == "X" and board[2] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[0] == "X" and board[8] == "X" and board[2] == " ":
        return 2  # Block at position 9
    if board[0] == "X" and board[2] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[8] == "X" and board[2] == "X" and board[0] == " ":
        return 0  # Block at position 9
    if board[4] == "X" and board[2] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[2] == "X" and board[8] == "X" and board[4] == " ":
        return 4  # Block at position 9 
    if board[8] == "X" and board[4] == "X" and board[2] == " ":
        return 2  # Block at position 9 
    if board[6] == "X" and board[8] == "X" and board[4] == " ":
        return 4  # Block at position 9
    if board[4] == "X" and board[6] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[6] == "X" and board[8] == "X" and board[4] == " ":
        return 4  # Block at position 9 
    if board[0] == "X" and board[6] == "X" and board[4] == " ":
        return 4  # Block at position 9
    if board[4] == "X" and board[6] == "X" and board[0] == " ":
        return 0  # Block at position 9
    if board[4] == "X" and board[0] == "X" and board[6] == " ":
        return 6  # Block at position 9
    if board[1] == "X" and board[8] == "X" and board[4] == " ":
        return 4  # Block at position 9
    if board[8] == "X" and board[4] == "X" and board[1] == " ":
        return 1  # Block at position 9
    if board[4] == "X" and board[1] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[0] == "X" and board[2] == "X" and board[4] == " ":
        return 4  # Block at position 9
    if board[4] == "X" and board[2] == "X" and board[0] == " ":

        return 0  # Block at position 9
    if board[0] == "X" and board[2] == "X" and board[1] == " ":
        return 1  # Block at position 9
    if board[2] == "X" and board[1] == "X" and board[0] == " ":
        return 0  # Block at position 9
    if board[1] == "X" and board[0] == "X" and board[2] == " ":
        return 2  # Block at position 9
    



    if board[0] == "X" and board[3] == "X" and board[6] == " ":
        return 6  # Block at position 9
    if board[3] == "X" and board[6] == "X" and board[0] == " ":
        return 0  # Block at position 9
    if board[6] == "X" and board[0] == "X" and board[3] == " ":
        return 3  # Block at position 9
    
    if board[6] == "X" and board[7] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[7] == "X" and board[8] == "X" and board[6] == " ":
        return 6  # Block at position 9
    if board[6] == "X" and board[8] == "X" and board[7] == " ":
        return 7  # Block at position 9
    
    if board[2] == "X" and board[5] == "X" and board[8] == " ":
        return 8  # Block at position 9
    if board[2] == "X" and board[8] == "X" and board[5] == " ":
        return 0  # Block at position 9
    if board[8] == "X" and board[5] == "X" and board[2] == " ":
        return 2  # Block at position 9
    

    if board[0] =='X':
        return 6
    if board[2] =='X':
        return 5
    
    return None

# Minimax algorithm to find the best move (unbeatable for legend)
def minimax(board, player):
    # Check if the game has ended
    winner = check_winner(board)
    if winner == "O":
        return 1
    elif winner == "X":
        return -1
    elif winner == "draw":
        return 0

    # Possible moves
    available_moves = [i for i, cell in enumerate(board) if cell == " "]

    # Check for two-way system and block it if needed
    block_move = check_two_way_system(board)
    if block_move is not None:
        return block_move  # Block the two-way pattern

    best_score = -math.inf if player == "O" else math.inf
    best_move = None

    for move in available_moves:
        board_copy = board[:]
        board_copy[move] = player
        score = minimax(board_copy, "X" if player == "O" else "O")
        
        if player == "O" and score > best_score:
            best_score = score
            best_move = move
        elif player == "X" and score < best_score:
            best_score = score
            best_move = move

    return best_move

# Polling
bot.infinity_polling()
