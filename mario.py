import pygame
from pygame.locals import 

# Initialize Pygame
pygame.init()

# Set up the display
screen_width, screen_height = 800, 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Continuous Background Scroll")

# Load background image
background_image = pygame.image.load("Sky.png")  # Replace with your background image
background_rect = background_image.get_rect()
background_width, background_height = background_rect.width, background_rect.height

# Load player image (replace with your player character image)
player_image = pygame.Surface((50, 50))
player_image.fill((255, 0, 0))
player_rect = player_image.get_rect()
player_x, player_y = 100, 300
player_speed = 5

# Set up the camera (viewport)
camera_x = 0
camera_speed = 5

# Main game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == QUIT:
            running = False

    # Handle player input
    keys = pygame.key.get_pressed()
    if keys[K_LEFT]:
        player_x -= player_speed
    if keys[K_RIGHT]:
        player_x += player_speed

    # Update the camera (viewport) position to follow the player
    camera_x = player_x - screen_width // 2

    # Ensure the camera stays within the bounds of the background
    camera_x = max(0, min(camera_x, background_width - screen_width))

    # Clear the screen
    screen.fill((0, 0, 0))

    # Calculate the visible portion of the background
    visible_background_rect = Rect(max(0, camera_x), 0, min(screen_width, background_width - camera_x), screen_height)

    visible_background = background_image.subsurface(visible_background_rect)

    # Draw the visible background
    screen.blit(visible_background, (0, 0))

    # Draw the player character with adjusted coordinates
    screen.blit(player_image, (player_x - camera_x, player_y))

    # Update the display
    pygame.display.update()

# Quit Pygame
pygame.quit()
