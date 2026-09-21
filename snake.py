import random
import sys

import pygame

CELL = 20
COLS = 30
ROWS = 24
WIDTH = CELL * COLS
HEIGHT = CELL * ROWS

BG = (18, 18, 24)
GRID = (28, 28, 38)
SNAKE_HEAD = (80, 220, 120)
SNAKE_BODY = (50, 170, 90)
FOOD = (230, 70, 70)
TEXT = (235, 235, 235)

UP, DOWN, LEFT, RIGHT = (0, -1), (0, 1), (-1, 0), (1, 0)
KEY_DIRS = {
    pygame.K_UP: UP, pygame.K_w: UP,
    pygame.K_DOWN: DOWN, pygame.K_s: DOWN,
    pygame.K_LEFT: LEFT, pygame.K_a: LEFT,
    pygame.K_RIGHT: RIGHT, pygame.K_d: RIGHT,
}

START_FPS = 8
MAX_FPS = 20


class Game:
    def __init__(self):
        self.best = 0
        self.reset()

    def reset(self):
        cx, cy = COLS // 2, ROWS // 2
        self.snake = [(cx, cy), (cx - 1, cy), (cx - 2, cy)]
        self.direction = RIGHT
        self.pending = []  # 입력 버퍼: 한 틱에 두 번 꺾어 자기 몸과 부딪히는 것을 방지
        self.score = 0
        self.food = self.spawn_food()
        self.game_over = False

    def spawn_food(self):
        free = [(x, y) for x in range(COLS) for y in range(ROWS) if (x, y) not in self.snake]
        return random.choice(free) if free else None

    def turn(self, new_dir):
        last = self.pending[-1] if self.pending else self.direction
        if new_dir == last or (new_dir[0] + last[0], new_dir[1] + last[1]) == (0, 0):
            return
        if len(self.pending) < 2:
            self.pending.append(new_dir)

    def step(self):
        if self.pending:
            self.direction = self.pending.pop(0)
        hx, hy = self.snake[0]
        head = (hx + self.direction[0], hy + self.direction[1])

        eating = head == self.food
        body = self.snake if eating else self.snake[:-1]  # 꼬리는 이동하며 비워짐
        if not (0 <= head[0] < COLS and 0 <= head[1] < ROWS) or head in body:
            self.game_over = True
            self.best = max(self.best, self.score)
            return

        self.snake.insert(0, head)
        if eating:
            self.score += 10
            self.food = self.spawn_food()
            if self.food is None:  # 판을 모두 채우면 승리
                self.game_over = True
                self.best = max(self.best, self.score)
        else:
            self.snake.pop()

    @property
    def fps(self):
        return min(MAX_FPS, START_FPS + self.score // 50)


def draw_cell(surface, pos, color, inset=1):
    rect = pygame.Rect(pos[0] * CELL + inset, pos[1] * CELL + inset, CELL - inset * 2, CELL - inset * 2)
    pygame.draw.rect(surface, color, rect, border_radius=5)


def draw_centered(surface, font, text, y, color=TEXT):
    img = font.render(text, True, color)
    surface.blit(img, img.get_rect(center=(WIDTH // 2, y)))


def draw(screen, game, font, big_font):
    screen.fill(BG)
    for x in range(0, WIDTH, CELL):
        pygame.draw.line(screen, GRID, (x, 0), (x, HEIGHT))
    for y in range(0, HEIGHT, CELL):
        pygame.draw.line(screen, GRID, (0, y), (WIDTH, y))

    if game.food:
        draw_cell(screen, game.food, FOOD, inset=3)
    for i, seg in enumerate(game.snake):
        draw_cell(screen, seg, SNAKE_HEAD if i == 0 else SNAKE_BODY)

    screen.blit(font.render(f"Score: {game.score}   Best: {game.best}", True, TEXT), (8, 6))

    if game.game_over:
        overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 150))
        screen.blit(overlay, (0, 0))
        draw_centered(screen, big_font, "GAME OVER", HEIGHT // 2 - 30)
        draw_centered(screen, font, "Press SPACE to restart / ESC to quit", HEIGHT // 2 + 20)


def main():
    pygame.init()
    pygame.display.set_caption("Snake")
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    font = pygame.font.SysFont("malgungothic,arial", 20)
    big_font = pygame.font.SysFont("malgungothic,arial", 48, bold=True)

    game = Game()
    paused = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type != pygame.KEYDOWN:
                continue
            if event.key == pygame.K_ESCAPE:
                pygame.quit()
                sys.exit()
            if game.game_over:
                if event.key in (pygame.K_SPACE, pygame.K_RETURN):
                    game.reset()
                    paused = False
            elif event.key == pygame.K_p:
                paused = not paused
            elif event.key in KEY_DIRS and not paused:
                game.turn(KEY_DIRS[event.key])

        if not game.game_over and not paused:
            game.step()

        draw(screen, game, font, big_font)
        if paused:
            draw_centered(screen, big_font, "PAUSED", HEIGHT // 2)
        pygame.display.flip()
        clock.tick(game.fps)


if __name__ == "__main__":
    main()
