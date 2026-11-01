import React, { useEffect, useRef, useCallback } from 'react';
import { 
  LevelConfig, 
  PlayerEntity, 
  InvasiveEntity, 
  SeaweedEntity, 
  BonusEntity, 
  NetProjectile, 
  ParticleEffect 
} from '../types/game';
import { soundEffects } from '../utils/audio';
import { TransparentSpriteRenderer } from '../utils/transparentSprites';

interface GameCanvasProps {
  level: LevelConfig;
  score: number;
  onScoreChange: (delta: number) => void;
  onPowerChange: (power: number, maxPower: number) => void;
  onCaptureProgress: (captured: number, total: number) => void;
  onNetCooldownChange: (remainingSeconds: number, maxSeconds: number) => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  isPaused: boolean;
  inputVector: { x: number; y: number };
  netTrigger: number;
  collectTrigger: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  onScoreChange,
  onPowerChange,
  onCaptureProgress,
  onNetCooldownChange,
  onLevelComplete,
  onGameOver,
  isPaused,
  inputVector,
  netTrigger,
  collectTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core Game Entities Ref (persists across frames without triggering React re-renders)
  const stateRef = useRef<{
    player: PlayerEntity;
    invasives: InvasiveEntity[];
    seaweeds: SeaweedEntity[];
    bonuses: BonusEntity[];
    nets: NetProjectile[];
    particles: ParticleEffect[];
    capturedCount: number;
    netCooldown: number; // in seconds (max 60)
    netMaxCooldown: number; // 60s
    viewportWidth: number;
    viewportHeight: number;
    worldWidth: number;
    worldHeight: number;
    lastTime: number;
    lastNetTrigger: number;
    lastCollectTrigger: number;
    ambientBubbleTimer: number;
    bgImage: HTMLImageElement | null;
    snailImage: HTMLImageElement | null;
  }>({
    player: {
      id: 'zeta',
      x: 120,
      y: 280,
      vx: 0,
      vy: 0,
      size: 32,
      active: true,
      power: 100, // Starts at 100 for level 1
      maxPower: level.species.powerLimit,
      facingRight: true,
      isInvulnerable: false,
      invulnerableTimer: 0,
      isBoosting: false,
      thrusterAngle: 0,
      eyeState: 'happy',
    },
    invasives: [],
    seaweeds: [],
    bonuses: [],
    nets: [],
    particles: [],
    capturedCount: 0,
    netCooldown: 0, // Ready at start
    netMaxCooldown: 60,
    viewportWidth: 800,
    viewportHeight: 480,
    worldWidth: 1600,
    worldHeight: 700,
    lastTime: 0,
    lastNetTrigger: 0,
    lastCollectTrigger: 0,
    ambientBubbleTimer: 0,
    bgImage: null,
    snailImage: null,
  });

  // Preload generated visual assets with safe fallbacks
  useEffect(() => {
    const bg = new Image();
    bg.src = '/src/assets/images/karadeniz_underwater_scene_1793562053947.jpg';
    bg.onload = () => {
      stateRef.current.bgImage = bg;
    };

    const snail = new Image();
    snail.src = '/src/assets/images/rapana_venosa_snail_1793561925354.jpg';
    snail.onload = () => {
      stateRef.current.snailImage = snail;
    };
  }, []);

  // Initialize or Reset Level Entities
  const initLevel = useCallback((cfg: LevelConfig) => {
    const state = stateRef.current;
    state.capturedCount = 0;
    state.netCooldown = 0;
    state.nets = [];
    state.particles = [];

    // Reset Player
    state.player.power = Math.min(cfg.species.startingPower, cfg.species.powerLimit);
    state.player.maxPower = cfg.species.powerLimit;
    state.player.x = 150;
    state.player.y = 300;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.isInvulnerable = false;
    state.player.invulnerableTimer = 0;
    state.player.eyeState = 'happy';

    onPowerChange(state.player.power, state.player.maxPower);
    onCaptureProgress(0, cfg.targetCount);
    onNetCooldownChange(0, state.netMaxCooldown);

    // Spawn Invasive Species
    const invasives: InvasiveEntity[] = [];
    for (let i = 0; i < cfg.targetCount; i++) {
      const isBottom = cfg.species.habitat === 'bottom';
      const spawnX = 400 + i * (state.worldWidth - 550) / cfg.targetCount + Math.random() * 80;
      const spawnY = isBottom 
        ? state.worldHeight - 110 - (i % 2) * 50 - Math.random() * 30
        : 180 + Math.random() * (state.worldHeight - 340);

      invasives.push({
        id: `inv-${cfg.species.id}-${i}`,
        speciesId: cfg.species.id,
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * cfg.species.speed,
        vy: (Math.random() - 0.5) * (cfg.species.speed * 0.6),
        size: cfg.species.size,
        power: cfg.species.startingPower,
        active: true,
        isFleeing: false,
        pulsePhase: Math.random() * Math.PI * 2,
        captured: false,
        captureProgress: 0,
        targetAngle: 0,
        originalCountIndex: i + 1,
      });
    }
    state.invasives = invasives;

    // Spawn Seaweed Clumps along seabed and ledges
    const seaweeds: SeaweedEntity[] = [];
    const step = state.worldWidth / (cfg.seaweedCount + 2);
    for (let i = 0; i < cfg.seaweedCount; i++) {
      seaweeds.push({
        id: `sw-${i}`,
        x: step * (i + 1) + (Math.random() * 40 - 20),
        y: state.worldHeight - 80,
        size: 26,
        height: 60 + Math.random() * 45,
        active: true,
        swayOffset: Math.random() * Math.PI * 2,
        powerValue: 25,
        scoreValue: 10,
        hasSpore: Math.random() > 0.4,
      });
    }
    state.seaweeds = seaweeds;

    // Spawn Native Bonus Creatures (Karadeniz Barbun Balığı)
    const bonuses: BonusEntity[] = [];
    for (let i = 0; i < cfg.bonusCount; i++) {
      bonuses.push({
        id: `bonus-${i}`,
        name: 'Karadeniz Barbunu',
        x: 300 + Math.random() * (state.worldWidth - 500),
        y: 160 + Math.random() * 260,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
        vy: (Math.random() - 0.5) * 0.4,
        size: 22,
        active: true,
        scoreValue: 50,
        swimPhase: Math.random() * Math.PI * 2,
      });
    }
    state.bonuses = bonuses;

    // Initial message particle
    state.particles.push({
      id: 'init-msg',
      x: state.player.x,
      y: state.player.y - 45,
      vx: 0,
      vy: -0.4,
      color: '#38bdf8',
      size: 16,
      alpha: 1,
      life: 0,
      maxLife: 90,
      type: 'text',
      text: `${cfg.name} Başladı!`,
    });
  }, [onPowerChange, onCaptureProgress, onNetCooldownChange]);

  // Re-init on level change
  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  // Resize canvas based on container dimensions
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      stateRef.current.viewportWidth = rect.width;
      stateRef.current.viewportHeight = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Launch Net action helper
  const fireNet = useCallback(() => {
    const state = stateRef.current;
    if (state.netCooldown > 0) {
      // Cooldown not ready, provide subtle audio feedback
      return;
    }

    soundEffects.playNetThrow();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    const p = state.player;
    const direction = p.facingRight ? 1 : -1;
    const netSpeed = 8.5;

    state.nets.push({
      id: `net-${Date.now()}`,
      x: p.x + direction * (p.size + 14),
      y: p.y,
      vx: direction * netSpeed,
      vy: 0,
      size: 18,
      radius: 18,
      maxRadius: 65,
      lifespan: 0,
      maxLifespan: 55, // frames
      active: true,
      expanded: false,
    });

    state.player.eyeState = 'focused';
    setTimeout(() => {
      if (stateRef.current.player.eyeState === 'focused') {
        stateRef.current.player.eyeState = 'happy';
      }
    }, 450);

    // Reset cooldown to 60 seconds as defined
    state.netCooldown = state.netMaxCooldown;
    onNetCooldownChange(state.netCooldown, state.netMaxCooldown);
  }, [onNetCooldownChange]);

  // Manual seaweed collect action
  const harvestNearbySeaweed = useCallback(() => {
    const state = stateRef.current;
    const p = state.player;
    let harvested = false;

    for (const sw of state.seaweeds) {
      if (!sw.active) continue;
      const dx = p.x - sw.x;
      const dy = p.y - sw.y;
      const dist = Math.hypot(dx, dy);

      if (dist < p.size + sw.size + 24) {
        sw.active = false;
        harvested = true;

        // Apply rewards
        const newPower = Math.min(p.maxPower, p.power + sw.powerValue);
        p.power = newPower;
        onPowerChange(p.power, p.maxPower);
        onScoreChange(sw.scoreValue);

        // Boost net reload by 3 seconds for active foraging!
        if (state.netCooldown > 0) {
          state.netCooldown = Math.max(0, state.netCooldown - 3);
          onNetCooldownChange(state.netCooldown, state.netMaxCooldown);
        }

        soundEffects.playCollect();

        // Particles
        state.particles.push({
          id: `pop-${Date.now()}-${Math.random()}`,
          x: sw.x,
          y: sw.y - 20,
          vx: 0,
          vy: -0.8,
          color: '#34d399',
          size: 14,
          alpha: 1,
          life: 0,
          maxLife: 60,
          type: 'text',
          text: `+${sw.powerValue} Güç (+${sw.scoreValue})`,
        });

        for (let i = 0; i < 7; i++) {
          state.particles.push({
            id: `spark-${Date.now()}-${i}`,
            x: sw.x + (Math.random() * 20 - 10),
            y: sw.y + (Math.random() * 20 - 10),
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 0.5,
            color: '#6ee7b7',
            size: 3 + Math.random() * 3,
            alpha: 1,
            life: 0,
            maxLife: 40,
            type: 'sparkle',
          });
        }
      }
    }

    if (harvested && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [onPowerChange, onScoreChange, onNetCooldownChange]);

  // Handle external triggers from Mobile buttons or Keyboard
  useEffect(() => {
    if (netTrigger > 0 && netTrigger !== stateRef.current.lastNetTrigger) {
      stateRef.current.lastNetTrigger = netTrigger;
      fireNet();
    }
  }, [netTrigger, fireNet]);

  useEffect(() => {
    if (collectTrigger > 0 && collectTrigger !== stateRef.current.lastCollectTrigger) {
      stateRef.current.lastCollectTrigger = collectTrigger;
      harvestNearbySeaweed();
    }
  }, [collectTrigger, harvestNearbySeaweed]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const state = stateRef.current;
      const canvas = canvasRef.current;

      if (!canvas) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      if (state.lastTime === 0) state.lastTime = timestamp;
      const rawDt = (timestamp - state.lastTime) / 1000;
      state.lastTime = timestamp;
      const dt = Math.min(rawDt, 0.05); // Clamp frame delta time for stable physics

      if (!isPaused) {
        // 1. Update Net Cooldown
        if (state.netCooldown > 0) {
          state.netCooldown = Math.max(0, state.netCooldown - dt);
          onNetCooldownChange(state.netCooldown, state.netMaxCooldown);
        }

        // 2. Player Physics & Input
        const p = state.player;
        const moveSpeed = 240; // px/sec

        p.vx = inputVector.x * moveSpeed;
        p.vy = inputVector.y * moveSpeed;

        if (inputVector.x > 0.08) p.facingRight = true;
        if (inputVector.x < -0.08) p.facingRight = false;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // World Bounds
        p.x = Math.max(p.size, Math.min(state.worldWidth - p.size, p.x));
        p.y = Math.max(50, Math.min(state.worldHeight - 60, p.y));

        // Invulnerability timer
        if (p.isInvulnerable) {
          p.invulnerableTimer -= dt;
          if (p.invulnerableTimer <= 0) {
            p.isInvulnerable = false;
            p.eyeState = 'happy';
          }
        }

        // Thruster bubble particles
        state.ambientBubbleTimer += dt;
        if (Math.hypot(p.vx, p.vy) > 10 && state.ambientBubbleTimer > 0.08) {
          state.ambientBubbleTimer = 0;
          const thrusterX = p.facingRight ? p.x - p.size * 0.8 : p.x + p.size * 0.8;
          state.particles.push({
            id: `bubble-${Date.now()}-${Math.random()}`,
            x: thrusterX + (Math.random() * 8 - 4),
            y: p.y + 6 + (Math.random() * 6 - 3),
            vx: (p.facingRight ? -1 : 1) * (40 + Math.random() * 30),
            vy: (Math.random() - 0.5) * 15 - 10,
            color: '#bae6fd',
            size: 2.5 + Math.random() * 3.5,
            alpha: 0.8,
            life: 0,
            maxLife: 35,
            type: 'bubble',
          });
        }

        // Automatic collection check when close to seaweed
        for (const sw of state.seaweeds) {
          if (!sw.active) continue;
          const dist = Math.hypot(p.x - sw.x, p.y - sw.y);
          if (dist < p.size + sw.size) {
            sw.active = false;
            p.power = Math.min(p.maxPower, p.power + sw.powerValue);
            onPowerChange(p.power, p.maxPower);
            onScoreChange(sw.scoreValue);

            if (state.netCooldown > 0) {
              state.netCooldown = Math.max(0, state.netCooldown - 3);
              onNetCooldownChange(state.netCooldown, state.netMaxCooldown);
            }

            soundEffects.playCollect();

            state.particles.push({
              id: `sw-pop-${Date.now()}`,
              x: sw.x,
              y: sw.y - 25,
              vx: 0,
              vy: -0.7,
              color: '#34d399',
              size: 14,
              alpha: 1,
              life: 0,
              maxLife: 50,
              type: 'text',
              text: `+${sw.powerValue} Güç (+${sw.scoreValue})`,
            });
          }
        }

        // 3. Update Invasive Species (AI: Stalk if stronger, flee if weaker)
        for (const inv of state.invasives) {
          if (!inv.active || inv.captured) continue;

          inv.pulsePhase += dt * 3;

          const dx = p.x - inv.x;
          const dy = p.y - inv.y;
          const dist = Math.hypot(dx, dy);

          // AI behavior logic
          const isCreatureStronger = inv.power > p.power;
          inv.isFleeing = !isCreatureStronger;

          const aiSpeed = level.species.speed * 60;
          if (dist < 340) {
            if (isCreatureStronger) {
              // Stalks / approaches ZETA
              inv.vx += ((dx / dist) * aiSpeed - inv.vx) * 0.04;
              inv.vy += ((dy / dist) * aiSpeed * 0.7 - inv.vy) * 0.04;
            } else {
              // Equal or weaker: Flees away from ZETA!
              inv.vx += ((-dx / dist) * aiSpeed - inv.vx) * 0.05;
              inv.vy += ((-dy / dist) * aiSpeed * 0.7 - inv.vy) * 0.05;
            }
          } else {
            // Natural drifting / patrolling
            inv.vx += (Math.cos(inv.pulsePhase) * 0.5 - inv.vx * 0.02) * dt;
            inv.vy += (Math.sin(inv.pulsePhase * 0.7) * 0.4 - inv.vy * 0.02) * dt;
          }

          inv.x += inv.vx * dt * 60;
          inv.y += inv.vy * dt * 60;

          // Confine to seabed habitat if bottom creature
          if (level.species.habitat === 'bottom') {
            inv.y = Math.max(state.worldHeight - 220, Math.min(state.worldHeight - 80, inv.y));
          } else {
            inv.y = Math.max(90, Math.min(state.worldHeight - 90, inv.y));
          }
          inv.x = Math.max(inv.size + 40, Math.min(state.worldWidth - inv.size - 40, inv.x));

          // Check direct contact collision with ZETA
          if (!p.isInvulnerable && dist < p.size + inv.size - 6) {
            // Contact is FORBIDDEN! Deduct power
            const dmg = level.species.contactDamage;
            p.power = Math.max(0, p.power - dmg);
            onPowerChange(p.power, p.maxPower);

            soundEffects.playDamage();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([40, 50, 40]);
            }

            p.isInvulnerable = true;
            p.invulnerableTimer = 1.6;
            p.eyeState = 'danger';

            // Pushback
            p.x -= (dx / (dist || 1)) * 35;
            p.y -= (dy / (dist || 1)) * 25;

            state.particles.push({
              id: `dmg-${Date.now()}`,
              x: p.x,
              y: p.y - 35,
              vx: 0,
              vy: -0.9,
              color: '#ef4444',
              size: 15,
              alpha: 1,
              life: 0,
              maxLife: 60,
              type: 'text',
              text: `-${dmg} Zararlı Temas!`,
            });

            // Shockwave ring
            state.particles.push({
              id: `shock-${Date.now()}`,
              x: p.x,
              y: p.y,
              vx: 0,
              vy: 0,
              color: '#f87171',
              size: p.size,
              alpha: 1,
              life: 0,
              maxLife: 20,
              type: 'shockwave',
            });

            if (p.power <= 0) {
              soundEffects.playGameOver();
              onGameOver();
              return;
            }
          }
        }

        // 4. Update Net Projectiles
        for (let i = state.nets.length - 1; i >= 0; i--) {
          const net = state.nets[i];
          net.lifespan++;
          net.x += net.vx;
          net.y += net.vy;
          net.radius = Math.min(net.maxRadius, net.radius + 1.2);

          let hitTarget = false;

          // Check collision with invasive creatures
          for (const inv of state.invasives) {
            if (!inv.active || inv.captured) continue;

            const dist = Math.hypot(net.x - inv.x, net.y - inv.y);
            if (dist < net.radius + inv.size) {
              hitTarget = true;
              net.active = false;

              // Check if player has enough power for capture threshold
              if (p.power >= level.species.captureThreshold) {
                // SUCCESSFUL CAPTURE!
                inv.captured = true;
                inv.active = false;
                state.capturedCount++;

                onScoreChange(100);
                onCaptureProgress(state.capturedCount, level.targetCount);
                soundEffects.playCapture();

                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate([30, 40, 60]);
                }

                // Capture celebratory particles
                state.particles.push({
                  id: `cap-txt-${Date.now()}`,
                  x: inv.x,
                  y: inv.y - 30,
                  vx: 0,
                  vy: -1,
                  color: '#38bdf8',
                  size: 16,
                  alpha: 1,
                  life: 0,
                  maxLife: 70,
                  type: 'text',
                  text: `+100 Yakalandı! (${state.capturedCount}/${level.targetCount})`,
                });

                // Containment beam ring
                for (let k = 0; k < 12; k++) {
                  const angle = (k / 12) * Math.PI * 2;
                  state.particles.push({
                    id: `beam-${Date.now()}-${k}`,
                    x: inv.x,
                    y: inv.y,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3 - 1,
                    color: '#67e8f9',
                    size: 4,
                    alpha: 1,
                    life: 0,
                    maxLife: 40,
                    type: 'sparkle',
                  });
                }

                // Check Level Completion
                if (state.capturedCount >= level.targetCount) {
                  onScoreChange(200); // Level completion reward
                  soundEffects.playVictory();
                  onLevelComplete();
                  return;
                }
              } else {
                // Robot power is below capture threshold!
                state.particles.push({
                  id: `low-pwr-${Date.now()}`,
                  x: inv.x,
                  y: inv.y - 30,
                  vx: 0,
                  vy: -0.6,
                  color: '#fbbf24',
                  size: 14,
                  alpha: 1,
                  life: 0,
                  maxLife: 60,
                  type: 'text',
                  text: `Yetersiz Güç! (Gereken: ${level.species.captureThreshold})`,
                });
                soundEffects.playDamage();
              }
              break;
            }
          }

          // Net lifespan expiration without hitting target (-10 points)
          if (!hitTarget && net.lifespan >= net.maxLifespan) {
            net.active = false;
            onScoreChange(-10);
            state.particles.push({
              id: `miss-${Date.now()}`,
              x: net.x,
              y: net.y,
              vx: 0,
              vy: -0.5,
              color: '#94a3b8',
              size: 13,
              alpha: 0.9,
              life: 0,
              maxLife: 45,
              type: 'text',
              text: `-10 Boşa Ağ`,
            });
          }

          if (!net.active) {
            state.nets.splice(i, 1);
          }
        }

        // 5. Update Bonus Native Species (Karadeniz Barbunu)
        for (const bonus of state.bonuses) {
          if (!bonus.active) continue;
          bonus.swimPhase += dt * 3;
          bonus.x += bonus.vx * dt * 60;
          bonus.y += Math.sin(bonus.swimPhase) * 0.8;

          if (bonus.x < 50 || bonus.x > state.worldWidth - 50) {
            bonus.vx *= -1;
          }

          // Player touches native species: +50 Bonus scan!
          const dist = Math.hypot(p.x - bonus.x, p.y - bonus.y);
          if (dist < p.size + bonus.size) {
            bonus.active = false;
            onScoreChange(bonus.scoreValue);
            soundEffects.playBonus();

            state.particles.push({
              id: `bonus-pop-${Date.now()}`,
              x: bonus.x,
              y: bonus.y - 20,
              vx: 0,
              vy: -0.8,
              color: '#f59e0b',
              size: 15,
              alpha: 1,
              life: 0,
              maxLife: 60,
              type: 'text',
              text: `+50 ${bonus.name} Korundu!`,
            });
          }
        }

        // 6. Update Particle System
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.life++;
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha = 1 - pt.life / pt.maxLife;

          if (pt.type === 'shockwave') {
            pt.size += 2.5;
          }

          if (pt.life >= pt.maxLife) {
            state.particles.splice(i, 1);
          }
        }
      }

      // --- RENDERING PHASE ---
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const vWidth = state.viewportWidth;
      const vHeight = state.viewportHeight;

      // Smooth Camera tracking player
      const cameraX = Math.max(0, Math.min(state.worldWidth - vWidth, state.player.x - vWidth / 2));
      const cameraY = Math.max(0, Math.min(state.worldHeight - vHeight, state.player.y - vHeight / 2));

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 1. Draw Underwater Backdrop
      if (state.bgImage && state.bgImage.complete && state.bgImage.naturalWidth > 0) {
        // Draw image tiled or stretched smoothly across world
        ctx.drawImage(state.bgImage, 0, 0, state.worldWidth, state.worldHeight);
      } else {
        // High quality procedural deep Black Sea gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, state.worldHeight);
        bgGrad.addColorStop(0, '#0c4a6e'); // cyan deep
        bgGrad.addColorStop(0.4, '#075985');
        bgGrad.addColorStop(0.8, '#082f49');
        bgGrad.addColorStop(1, '#021626');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, state.worldWidth, state.worldHeight);

        // Sunbeams
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#bae6fd';
        for (let i = 0; i < 9; i++) {
          ctx.beginPath();
          ctx.moveTo(120 + i * 180, 0);
          ctx.lineTo(240 + i * 200, state.worldHeight);
          ctx.lineTo(160 + i * 200, state.worldHeight);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Draw Seabed & Rocks
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, state.worldHeight);
      ctx.lineTo(0, state.worldHeight - 75);
      for (let x = 0; x <= state.worldWidth; x += 60) {
        const yOffset = Math.sin(x * 0.015) * 15 + Math.cos(x * 0.03) * 8;
        ctx.lineTo(x, state.worldHeight - 75 + yOffset);
      }
      ctx.lineTo(state.worldWidth, state.worldHeight);
      ctx.closePath();
      ctx.fill();

      // Sand sediment layer
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, state.worldHeight);
      ctx.lineTo(0, state.worldHeight - 45);
      for (let x = 0; x <= state.worldWidth; x += 50) {
        ctx.lineTo(x, state.worldHeight - 45 + Math.sin(x * 0.02) * 8);
      }
      ctx.lineTo(state.worldWidth, state.worldHeight);
      ctx.closePath();
      ctx.fill();

      // 3. Draw Seaweed Meadow
      for (const sw of state.seaweeds) {
        if (!sw.active) continue;
        const sway = Math.sin(timestamp * 0.003 + sw.swayOffset) * 16;
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sw.x, sw.y);
        ctx.quadraticCurveTo(sw.x + sway * 0.5, sw.y - sw.height * 0.5, sw.x + sway, sw.y - sw.height);
        ctx.stroke();

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sw.x - 6, sw.y);
        ctx.quadraticCurveTo(sw.x + sway * 0.4 - 4, sw.y - sw.height * 0.4, sw.x + sway * 0.8 - 4, sw.y - sw.height * 0.85);
        ctx.stroke();

        // Glowing spore at tip (+25 power indicator)
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(sw.x + sway, sw.y - sw.height, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Bonus Species (Karadeniz Barbunu) - 100% Şeffaf Arka Plan
      for (const b of state.bonuses) {
        if (!b.active) continue;
        ctx.save();
        ctx.translate(b.x, b.y);
        TransparentSpriteRenderer.drawBarbun(ctx, b.size, b.vx, b.swimPhase);

        // Bonus indicator
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+50 Barbun', 0, -b.size * 0.7);
        ctx.restore();
      }

      // 5. Draw Invasive Species - 100% Şeffaf Arka Plan
      for (const inv of state.invasives) {
        if (!inv.active || inv.captured) continue;

        ctx.save();
        ctx.translate(inv.x, inv.y);

        // Warning or Alert Aura if creature is stronger than ZETA
        if (inv.power > state.player.power) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(0, 0, inv.size + 14 + Math.sin(inv.pulsePhase) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw species with clean transparent silhouette
        if (inv.speciesId === 'rapana') {
          TransparentSpriteRenderer.drawRapana(ctx, inv.size);
        } else if (inv.speciesId === 'mnemiopsis') {
          TransparentSpriteRenderer.drawMnemiopsis(ctx, inv.size, inv.pulsePhase);
        } else if (inv.speciesId === 'mya') {
          TransparentSpriteRenderer.drawMya(ctx, inv.size);
        } else if (inv.speciesId === 'anadara') {
          TransparentSpriteRenderer.drawAnadara(ctx, inv.size);
        } else {
          TransparentSpriteRenderer.drawLiza(ctx, inv.size, inv.vx, inv.pulsePhase);
        }

        // Species label & power badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${level.species.commonName}`, 0, -inv.size - 8);

        // Power gauge under creature
        ctx.fillStyle = inv.power > state.player.power ? '#ef4444' : '#10b981';
        ctx.font = '10px monospace';
        ctx.fillText(`⚡${inv.power}`, 0, inv.size + 14);

        ctx.restore();
      }

      // 6. Draw Net Projectiles
      for (const net of state.nets) {
        ctx.save();
        ctx.translate(net.x, net.y);

        // Outer expanding glowing web
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, net.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Hexagonal web pattern
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * net.radius, Math.sin(angle) * net.radius);
          ctx.stroke();
        }

        // Glowing center core
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 7. Draw ZETA Robot Player - 100% Şeffaf Arka Plan
      const p = state.player;
      ctx.save();
      ctx.translate(p.x, p.y);

      // Flashing if invulnerable after hit
      if (p.isInvulnerable && Math.floor(timestamp * 0.015) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      const powerRatio = p.power / p.maxPower;
      TransparentSpriteRenderer.drawZeta(
        ctx,
        p.size,
        p.eyeState,
        p.facingRight,
        powerRatio,
        p.isInvulnerable
      );
      ctx.restore();

      // 8. Draw Floating Particles & Score Popups
      for (const pt of state.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);

        if (pt.type === 'text') {
          ctx.fillStyle = pt.color;
          ctx.font = `bold ${pt.size}px 'Plus Jakarta Sans', sans-serif`;
          ctx.textAlign = 'center';
          // Outline for legibility
          ctx.strokeStyle = '#021626';
          ctx.lineWidth = 3.5;
          ctx.strokeText(pt.text || '', pt.x, pt.y);
          ctx.fillText(pt.text || '', pt.x, pt.y);
        } else if (pt.type === 'bubble') {
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (pt.type === 'sparkle') {
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (pt.type === 'shockwave') {
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore(); // Restore camera translation

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPaused, 
    inputVector, 
    level, 
    onScoreChange, 
    onPowerChange, 
    onCaptureProgress, 
    onNetCooldownChange, 
    onLevelComplete, 
    onGameOver
  ]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
      />
    </div>
  );
};
