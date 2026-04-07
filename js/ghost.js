/* ============================================================
   XOVA — ghost.js
   Physics-based ghost assistant with personality
============================================================ */

class XOVAGhost {
  constructor() {
    this.el = document.getElementById('ghost');
    this.speechEl = document.getElementById('ghostSpeech');
    this.speechTextEl = document.getElementById('ghostSpeechText');
    this.leftPupil = document.querySelector('.left-pupil');
    this.rightPupil = document.querySelector('.right-pupil');
    this.mouth = document.getElementById('ghostMouth');
    this.ghostBody = document.querySelector('.ghost-body');

    // Physics state
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.floatOffset = 0;
    this.floatSpeed = 0.02;

    // Eye state
    this.eyeTarget = { x: 0, y: 0 };
    this.eyePos = { x: 0, y: 0 };

    // Personality state
    this.state = 'idle'; // idle, typing, building, celebrating, thinking
    this.speechTimeout = null;
    this.idleMessages = [
      'Build anything with AI ✨',
      'What shall we create today? 🚀',
      'I can build any app for you!',
      'Full-stack magic awaits… ⚡',
      'Drop a prompt, watch it build!',
      'Real code. Real apps. XOVA. 💫',
      'Describe your dream app…',
      'I\'m ready to engineer! 🛠️',
    ];
    this.idleMessageIndex = 0;
    this.idleTimer = null;

    // Celebration particles
    this.particles = [];

    this.init();
  }

  init() {
    this.startFloatAnimation();
    this.startEyeTracking();
    this.startIdleMessages();
    this.bindEvents();
  }

  bindEvents() {
    // Track mouse for eyes
    document.addEventListener('mousemove', (e) => {
      this.updateEyeTarget(e.clientX, e.clientY);
    });

    // Ghost click — bounce
    this.ghostBody.addEventListener('click', () => {
      this.bounce();
      this.say(this.idleMessages[Math.floor(Math.random() * this.idleMessages.length)], 2500);
    });
  }

  // Float animation
  startFloatAnimation() {
    let frame = 0;
    const animate = () => {
      frame++;
      this.floatOffset = Math.sin(frame * this.floatSpeed) * 12;
      this.el.style.transform = `translateY(${this.floatOffset}px)`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Eye tracking
  startEyeTracking() {
    const trackEyes = () => {
      // Smooth lerp toward target
      this.eyePos.x += (this.eyeTarget.x - this.eyePos.x) * 0.1;
      this.eyePos.y += (this.eyeTarget.y - this.eyePos.y) * 0.1;

      const maxOffset = 2.5;
      const dx = Math.max(-maxOffset, Math.min(maxOffset, this.eyePos.x));
      const dy = Math.max(-maxOffset, Math.min(maxOffset, this.eyePos.y));

      if (this.leftPupil) {
        this.leftPupil.setAttribute('cx', 29 + dx);
        this.leftPupil.setAttribute('cy', 45 + dy);
      }
      if (this.rightPupil) {
        this.rightPupil.setAttribute('cx', 53 + dx);
        this.rightPupil.setAttribute('cy', 45 + dy);
      }

      requestAnimationFrame(trackEyes);
    };
    trackEyes();
  }

  updateEyeTarget(mouseX, mouseY) {
    const rect = this.el.getBoundingClientRect();
    const ghostCx = rect.left + rect.width / 2;
    const ghostCy = rect.top + rect.height / 3;

    const angle = Math.atan2(mouseY - ghostCy, mouseX - ghostCx);
    const dist = Math.hypot(mouseX - ghostCx, mouseY - ghostCy);
    const maxDist = 300;
    const intensity = Math.min(dist / maxDist, 1);

    this.eyeTarget.x = Math.cos(angle) * 2.5 * intensity;
    this.eyeTarget.y = Math.sin(angle) * 2.5 * intensity;
  }

  // Idle message cycling
  startIdleMessages() {
    const cycle = () => {
      if (this.state === 'idle') {
        this.say(this.idleMessages[this.idleMessageIndex % this.idleMessages.length], 3000);
        this.idleMessageIndex++;
      }
      this.idleTimer = setTimeout(cycle, 5000);
    };
    this.idleTimer = setTimeout(cycle, 3000);
  }

  // Say something
  say(text, duration = 3000) {
    clearTimeout(this.speechTimeout);
    this.speechTextEl.textContent = text;
    this.speechEl.style.display = 'block';
    this.speechEl.style.animation = 'none';
    this.speechEl.offsetHeight; // reflow
    this.speechEl.style.animation = 'bubblePop 0.3s cubic-bezier(0.175,0.885,0.32,1.275)';

    this.speechTimeout = setTimeout(() => {
      this.speechEl.style.opacity = '0';
      this.speechEl.style.transform = 'scale(0.9)';
      this.speechEl.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => {
        this.speechEl.style.display = 'none';
        this.speechEl.style.opacity = '';
        this.speechEl.style.transform = '';
        this.speechEl.style.transition = '';
      }, 300);
    }, duration);
  }

  // Bounce effect
  bounce() {
    this.el.style.transition = 'transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275)';
    this.el.style.transform = `translateY(${this.floatOffset - 20}px) scale(1.15)`;
    setTimeout(() => {
      this.el.style.transition = '';
      this.el.style.transform = `translateY(${this.floatOffset}px) scale(1)`;
    }, 200);
  }

  // Set mouth expression
  setMouth(type) {
    const mouths = {
      happy: 'M30 60 Q40 68 50 60',
      excited: 'M28 58 Q40 72 52 58',
      thinking: 'M30 62 Q40 60 50 62',
      wow: 'M33 57 Q40 68 47 57',
      neutral: 'M30 62 L50 62'
    };
    if (this.mouth && mouths[type]) {
      this.mouth.setAttribute('d', mouths[type]);
    }
  }

  // State transitions
  onIdle() {
    this.state = 'idle';
    this.setMouth('happy');
    this.ghostBody.style.filter = 'drop-shadow(0 4px 20px rgba(110,231,247,0.5))';
  }

  onTyping() {
    if (this.state === 'typing') return;
    this.state = 'typing';
    this.setMouth('excited');
    this.say('Ooh, this sounds exciting! 👀', 2000);
    this.bounce();
    this.ghostBody.style.filter = 'drop-shadow(0 4px 25px rgba(110,231,247,0.8))';
  }

  onThinking() {
    this.state = 'thinking';
    this.setMouth('thinking');
    this.say('Let me analyze this deeply… 🧠', 4000);

    // Swirling eyes
    let angle = 0;
    const swirl = setInterval(() => {
      if (this.state !== 'thinking') { clearInterval(swirl); return; }
      angle += 0.1;
      const ex = Math.cos(angle) * 2;
      const ey = Math.sin(angle) * 2;
      if (this.leftPupil) {
        this.leftPupil.setAttribute('cx', 29 + ex);
        this.leftPupil.setAttribute('cy', 45 + ey);
      }
      if (this.rightPupil) {
        this.rightPupil.setAttribute('cx', 53 + ex);
        this.rightPupil.setAttribute('cy', 45 + ey);
      }
    }, 30);
    setTimeout(() => clearInterval(swirl), 4000);
  }

  onPlanning() {
    this.state = 'planning';
    this.setMouth('wow');
    this.say('Planning your architecture! 📋', 3000);
  }

  onBuilding() {
    this.state = 'building';
    this.setMouth('excited');

    // Rapid blink
    let blinks = 0;
    const blinkInterval = setInterval(() => {
      const eyes = document.querySelectorAll('.ghost-eye');
      eyes.forEach(e => e.setAttribute('ry', blinks % 2 === 0 ? '1' : '7'));
      blinks++;
      if (blinks > 6) { 
        clearInterval(blinkInterval);
        eyes.forEach(e => e.setAttribute('ry', '7'));
      }
    }, 100);

    this.ghostBody.style.filter = 'drop-shadow(0 4px 30px rgba(167,139,250,0.9))';
    this.say('Building your app! 🚀 Watch the magic!', 3000);
    this.bounce();
  }

  onCelebrate() {
    this.state = 'celebrating';
    this.setMouth('excited');
    this.say('🎉 BUILD COMPLETE! Amazing work!', 5000);
    this.spawnCelebrationParticles();
    
    // Rapid bouncing
    let bounceCount = 0;
    const bounceInterval = setInterval(() => {
      this.bounce();
      bounceCount++;
      if (bounceCount >= 5) clearInterval(bounceInterval);
    }, 300);

    // Rainbow glow
    let hue = 0;
    const rainbowInterval = setInterval(() => {
      if (this.state !== 'celebrating') { clearInterval(rainbowInterval); return; }
      hue = (hue + 5) % 360;
      this.ghostBody.style.filter = `drop-shadow(0 4px 30px hsla(${hue},80%,60%,0.9))`;
    }, 50);
    setTimeout(() => clearInterval(rainbowInterval), 5000);
  }

  onError() {
    this.setMouth('thinking');
    this.say('Hmm, found an issue. Auto-fixing… 🔧', 2500);
    // Shake
    this.el.style.animation = 'none';
    this.el.style.transition = 'transform 0.1s';
    let shakes = 0;
    const shakeInterval = setInterval(() => {
      this.el.style.transform = `translateY(${this.floatOffset}px) translateX(${shakes % 2 === 0 ? 5 : -5}px)`;
      shakes++;
      if (shakes > 6) {
        clearInterval(shakeInterval);
        this.el.style.transition = '';
        this.el.style.transform = `translateY(${this.floatOffset}px)`;
      }
    }, 80);
  }

  // Spawn celebration particles
  spawnCelebrationParticles() {
    const colors = ['#6ee7f7', '#a78bfa', '#f0abfc', '#fbbf24', '#34d399', '#f87171'];
    const rect = this.el.getBoundingClientRect();

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: ${4 + Math.random() * 8}px;
          height: ${4 + Math.random() * 8}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          left: ${rect.left + rect.width/2 + (Math.random() - 0.5) * 60}px;
          top: ${rect.top + rect.height/2}px;
          z-index: 1000;
          pointer-events: none;
        `;
        document.body.appendChild(particle);

        const angle = (Math.random() * Math.PI * 2);
        const speed = 3 + Math.random() * 8;
        const vx = Math.cos(angle) * speed;
        const vy = -Math.abs(Math.sin(angle)) * speed - 2;
        let x = 0, y = 0, vy2 = vy, opacity = 1;

        const animParticle = () => {
          x += vx;
          y += vy2;
          vy2 += 0.3; // gravity
          opacity -= 0.025;
          particle.style.transform = `translate(${x}px, ${y}px)`;
          particle.style.opacity = opacity;
          if (opacity > 0) requestAnimationFrame(animParticle);
          else particle.remove();
        };
        requestAnimationFrame(animParticle);
      }, i * 50);
    }
  }

  // Point toward input
  pointToInput() {
    this.say('Try typing your app idea! 👇', 3000);
    // Wiggle animation
    let t = 0;
    const wiggle = setInterval(() => {
      t++;
      const rot = Math.sin(t * 0.3) * 8;
      this.ghostBody.style.transform = `rotate(${rot}deg)`;
      if (t > 20) {
        clearInterval(wiggle);
        this.ghostBody.style.transform = '';
      }
    }, 60);
  }
}

// Initialize ghost
window.xovaGhost = new XOVAGhost();
