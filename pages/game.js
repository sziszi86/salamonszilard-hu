import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Layout from '../src/layouts/Layout';
import { useLanguage } from '../src/contexts/LanguageContext';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 50;
const OBSTACLE_WIDTH = 15;
const OBSTACLE_HEIGHT = 25;
const COLLECTIBLE_SIZE = 25;
const GRAVITY = 0.7;
const JUMP_STRENGTH = -18;
const GAME_SPEED = 3.0;

function Game() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('playing');
  const [isMobile, setIsMobile] = useState(false);
  const [showTouchIndicator, setShowTouchIndicator] = useState(true);
  const [pickupAnimations, setPickupAnimations] = useState([]);
  const [playerBlinking, setPlayerBlinking] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [applesCollected, setApplesCollected] = useState(0);
  const [totalRewardsCollected, setTotalRewardsCollected] = useState(0);
  const [matrixLines, setMatrixLines] = useState([]);
  
  // Audio refs for sounds
  const jumpAudioRef = useRef(null);
  const painAudioRef = useRef(null);
  
  const [player, setPlayer] = useState({
    x: 50,
    y: GAME_HEIGHT - PLAYER_SIZE - 100,
    velocityY: 0,
    isJumping: false
  });
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameDistance, setGameDistance] = useState(0);

  // HTML code snippets for Matrix effect
  const htmlCodeSnippets = [
    '<div className="container">',
    '<header>',
    '<nav className="navbar">',
    '<ul className="menu">',
    '<li><a href="#home">Home</a></li>',
    '<section id="main">',
    '<h1>Welcome</h1>',
    '<p>Hello World</p>',
    '<button onClick={handleClick}>',
    '<form onSubmit={handleSubmit}>',
    '<input type="text" />',
    '<textarea rows="4">',
    '<img src="/logo.png" />',
    '<footer className="footer">',
    '</div>',
    '</header>',
    '</nav>',
    '</section>',
    '</button>',
    '</form>',
    '</footer>',
    'const [state, setState] = useState();',
    'useEffect(() => {',
    'return () => clearInterval();',
    'function handleClick() {',
    'export default Component;',
    'import React from "react";',
    'npm install next react',
    'git commit -m "feat: add component"',
    'yarn build && yarn start'
  ];

  const initializeGame = useCallback(() => {
    setGameState('playing');
    setPlayer({
      x: 50,
      y: GAME_HEIGHT - PLAYER_SIZE - 100,
      velocityY: 0,
      isJumping: false
    });
    setLives(3);
    setScore(0);
    setGameDistance(0);
    setHitCount(0);
    setPlayerBlinking(false);
    setApplesCollected(0);
    // Only reset total rewards on full game restart (not on life loss)
    setTotalRewardsCollected(0);
    
    // Initialize obstacles with infinite generation
    const newObstacles = [];
    const patterns = [
      { spacing: 350, height: 35 },
      { spacing: 380, height: 40 },
      { spacing: 400, height: 32 },
      { spacing: 360, height: 38 },
      { spacing: 420, height: 36 },
      { spacing: 390, height: 35 },
      { spacing: 370, height: 40 },
      { spacing: 410, height: 33 }
    ];
    
    let currentX = GAME_WIDTH + 100;
    for (let i = 0; i < 20; i++) {
      const pattern = patterns[i % patterns.length];
      newObstacles.push({
        x: currentX,
        y: GAME_HEIGHT - pattern.height - 100,
        width: 40,
        height: pattern.height,
        type: 'pc',
        id: Math.random()
      });
      currentX += pattern.spacing;
    }
    setObstacles(newObstacles);

    // Initialize collectibles with varied rewards
    const newCollectibles = [];
    const rewardTypes = [
      { emoji: '💻', type: 'macbook', value: 10 },
      { emoji: '🍕', type: 'pizza', value: 5 },
      { emoji: '🍔', type: 'hamburger', value: 5 },
      { emoji: '🍎', type: 'apple', value: 3 },
      { emoji: '🌐', type: 'webstorm', value: 15 },
      { emoji: '🏎️', type: 'racecar', value: 15 },
      { emoji: '🎨', type: 'photoshop', value: 12 }
    ];
    
    for (let i = 0; i < 30; i++) {
      const reward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      newCollectibles.push({
        x: GAME_WIDTH + 150 + i * 180,
        y: GAME_HEIGHT - 140 - (Math.random() * 30),
        size: COLLECTIBLE_SIZE + 8,
        collected: false,
        id: Math.random(),
        ...reward
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
      // Play jump sound
      if (jumpAudioRef.current) {
        jumpAudioRef.current.currentTime = 0;
        jumpAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      
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
      setShowTouchIndicator(false);
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
    
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    
    const timer = setTimeout(() => {
      setShowTouchIndicator(false);
    }, 5000);

    // Initialize Matrix code lines
    const initializeMatrix = () => {
      const lines = [];
      for (let i = 0; i < 15; i++) {
        lines.push({
          id: Math.random(),
          text: '',
          targetText: htmlCodeSnippets[Math.floor(Math.random() * htmlCodeSnippets.length)],
          x: Math.random() * GAME_WIDTH,
          y: Math.random() * GAME_HEIGHT,
          speed: 0.5 + Math.random() * 1,
          opacity: 0.1 + Math.random() * 0.3,
          currentIndex: 0,
          delay: Math.random() * 2000
        });
      }
      setMatrixLines(lines);
    };

    initializeMatrix();

    // Matrix typing animation
    const matrixTimer = setInterval(() => {
      setMatrixLines(prev => prev.map(line => {
        if (line.delay > 0) {
          return { ...line, delay: line.delay - 100 };
        }
        
        if (line.currentIndex < line.targetText.length) {
          return {
            ...line,
            text: line.targetText.substring(0, line.currentIndex + 1),
            currentIndex: line.currentIndex + 1,
            y: line.y + line.speed
          };
        } else {
          // Reset line when it's complete
          return {
            ...line,
            text: '',
            targetText: htmlCodeSnippets[Math.floor(Math.random() * htmlCodeSnippets.length)],
            x: Math.random() * GAME_WIDTH,
            y: -20,
            currentIndex: 0,
            delay: Math.random() * 1000
          };
        }
      }));
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(matrixTimer);
    };
  }, [initializeGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameDistance(prev => prev + GAME_SPEED);

      // Update player physics
      setPlayer(prev => {
        const newY = prev.y + prev.velocityY;
        const groundLevel = GAME_HEIGHT - PLAYER_SIZE - 100;
        
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

      // Update obstacles and generate new ones
      setObstacles(prev => {
        let updated = prev.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - GAME_SPEED
        }));
        
        updated = updated.filter(obstacle => obstacle.x > -100);
        
        const lastObstacle = updated[updated.length - 1];
        if (!lastObstacle || lastObstacle.x < GAME_WIDTH + 500) {
          const patterns = [
            { spacing: 350, height: 35 },
            { spacing: 380, height: 40 },
            { spacing: 400, height: 32 },
            { spacing: 360, height: 38 }
          ];
          const pattern = patterns[Math.floor(Math.random() * patterns.length)];
          updated.push({
            x: (lastObstacle?.x || GAME_WIDTH) + pattern.spacing,
            y: GAME_HEIGHT - pattern.height - 100,
            width: 40,
            height: pattern.height,
            type: 'pc',
            id: Math.random()
          });
        }
        
        return updated;
      });

      // Update collectibles and generate new ones
      setCollectibles(prev => {
        let updated = prev.map(collectible => ({
          ...collectible,
          x: collectible.x - GAME_SPEED
        }));
        
        updated = updated.filter(collectible => collectible.x > -100);
        
        const lastCollectible = updated[updated.length - 1];
        if (!lastCollectible || lastCollectible.x < GAME_WIDTH + 500) {
          const rewardTypes = [
            { emoji: '💻', type: 'macbook', value: 10 },
            { emoji: '🍕', type: 'pizza', value: 5 },
            { emoji: '🍔', type: 'hamburger', value: 5 },
            { emoji: '🍎', type: 'apple', value: 3 },
            { emoji: '🌐', type: 'webstorm', value: 15 },
            { emoji: '🏎️', type: 'racecar', value: 15 },
            { emoji: '🎨', type: 'photoshop', value: 12 }
          ];
          const reward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
          updated.push({
            x: (lastCollectible?.x || GAME_WIDTH) + 180,
            y: GAME_HEIGHT - 140 - (Math.random() * 30),
            size: COLLECTIBLE_SIZE + 8,
            collected: false,
            id: Math.random(),
            ...reward
          });
        }
        
        return updated;
      });

      // Update clouds
      setClouds(prev => prev.map(cloud => ({
        ...cloud,
        x: cloud.x - GAME_SPEED * 0.3
      })));

      // Check collisions with obstacles
      setPlayer(currentPlayer => {
        obstacles.forEach(obstacle => {
          const playerPadding = 8;
          if (!playerBlinking && 
              obstacle.x < currentPlayer.x + PLAYER_SIZE - playerPadding &&
              obstacle.x + obstacle.width > currentPlayer.x + playerPadding &&
              obstacle.y < currentPlayer.y + PLAYER_SIZE - playerPadding &&
              obstacle.y + obstacle.height > currentPlayer.y + playerPadding) {
            
            setHitCount(prev => {
              const newHitCount = prev + 1;
              
              setPlayerBlinking(true);
              setTimeout(() => setPlayerBlinking(false), 1500);
              
              // Play pain sound
              if (painAudioRef.current) {
                painAudioRef.current.currentTime = 0;
                painAudioRef.current.play().catch(e => console.log('Pain audio play failed:', e));
              }
              
              if (newHitCount >= 3) {
                setLives(prevLives => {
                  const newLives = prevLives - 1;
                  if (newLives <= 0) {
                    setGameState('gameOver');
                  } else {
                    setPlayer({
                      x: 50,
                      y: GAME_HEIGHT - PLAYER_SIZE - 100,
                      velocityY: 0,
                      isJumping: false
                    });
                  }
                  return newLives;
                });
                return 0;
              }
              
              return newHitCount;
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
          
          setScore(prevScore => prevScore + collectible.value);
          
          // Increase total rewards counter (never decreases)
          setTotalRewardsCollected(prev => prev + 1);
          
          if (collectible.type === 'apple') {
            setApplesCollected(prev => {
              const newCount = prev + 1;
              if (newCount >= 3) {
                setLives(prevLives => Math.min(prevLives + 1, 3));
                return 0;
              }
              return newCount;
            });
          }
          
          setPickupAnimations(prevAnimations => [
            ...prevAnimations,
            {
              id: Math.random(),
              x: collectible.x,
              y: collectible.y,
              startTime: Date.now(),
              value: collectible.value
            }
          ]);
          
          return { ...collectible, collected: true };
        }
        return collectible;
      }));
      
      setPickupAnimations(prev => 
        prev.filter(animation => Date.now() - animation.startTime < 1000)
      );

      // Check win condition based on total rewards collected
      if (totalRewardsCollected >= 50) {
        setGameState('won');
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, obstacles, player, gameDistance, playerBlinking, totalRewardsCollected]);

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
            width: isMobile ? GAME_WIDTH * 0.9 : GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: '#87CEEB',
            background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.3) 0%, rgba(0, 40, 80, 0.2) 100%)',
            border: '2px solid #2c3e50',
            overflow: 'hidden',
            cursor: 'pointer',
            maxWidth: isMobile ? '90vw' : '100%'
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
                <div style={{
                  width: cloud.size,
                  height: cloud.size * 0.7,
                  backgroundColor: 'white',
                  borderRadius: cloud.size / 2,
                  position: 'relative',
                  border: '2px solid #ddd'
                }}>
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

            {/* Matrix Code Background */}
            {matrixLines.map((line) => (
              <div
                key={line.id}
                style={{
                  position: 'absolute',
                  left: line.x,
                  top: line.y,
                  fontSize: '10px',
                  fontFamily: 'Courier New, monospace',
                  color: '#00ff00',
                  opacity: line.opacity,
                  pointerEvents: 'none',
                  zIndex: 1,
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 5px #00ff00'
                }}
              >
                {line.text}
              </div>
            ))}

            {/* Ground */}
            <div style={{
              position: 'absolute',
              bottom: 50,
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
              height: PLAYER_SIZE + 20,
              opacity: playerBlinking ? (Math.floor(Date.now() / 200) % 2 ? 0.3 : 1) : 1,
              transition: 'opacity 0.1s'
            }}>
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
              <div style={{
                position: 'absolute',
                bottom: player.isJumping ? 25 : 15,
                left: player.isJumping ? -8 : -5,
                width: 15,
                height: 15,
                backgroundColor: '#e8b896',
                borderRadius: '50%',
                border: '1px solid #2c3e50',
                transform: player.isJumping ? 'rotate(-30deg)' : 'rotate(0deg)',
                transition: 'all 0.2s ease'
              }} />
              <div style={{
                position: 'absolute',
                bottom: player.isJumping ? 25 : 15,
                right: player.isJumping ? -8 : -5,
                width: 15,
                height: 15,
                backgroundColor: '#e8b896',
                borderRadius: '50%',
                border: '1px solid #2c3e50',
                transform: player.isJumping ? 'rotate(30deg)' : 'rotate(0deg)',
                transition: 'all 0.2s ease'
              }} />
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

            {/* Obstacles - Old PCs with CRT Monitors and Angry Faces */}
            {obstacles.map((obstacle, index) => (
              <div
                key={obstacle.id || index}
                style={{
                  position: 'absolute',
                  left: obstacle.x,
                  top: obstacle.y,
                  width: obstacle.width,
                  height: obstacle.height,
                  zIndex: 10
                }}
              >
                {/* CRT Monitor */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 5,
                  width: obstacle.width - 10,
                  height: '65%',
                  background: 'linear-gradient(135deg, #d4d4d4 0%, #a8a8a8 100%)',
                  borderRadius: '8px 8px 4px 4px',
                  border: '2px solid #666',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                  {/* Screen with Evil Face */}
                  <div style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    right: 3,
                    bottom: 8,
                    backgroundColor: '#1a1a1a',
                    borderRadius: '4px',
                    border: '1px solid #333',
                    background: 'radial-gradient(circle at center, #330000 0%, #000000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    animation: 'evilGlow 2s infinite ease-in-out'
                  }}>
                    👹
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: -3,
                    left: '40%',
                    width: '20%',
                    height: 6,
                    backgroundColor: '#888',
                    borderRadius: '2px'
                  }} />
                </div>
                
                {/* PC Tower */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: obstacle.width,
                  height: '40%',
                  background: 'linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
                  border: '2px solid #666',
                  borderRadius: '2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    width: '60%',
                    height: 3,
                    backgroundColor: '#333',
                    borderRadius: '1px'
                  }} />
                  
                  <div style={{
                    position: 'absolute',
                    top: 2,
                    right: 3,
                    width: 3,
                    height: 3,
                    backgroundColor: '#ff0000',
                    borderRadius: '50%',
                    boxShadow: '0 0 3px #ff0000'
                  }} />
                </div>
                
                {/* Smoke Animation */}
                <div style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '12px',
                  opacity: 0.7,
                  animation: 'float 2s infinite ease-in-out'
                }}>
                  💨
                </div>
              </div>
            ))}

            {/* Collectibles - Varied Rewards with Pulsing White Outline */}
            {collectibles.map((collectible, index) => (
              !collectible.collected && (
                <div
                  key={collectible.id || index}
                  style={{
                    position: 'absolute',
                    left: collectible.x,
                    top: collectible.y,
                    width: collectible.size,
                    height: collectible.size,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: collectible.size - 5,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.5)',
                    animation: 'pulseReward 2s infinite ease-in-out'
                  }}
                >
                  {collectible.emoji}
                </div>
              )
            ))}
            
            {/* Pickup Animations */}
            {pickupAnimations.map((animation) => {
              const elapsed = Date.now() - animation.startTime;
              const progress = elapsed / 1000;
              const opacity = Math.max(0, 1 - progress);
              const scale = 1 + progress * 2;
              const yOffset = progress * -50;
              
              return (
                <div
                  key={animation.id}
                  style={{
                    position: 'absolute',
                    left: animation.x,
                    top: animation.y + yOffset,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#f1c40f',
                    opacity: opacity,
                    transform: `scale(${scale})`,
                    pointerEvents: 'none',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    zIndex: 1000
                  }}
                >
                  +{animation.value} ✨
                </div>
              );
            })}

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

            {/* Score and Rewards */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'right',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <div>Score: {score}</div>
              <div>Jutalmak: {totalRewardsCollected}/50</div>
              {applesCollected > 0 && (
                <div style={{ color: '#27ae60', fontSize: '14px' }}>
                  Almák: {applesCollected}/3 ❤️
                </div>
              )}
              <div style={{ color: hitCount > 0 ? '#e74c3c' : 'transparent', fontSize: '14px' }}>
                Hits: {hitCount}/3
              </div>
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
                textAlign: 'center',
                zIndex: 2000
              }}>
                <div style={{ marginBottom: '20px' }}>{t('gameOver', 'game')}</div>
                <button
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: isMobile ? '12px 24px' : '15px 30px',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.2',
                    minHeight: isMobile ? '44px' : '50px',
                    zIndex: 2001,
                    touchAction: 'manipulation'
                  }}
                  onClick={initializeGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    initializeGame();
                  }}
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
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f1c40f',
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                zIndex: 2000
              }}>
                <div style={{ marginBottom: '20px', fontSize: '32px' }}>
                  🎉 GRATULATION! 🎉
                </div>
                <div style={{ marginBottom: '15px', fontSize: '28px' }}>
                  🎊 SIKERES FEJLESZTÉS! 🎊
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'white',
                  marginBottom: '20px',
                  maxWidth: '80%'
                }}>
                  Du hast alle 50 Belohnungen gesammelt! / Összegyűjtöttél mind az 50 jutalmat!
                </div>
                <button
                  style={{
                    backgroundColor: '#f1c40f',
                    color: '#2c3e50',
                    border: 'none',
                    padding: isMobile ? '12px 24px' : '15px 30px',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.2',
                    minHeight: isMobile ? '44px' : '50px',
                    zIndex: 2001,
                    touchAction: 'manipulation'
                  }}
                  onClick={initializeGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    initializeGame();
                  }}
                >
                  Nochmal spielen / Újra játék
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile Touch Indicator */}
          {isMobile && showTouchIndicator && gameState === 'playing' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '20px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                animation: 'bounce 1s infinite alternate'
              }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>👆</div>
                <div>Koppints az ugráshoz!</div>
                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>Tap to jump!</div>
              </div>
            </div>
          )}
        </div>

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
          <p style={{ margin: '5px 0' }}>Gyűjtsd össze a jutalmakat pontokért! / Sammle Belohnungen für Punkte!</p>
          <p style={{ fontWeight: 'bold', color: '#e74c3c', margin: '10px 0', fontSize: isMobile ? '11px' : '13px' }}>
            Gyűjts össze mind az 50 jutalmat a győzelemhez! / Sammle alle 50 Belohnungen zum Sieg!
          </p>
        </div>
        
        {/* Audio element for jump sound */}
        <audio 
          ref={jumpAudioRef}
          preload="auto"
          style={{ display: 'none' }}
        >
          <source src="data:audio/wav;base64,UklGRr4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZoAAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4" type="audio/wav" />
        </audio>
        
        {/* Audio element for pain sound */}
        <audio 
          ref={painAudioRef}
          preload="auto"
          style={{ display: 'none' }}
        >
          <source src="data:audio/wav;base64,UklGRr4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZoAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=" type="audio/wav" />
        </audio>
        
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-50%) translateY(-3px); }
          }
          
          @keyframes pulseReward {
            0%, 100% { 
              box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.3);
            }
            50% { 
              box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 0 4px rgba(255,255,255,0.7);
            }
          }
          
          @keyframes evilGlow {
            0%, 100% { 
              background: radial-gradient(circle at center, #330000 0%, #000000 100%);
              box-shadow: 0 0 5px #ff0000;
            }
            50% { 
              background: radial-gradient(circle at center, #550000 0%, #220000 100%);
              box-shadow: 0 0 10px #ff0000;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}

export default Game;