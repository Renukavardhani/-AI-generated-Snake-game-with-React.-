import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  const lastDirection = useRef<Point>(INITIAL_DIRECTION);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(false);
    lastDirection.current = INITIAL_DIRECTION;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver) {
         if (e.key === 'Enter') resetGame();
         return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setHasStarted(true);
      }

      const ld = lastDirection.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (ld.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (ld.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (ld.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (ld.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = { ...prev[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Collision with self
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        lastDirection.current = direction;
        return newSnake;
      });
    };

    // Speed up slightly as snake gets longer, max speed defined by minimum timeout
    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(snake.length / 5) * 5);
    
    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, hasStarted, isPaused, generateFood, snake.length]);

  return (
    <div className="flex flex-col items-center gap-4">
      
      <div className="flex w-full justify-between items-end border-b-2 border-[var(--color-magenta)] pb-2 mb-2 px-2">
        <div>
          <span className="text-gray-400 text-sm">SCORE</span>
          <div className="text-4xl text-[var(--color-cyan)] terminal-text">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="text-right">
          <span className="text-gray-400 text-sm">HIGH_SCORE</span>
          <div className="text-2xl text-[var(--color-magenta)] terminal-text-magenta">{highScore.toString().padStart(4, '0')}</div>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="neo-border relative bg-black bg-opacity-80"
        style={{ 
          width: '400px', 
          height: '400px',
          boxShadow: gameOver ? '0 0 30px var(--color-magenta)' : '0 0 15px var(--color-cyan)' 
        }}
      >
        {/* Render grid optionally - we can leave it empty and let the visual overlay handle the vibe */}

        {/* Snake body */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute border border-black ${isHead ? 'bg-[var(--color-magenta)] z-10' : 'bg-[var(--color-cyan)] opacity-90'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
              }}
            >
              {isHead && (
                 <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-black rounded-full shadow-lg"></div>
                 </div>
              )}
            </div>
          );
        })}

        {/* Food */}
        <div 
          className="absolute bg-[#FFEA00] animate-pulse border border-black shadow-[0_0_10px_#FFEA00]"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        ></div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h3 className="text-3xl text-[var(--color-cyan)] glitch-text mb-4" data-text="READY?">READY?</h3>
            <p className="text-center text-sm animate-pulse">USE WASD OR ARROW KEYS<br/>TO INITIATE SEQUENCE.</p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h3 className="text-3xl text-[#FFEA00] tracking-widest mb-4">PAUSED</h3>
            <p className="text-sm">PRESS 'P' TO RESUME</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
            <h3 className="text-5xl text-[var(--color-magenta)] glitch-text font-bold mb-4" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h3>
            <p className="text-xl mb-4 text-[var(--color-cyan)]">FINAL_SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black transition-all shadow-[0_0_10px_var(--color-cyan)] uppercase text-xl"
            >
              REBOOT_SYS
            </button>
            <span className="text-xs text-gray-500 mt-4 animate-pulse">PRESS ENTER TO RESTART</span>
          </div>
        )}
      </div>

    </div>
  );
}
