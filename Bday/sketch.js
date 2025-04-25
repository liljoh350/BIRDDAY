const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Animation settings
const message = "HAPPY BIRTHDAY MINOU ❤️"; // Replace [NAME] with the desired name
const letters = [];
let fontSize = 40;

// Letter class to handle each character
class Letter {
  constructor(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.dx = -2; // Move left
    this.dy = -2; // Move up
    this.fireworkDY = -5; // Firework speed
    this.hue = (x / canvas.width) * 360; // Hue based on position
    this.phase = "letter";
    this.tick = 0;
    this.spawningTime = Math.random() * 30 + 30; // Random delay before firework (30-60 frames)
    this.particles = [];
  }

  update() {
    this.tick++;

    if (this.phase === "letter") {
      this.x += this.dx;
      this.y += this.dy;

      // Transition to firework after delay
      if (this.tick > this.spawningTime) {
        this.phase = "firework";
        this.tick = 0;
      }
    } else if (this.phase === "firework") {
      this.y += this.fireworkDY;
      this.fireworkDY += 0.1; // Gravity

      // Create particles for explosion
      if (this.fireworkDY >= 0 && this.particles.length === 0) {
        for (let i = 0; i < 20; i++) {
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 4, // Random velocity (-2 to 2)
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            size: Math.random() * 3 + 2 // Random size (2-5)
          });
        }
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity for particles
        p.alpha -= 0.02; // Fade out
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  draw() {
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (this.phase === "letter") {
      ctx.fillStyle = `hsl(${this.hue}, 80%, 50%)`;
      ctx.fillText(this.char, this.x, this.y);
    } else if (this.phase === "firework") {
      // Draw firework trail
      if (this.fireworkDY < 0) {
        ctx.fillStyle = `hsl(${this.hue}, 80%, 80%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Draw particles
      this.particles.forEach(p => {
        ctx.fillStyle = `hsla(${this.hue}, 80%, 50%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  isDone() {
    return this.phase === "firework" && this.particles.length === 0;
  }
}

// Initialize letters
function init() {
  ctx.font = `${fontSize}px Arial`;
  const textWidth = ctx.measureText(message).width;
  let xOffset = (canvas.width - textWidth) / 2;

  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const charWidth = ctx.measureText(char).width;
    const x = xOffset + charWidth / 2;
    const y = canvas.height / 2;
    letters.push(new Letter(char, x, y));
    xOffset += charWidth;
  }
}

// Animation loop
function animate() {
  // Clear canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Slight fade for trailing effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw letters
  for (let i = letters.length - 1; i >= 0; i--) {
    const letter = letters[i];
    letter.update();
    letter.draw();
    if (letter.isDone()) {
      letters.splice(i, 1); // Remove letter when done
    }
  }

  requestAnimationFrame(animate);
}

// Start the animation
init();
animate();
