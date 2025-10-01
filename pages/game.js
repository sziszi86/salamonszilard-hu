import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../src/layouts/Layout';
import { useLanguage } from '../src/contexts/LanguageContext';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 50;
const OBSTACLE_WIDTH = 15;
const OBSTACLE_HEIGHT = 25;
const COLLECTIBLE_SIZE = 25;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -16;
const GAME_SPEED = 1.5;

function Game() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('playing'); // 'playing', 'gameOver', 'won'
  const [isMobile, setIsMobile] = useState(false);
  const [showTouchIndicator, setShowTouchIndicator] = useState(true);
  const [player, setPlayer] = useState({
    x: 50,
    y: GAME_HEIGHT - PLAYER_SIZE - 50,
    velocityY: 0,
    isJumping: false
  });
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameDistance, setGameDistance] = useState(0);

  const initializeGame = useCallback(() => {
    setGameState('playing');
    setPlayer({
      x: 50,
      y: GAME_HEIGHT - PLAYER_SIZE - 50,
      velocityY: 0,
      isJumping: false
    });
    setLives(3);
    setScore(0);
    setGameDistance(0);
    
    // Initialize obstacles with easier patterns
    const newObstacles = [];
    const patterns = [
      { spacing: 220, height: 20 },
      { spacing: 250, height: 25 },
      { spacing: 280, height: 20 },
      { spacing: 240, height: 22 },
      { spacing: 260, height: 25 },
      { spacing: 300, height: 20 },
      { spacing: 230, height: 23 },
      { spacing: 270, height: 22 }
    ];
    
    let currentX = GAME_WIDTH + 100;
    for (let i = 0; i < 8; i++) {
      const pattern = patterns[i % patterns.length];
      newObstacles.push({
        x: currentX,
        y: GAME_HEIGHT - pattern.height - 50,
        width: OBSTACLE_WIDTH,
        height: pattern.height,
        type: 'error'
      });
      currentX += pattern.spacing;
    }
    setObstacles(newObstacles);

    // Initialize collectibles - 15 codes to collect
    const newCollectibles = [];
    for (let i = 0; i < 15; i++) {
      newCollectibles.push({
        x: GAME_WIDTH + 120 + i * 180,
        y: GAME_HEIGHT - 100 - (Math.random() * 30),
        size: COLLECTIBLE_SIZE,
        collected: false
      });
    }
    setCollectibles(newCollectibles);

    // Initialize Mario-style clouds
    const newClouds = [];
    for (let i = 0; i < 12; i++) {
      newClouds.push({
        x: i * 120 + Math.random() * 50,
        y: 30 + Math.random() * 80,
        size: 50 + Math.random() * 20,
        type: 'mario'
      });
    }
    setClouds(newClouds);
  }, []);

  const jump = useCallback(() => {
    if (!player.isJumping && gameState === 'playing') {
      setPlayer(prev => ({
        ...prev,
        velocityY: JUMP_STRENGTH,
        isJumping: true
      }));
    }
  }, [player.isJumping, gameState]);

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'ArrowUp' || event.code === 'Space') {
      event.preventDefault();
      if (gameState === 'playing') {
        jump();
      }
    }
  }, [jump, gameState]);

  const handleTouch = useCallback((event) => {
    event.preventDefault();
    if (gameState === 'playing') {
      jump();
      setShowTouchIndicator(false); // Hide indicator after first touch
    }
  }, [jump, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.addEventListener('touchstart', handleTouch);
      gameArea.addEventListener('click', handleTouch);
      return () => {
        gameArea.removeEventListener('touchstart', handleTouch);
        gameArea.removeEventListener('click', handleTouch);
      };
    }
  }, [handleTouch]);

  useEffect(() => {
    initializeGame();
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    
    // Hide touch indicator after 5 seconds
    const timer = setTimeout(() => {
      setShowTouchIndicator(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [initializeGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameDistance(prev => prev + GAME_SPEED);

      // Update player physics
      setPlayer(prev => {
        const newY = prev.y + prev.velocityY;
        const groundLevel = GAME_HEIGHT - PLAYER_SIZE - 50;
        
        if (newY >= groundLevel) {
          return {
            ...prev,
            y: groundLevel,
            velocityY: 0,
            isJumping: false
          };
        }
        
        return {
          ...prev,
          y: newY,
          velocityY: prev.velocityY + GRAVITY
        };
      });

      // Update obstacles
      setObstacles(prev => prev.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - GAME_SPEED
      })));

      // Update collectibles
      setCollectibles(prev => prev.map(collectible => ({
        ...collectible,
        x: collectible.x - GAME_SPEED
      })));

      // Update clouds
      setClouds(prev => prev.map(cloud => ({
        ...cloud,
        x: cloud.x - GAME_SPEED * 0.3
      })));

      // Check collisions with obstacles
      setPlayer(currentPlayer => {
        obstacles.forEach(obstacle => {
          if (obstacle.x < currentPlayer.x + PLAYER_SIZE &&
              obstacle.x + obstacle.width > currentPlayer.x &&
              obstacle.y < currentPlayer.y + PLAYER_SIZE &&
              obstacle.y + obstacle.height > currentPlayer.y) {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              }
              return newLives;
            });
          }
        });
        return currentPlayer;
      });

      // Check collectible pickup
      setCollectibles(prev => prev.map(collectible => {
        if (!collectible.collected &&
            collectible.x < player.x + PLAYER_SIZE &&
            collectible.x + collectible.size > player.x &&
            collectible.y < player.y + PLAYER_SIZE &&
            collectible.y + collectible.size > player.y) {
          setScore(prevScore => prevScore + 10);
          return { ...collectible, collected: true };
        }
        return collectible;
      }));

      // Check win condition (collected all 15 codes)
      setCollectibles(currentCollectibles => {
        const collectedCount = currentCollectibles.filter(c => c.collected).length;
        if (collectedCount >= 15) {
          setGameState('won');
        }
        return currentCollectibles;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, obstacles, player, gameDistance]);

  return (
    <Layout>
      <Head>
        <title>Szalámi Szilárds Fejlesztő Játék</title>
      </Head>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        backgroundColor: '#87CEEB',
        padding: '10px',
        fontFamily: 'monospace'
      }}>
        <h1 style={{ 
          color: '#2c3e50',
          fontSize: isMobile ? '18px' : '24px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          🎮 {t('title', 'game')}
        </h1>

        <div style={{ position: 'relative' }}>
          <div id="game-area" style={{
            position: 'relative',
            width: isMobile ? Math.min(GAME_WIDTH * 0.9, window.innerWidth - 20) : GAME_WIDTH,
            height: isMobile ? GAME_HEIGHT * 0.8 : GAME_HEIGHT,
            backgroundColor: '#87CEEB',
            border: '2px solid #2c3e50',
            overflow: 'hidden',
            cursor: 'pointer',
            maxWidth: '100%'
          }}>
          {/* Mario-style Clouds */}
          {clouds.map((cloud, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: cloud.x,
                top: cloud.y,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Main cloud body */}
              <div style={{
                width: cloud.size,
                height: cloud.size * 0.7,
                backgroundColor: 'white',
                borderRadius: cloud.size / 2,
                position: 'relative',
                border: '2px solid #ddd'
              }}>
                {/* Cloud bumps */}
                <div style={{
                  position: 'absolute',
                  top: -cloud.size * 0.2,
                  left: cloud.size * 0.2,
                  width: cloud.size * 0.3,
                  height: cloud.size * 0.3,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: '2px solid #ddd'
                }} />
                <div style={{
                  position: 'absolute',
                  top: -cloud.size * 0.15,
                  right: cloud.size * 0.15,
                  width: cloud.size * 0.25,
                  height: cloud.size * 0.25,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: '2px solid #ddd'
                }} />
                <div style={{
                  position: 'absolute',
                  top: -cloud.size * 0.1,
                  left: cloud.size * 0.5,
                  width: cloud.size * 0.2,
                  height: cloud.size * 0.2,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: '2px solid #ddd'
                }} />
              </div>
            </div>
          ))}

          {/* Ground */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 50,
            backgroundColor: '#8B4513'
          }} />

          {/* Player with body */}
          <div style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE + 20
          }}>
            {/* Body */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: PLAYER_SIZE * 0.2,
              width: PLAYER_SIZE * 0.6,
              height: 25,
              backgroundColor: '#3498db',
              borderRadius: '8px',
              border: '2px solid #2c3e50'
            }} />
            {/* Arms */}
            <div style={{
              position: 'absolute',
              bottom: 15,
              left: -5,
              width: 15,
              height: 15,
              backgroundColor: '#e8b896',
              borderRadius: '50%',
              border: '1px solid #2c3e50'
            }} />
            <div style={{
              position: 'absolute',
              bottom: 15,
              right: -5,
              width: 15,
              height: 15,
              backgroundColor: '#e8b896',
              borderRadius: '50%',
              border: '1px solid #2c3e50'
            }} />
            {/* Legs */}
            <div style={{
              position: 'absolute',
              bottom: -5,
              left: PLAYER_SIZE * 0.25,
              width: 8,
              height: 12,
              backgroundColor: '#8B4513',
              borderRadius: '4px',
              border: '1px solid #2c3e50'
            }} />
            <div style={{
              position: 'absolute',
              bottom: -5,
              right: PLAYER_SIZE * 0.25,
              width: 8,
              height: 12,
              backgroundColor: '#8B4513',
              borderRadius: '4px',
              border: '1px solid #2c3e50'
            }} />
            {/* Head */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              backgroundImage: 'url(/assets/images/gamearc.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              border: '2px solid #2c3e50'
            }} />
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height,
                backgroundColor: '#e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              ERROR
            </div>
          ))}

          {/* Collectibles */}
          {collectibles.map((collectible, index) => (
            !collectible.collected && (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: collectible.x,
                  top: collectible.y,
                  width: collectible.size,
                  height: collectible.size,
                  backgroundColor: '#f39c12',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                &lt;/&gt;
              </div>
            )
          ))}

          {/* Lives (Hearts) */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            gap: '8px'
          }}>
            {Array.from({ length: lives }, (_, index) => (
              <div
                key={index}
                style={{
                  fontSize: '24px',
                  color: '#e74c3c'
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* Score and Codes */}
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: '#2c3e50',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'right'
          }}>
            <div>Score: {score}</div>
            <div>{t('codesCollected', 'game')}: {collectibles.filter(c => c.collected).length}/15</div>
          </div>

          {/* Game Over Screen */}
          {gameState === 'gameOver' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e74c3c',
              fontSize: '32px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '20px' }}>{t('gameOver', 'game')}</div>
              <button
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={initializeGame}
              >
                {t('restartButton', 'game')}
              </button>
            </div>
          )}

          {/* Win Screen */}
          {gameState === 'won' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f39c12',
              fontSize: '28px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '20px' }}>
                🎉 {t('successMessage', 'game')} 🎉
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: 'white',
                marginBottom: '20px'
              }}>
                Minden kódot összegyűjtöttél! / Alle Codes gesammelt!
              </div>
              <button
                style={{
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={initializeGame}
              >
                {t('playAgainButton', 'game')}
              </button>
            </div>
          )}
          
          {/* Mobile Touch Indicator */}
          {isMobile && showTouchIndicator && gameState === 'playing' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 1000,
              animation: 'pulse 1.5s infinite'
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '20px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>👆</div>
                <div>Koppints az ugráshoz!</div>
                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>Tap to jump!</div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
        `}</style>

        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: isMobile ? '12px' : '14px',
          padding: '0 10px'
        }}>
          <p style={{ margin: '5px 0' }}>
            {isMobile ? 'Koppints az ugráshoz! / Tap to jump!' : t('jumpInstructions', 'game')}
          </p>
          <p style={{ margin: '5px 0' }}>{t('collectInstructions', 'game')}</p>
          <p style={{ fontWeight: 'bold', color: '#e74c3c', margin: '10px 0', fontSize: isMobile ? '11px' : '13px' }}>
            Gyűjts össze mind a 15 kódot a győzelemhez! / Sammle alle 15 Codes zum Sieg!
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Game;