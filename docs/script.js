/**
 * Interactive Script for "For My Love" Mood Booster Experience
 * Features:
 * - Floating Heart Canvas Background
 * - Web Audio API Synthesized Romantic Chimes
 * - Dynamic Mood Comfort Engine
 * - 5-Second Super Hug Meter (Touch & Mouse Support)
 * - 3D Flip Card Interactions
 * - Instant Affirmation Generator & Clipboard Copy
 * - Wax Seal Envelope Animation
 * - Infinite Love Burst Confetti & Sound
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. Web Audio API Sound Synthesizer (Zero External Assets Needed)
    // -------------------------------------------------------------------------
    let soundEnabled = true;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playChime(freq = 523.25, type = "sine", duration = 0.6) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            // Exponential decay for soft gentle chime
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("Audio not allowed yet:", e);
        }
    }

    function playChord(freqs = [523.25, 659.25, 783.99, 1046.50]) {
        if (!soundEnabled) return;
        freqs.forEach((f, idx) => {
            setTimeout(() => playChime(f, "sine", 0.8), idx * 70);
        });
    }

    // Sound toggle button
    const soundBtn = document.getElementById("sound-btn");
    const soundIcon = document.getElementById("sound-icon");
    const soundText = document.getElementById("sound-text");

    soundBtn.addEventListener("click", () => {
        initAudio();
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIcon.textContent = "🔔";
            soundText.textContent = "Sound: ON";
            playChord([659.25, 783.99, 1046.50]);
        } else {
            soundIcon.textContent = "🔕";
            soundText.textContent = "Sound: OFF";
        }
    });

    // -------------------------------------------------------------------------
    // 2. Ambient Floating Hearts Canvas
    // -------------------------------------------------------------------------
    const canvas = document.getElementById("ambient-canvas");
    const ctx = canvas.getContext("2d");
    let hearts = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class HeartParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 0.9 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.45 + 0.15;
            this.hue = Math.random() > 0.4 ? 340 : 280; // Pink / Purple
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = `hsla(${this.hue}, 85%, 65%, ${this.opacity})`;
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            // Draw heart path
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
            ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Spawn 28 ambient particles
    for (let i = 0; i < 28; i++) {
        const h = new HeartParticle();
        h.y = Math.random() * canvas.height;
        hearts.push(h);
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            h.update();
            h.draw();
        });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // -------------------------------------------------------------------------
    // 3. Sparkle / Confetti Helper
    // -------------------------------------------------------------------------
    function triggerConfettiBurst(x = 0.5, y = 0.6) {
        if (typeof confetti === "function") {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { x, y },
                colors: ["#ff4d8d", "#ff2a6d", "#9d4edd", "#ffd166", "#ffffff"],
                disableForReducedMotion: true
            });
        }
    }

    document.getElementById("sparkle-btn").addEventListener("click", (e) => {
        playChord([523.25, 659.25, 783.99, 1046.50]);
        triggerConfettiBurst(0.85, 0.2);
    });

    // -------------------------------------------------------------------------
    // 4. Dynamic Mood Check-in System
    // -------------------------------------------------------------------------
    const moodData = {
        stressed: {
            icon: "💆‍♀️🌸",
            title: "Take A Deep Breath, You've Got This",
            message: "You don't have to carry the whole world on your shoulders today. Drop your shoulders, unclamp your jaw, and take one slow, peaceful breath. Everything will be okay, and I am right here with you.",
            actionText: "Send Relaxing Vibe 🌿"
        },
        tired: {
            icon: "☕🧸",
            title: "Time For Gentle Rest & Comfort",
            message: "You have worked so hard. Put on cozy clothes, relax your mind, and let yourself rest without any guilt. You deserve all the pampering in the world.",
            actionText: "Give Warm Hug 🤗"
        },
        okay: {
            icon: "✨💖",
            title: "Let's Make Today A Little Brighter",
            message: "Even on ordinary days, you bring so much warmth and light into life. Here's a little reminder that you are deeply appreciated and loved.",
            actionText: "Send Love Burst 💫"
        },
        happy: {
            icon: "🥳🌟",
            title: "Your Happiness Is My Favorite Thing",
            message: "Seeing you happy and peaceful makes everything in the world feel right! Keep shining that gorgeous smile of yours!",
            actionText: "Celebrate Together 🎉"
        },
        missing: {
            icon: "💌❤️",
            title: "I Miss You Even More!",
            message: "No matter how many hours in the day, I am always thinking of you and looking forward to being right by your side.",
            actionText: "Send Giant Hug 🫂"
        },
        need_hug: {
            icon: "🫂💖",
            title: "Wrapping You In The Biggest Hug",
            message: "Consider yourself tightly hugged right this second. Safe, warm, loved, and protected. You mean everything to me.",
            actionText: "Activate Super Hug Meter 👇"
        }
    };

    const moodCards = document.querySelectorAll(".mood-card");
    const responseBox = document.getElementById("mood-response-box");
    const respIcon = document.getElementById("resp-icon");
    const respTitle = document.getElementById("resp-title");
    const respMessage = document.getElementById("resp-message");
    const respAction = document.getElementById("resp-action");

    moodCards.forEach(card => {
        card.addEventListener("click", () => {
            moodCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            const moodKey = card.dataset.mood;
            const data = moodData[moodKey] || moodData.okay;

            respIcon.textContent = data.icon;
            respTitle.textContent = data.title;
            respMessage.textContent = data.message;

            respAction.innerHTML = `
                <button class="btn btn-primary" id="mood-action-btn">
                    ${data.actionText}
                </button>
            `;

            responseBox.classList.remove("hidden");
            playChord([587.33, 739.99, 880.00]);
            triggerConfettiBurst(0.5, 0.4);

            document.getElementById("mood-action-btn").addEventListener("click", () => {
                playChord([659.25, 830.61, 987.77, 1318.51]);
                triggerConfettiBurst(0.5, 0.5);
                const hugSection = document.querySelector(".hug-meter-section");
                hugSection.scrollIntoView({ behavior: "smooth" });
            });
        });
    });

    // -------------------------------------------------------------------------
    // 5. The 5-Second Super Hug Meter
    // -------------------------------------------------------------------------
    const hugBtn = document.getElementById("hug-hold-btn");
    const hugCircle = document.getElementById("hug-progress-circle");
    const hugStatus = document.getElementById("hug-status");
    const hugLabel = document.getElementById("hug-btn-label");

    const circleCircumference = 2 * Math.PI * 70; // 439.82
    let holdStartTime = 0;
    let holdInterval = null;
    const requiredHoldTime = 4500; // 4.5 seconds

    function startHolding(e) {
        if (e) e.preventDefault();
        initAudio();
        hugBtn.classList.add("holding");
        holdStartTime = Date.now();
        hugStatus.textContent = "Charging up your warm hug... Hold tight! 💖";
        hugStatus.style.color = "var(--primary-pink)";

        playChime(440, "sine", 0.2);

        holdInterval = setInterval(() => {
            const elapsed = Date.now() - holdStartTime;
            const progress = Math.min(elapsed / requiredHoldTime, 1);
            const offset = circleCircumference - (progress * circleCircumference);
            hugCircle.style.strokeDashoffset = offset;

            // Pitch climbs as you hold
            if (elapsed % 600 < 50) {
                playChime(440 + (progress * 400), "sine", 0.15);
            }

            if (progress >= 1) {
                completeHug();
            }
        }, 30);
    }

    function stopHolding() {
        if (!holdStartTime) return;
        clearInterval(holdInterval);
        hugBtn.classList.remove("holding");
        hugCircle.style.strokeDashoffset = circleCircumference;
        
        if (Date.now() - holdStartTime < requiredHoldTime) {
            hugStatus.textContent = "Hold for the full 5 seconds to complete your hug!";
            hugStatus.style.color = "var(--text-secondary)";
        }
        holdStartTime = 0;
    }

    function completeHug() {
        clearInterval(holdInterval);
        holdStartTime = 0;
        hugBtn.classList.remove("holding");
        hugCircle.style.strokeDashoffset = 0;

        hugLabel.textContent = "HUG SENT! 🥰";
        hugStatus.textContent = "🎉 Virtual Hug Successfully Delivered with 100% Pure Love!";
        hugStatus.style.color = "var(--accent-gold)";

        playChord([523.25, 659.25, 783.99, 1046.50, 1318.51]);

        // Celebration Confetti
        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } });
            setTimeout(() => {
                confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
            }, 250);
        }

        setTimeout(() => {
            hugLabel.textContent = "HOLD ME";
            hugCircle.style.strokeDashoffset = circleCircumference;
        }, 5000);
    }

    hugBtn.addEventListener("mousedown", startHolding);
    window.addEventListener("mouseup", stopHolding);
    hugBtn.addEventListener("touchstart", startHolding, { passive: false });
    window.addEventListener("touchend", stopHolding);

    // Hero quick hug button
    document.getElementById("quick-hug-btn").addEventListener("click", () => {
        document.querySelector(".hug-meter-section").scrollIntoView({ behavior: "smooth" });
        startHolding();
        setTimeout(completeHug, 1000);
    });

    // -------------------------------------------------------------------------
    // 6. Flip Cards Tap Interaction
    // -------------------------------------------------------------------------
    const flipCards = document.querySelectorAll(".flip-card");
    flipCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
            playChime(659.25, "sine", 0.4);
        });
    });

    // -------------------------------------------------------------------------
    // 7. Instant Sweet Message / Affirmation Generator
    // -------------------------------------------------------------------------
    const compliments = [
        "Your smile is honestly my favorite sight in the entire world. ✨",
        "You are so remarkably capable, intelligent, and strong. Don't ever doubt yourself! 👑",
        "The world is simply a warmer and better place because you are in it. 🌸",
        "Thank you for being my favorite person to talk to, laugh with, and do life with. 💖",
        "Whatever challenge is on your mind today — you are bigger and stronger than it. 💪",
        "You make loving you the easiest and sweetest thing in the world. 🌹",
        "Just a reminder: I am so endlessly proud of everything you do. 🌟",
        "Your laugh is my favorite sound track. Never stop smiling! 🎶",
        "No matter what happens today, remember someone loves you unconditionally. ❤️",
        "You have a heart of pure gold, and I am the luckiest person to have you. 💝"
    ];

    const boosterText = document.getElementById("booster-text");
    const generateBtn = document.getElementById("generate-compliment-btn");
    const copyBtn = document.getElementById("copy-note-btn");
    let currentComplimentIdx = 0;

    generateBtn.addEventListener("click", () => {
        let newIdx;
        do {
            newIdx = Math.floor(Math.random() * compliments.length);
        } while (newIdx === currentComplimentIdx && compliments.length > 1);

        currentComplimentIdx = newIdx;
        boosterText.style.opacity = 0;
        playChord([587.33, 739.99, 880.00]);

        setTimeout(() => {
            boosterText.textContent = `"${compliments[currentComplimentIdx]}"`;
            boosterText.style.opacity = 1;
            triggerConfettiBurst(0.5, 0.7);
        }, 200);
    });

    copyBtn.addEventListener("click", () => {
        const textToCopy = boosterText.textContent.replace(/"/g, '');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ Copied to Clipboard!";
            playChime(880, "sine", 0.3);
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    // -------------------------------------------------------------------------
    // 8. Wax Seal Love Letter Interaction
    // -------------------------------------------------------------------------
    const envelope = document.getElementById("envelope");
    const waxSeal = document.getElementById("wax-seal");
    const dateElement = document.getElementById("letter-current-date");

    if (dateElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    waxSeal.addEventListener("click", () => {
        envelope.classList.add("opened");
        playChord([523.25, 659.25, 783.99, 1046.50, 1318.51]);
        triggerConfettiBurst(0.5, 0.5);
    });

    // -------------------------------------------------------------------------
    // 9. Grand Finale Love Counter
    // -------------------------------------------------------------------------
    let loveCount = 1000000;
    const loveCounterEl = document.getElementById("love-counter");
    const sendLoveBtn = document.getElementById("send-love-burst-btn");

    sendLoveBtn.addEventListener("click", () => {
        loveCount += 10000;
        loveCounterEl.textContent = loveCount.toLocaleString();
        
        loveCounterEl.style.transform = "scale(1.15)";
        setTimeout(() => {
            loveCounterEl.style.transform = "scale(1)";
        }, 150);

        playChord([659.25, 830.61, 987.77, 1318.51, 1567.98]);

        // Dual side confetti cannons
        if (typeof confetti === "function") {
            confetti({ particleCount: 75, angle: 60, spread: 70, origin: { x: 0.1, y: 0.7 } });
            confetti({ particleCount: 75, angle: 120, spread: 70, origin: { x: 0.9, y: 0.7 } });
        }
    });
});
