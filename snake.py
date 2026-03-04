import pygame
import random
import sys

# CONFIG
WIDTH, HEIGHT = 600, 400
CELL = 20
FPS = 10

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

font = pygame.font.SysFont("Arial", 24)

def draw_rect(color, pos):
    pygame.draw.rect(screen, color, pygame.Rect(pos[0], pos[1], CELL, CELL))

def main():
    snake = [(100, 100), (80, 100), (60, 100)]
    direction = (20, 0)

    food = (
        random.randrange(0, WIDTH, CELL),
        random.randrange(0, HEIGHT, CELL),
    )

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and direction != (0, 20):
                    direction = (0, -20)
                if event.key == pygame.K_DOWN and direction != (0, -20):
                    direction = (0, 20)
                if event.key == pygame.K_LEFT and direction != (20, 0):
                    direction = (-20, 0)
                if event.key == pygame.K_RIGHT and direction != (-20, 0):
                    direction = (20, 0)

        # move snake
        new_head = (snake[0][0] + direction[0], snake[0][1] + direction[1])
        snake.insert(0, new_head)

        # collision with food
        if new_head == food:
            food = (
                random.randrange(0, WIDTH, CELL),
                random.randrange(0, HEIGHT, CELL),
            )
        else:
            snake.pop()

        # collision with walls or itself
        if (
            new_head[0] < 0 or new_head[0] >= WIDTH or
            new_head[1] < 0 or new_head[1] >= HEIGHT or
            new_head in snake[1:]
        ):
            return  # game over

        # draw
        screen.fill((30, 30, 30))
        draw_rect((255, 50, 50), food)

        for block in snake:
            draw_rect((0, 255, 0), block)

        pygame.display.flip()
        clock.tick(FPS)

if __name__ == "__main__":
    main()
