/**
 * AOSCARIUS - Easter Egg Controller
 * Cheats: IDDQD (God), KOMBAT (Fatality), MARCO (Matrix)
 * Logic: Fully viewport-locked, non-destructive (no page reload)
 */

(function() {
    // Sequence Definitions
    const CHEATS = {
        GOD: { kb: "IDDQD", pad: "UPUPDOWNDOWNAB" }, // DOOM
        FATALITY: { kb: "KOMBAT", pad: "RIGHTLEFTRIGHTLEFTBA" }, // Mortal Kombat
        MATRIX: { kb: "MARCO", pad: "UPRIGHTDOWNLEFTAA" }, // Matrix
        BTTF: { kb: "OUTATIME", pad: "UPUPDOWNRIGHTAB" }, // Back to the Future
        GHOST: { kb: "SLIMER", pad: "LEFTLEFTUPRIGHTBB" }  // Ghostbusters
    };

    let inputBuffer = "";
    let lastKeyTime = Date.now();
    const TIMEOUT = 1500;

    // Helper: Notify Terminal Component and Console
    function logCheatStatus(msg) {
        console.log(`%c[CORE_OVERRIDE]: ${msg}`, 'color: #ff0000; font-weight: bold; font-size: 12px;');
        const term = document.getElementById('terminal-content');
        if (term) {
            const line = document.createElement('div');
            line.className = 'terminal-output';
            line.style.color = '#ff3e3e';
            line.innerHTML = `<br>>> [SYS_ALERT]: UNAUTHORIZED_ACCESS_DETECTED<br>>> [LOG]: ${msg}`;
            term.appendChild(line);
            term.scrollTop = term.scrollHeight;
        }
    }

    // Audio Engine: Retro 8-bit Sound Generator
    function playSfx(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            
            if (type === 'god') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(120, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.4);
            } else if (type === 'fatality') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.5);
            } else {
                osc.type = 'sine';
                osc.frequency.value = 880;
            }

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
            osc.start(); osc.stop(ctx.currentTime + 1.2);
        } catch(e) { /* Audio policy block */ }
    }

    // Scroll Control
    function setLock(state) {
        if (state) document.body.classList.add('no-scroll');
        else document.body.classList.remove('no-scroll');
    }

    // --- EFFECT: GOD MODE ---
    function triggerGodMode() {
        logCheatStatus("GOD_MODE_ACTIVE");
        playSfx('god');
        setLock(true);

        const overlay = document.createElement('div');
        overlay.className = 'ee-overlay god-mode-active';
        overlay.style.display = 'flex';
        overlay.innerHTML = `<h1>GOD MODE</h1>`;
        document.body.appendChild(overlay);

        // Visual glitch filter
        // document.body.style.filter = "kombatinvert(1) contrast(2) grayscale(1)";

        setTimeout(() => {
            // document.body.style.filter = originalFilter || "none";
            overlay.remove();
            setLock(false);
            logCheatStatus("GOD_MODE_DEACTIVATED");
        }, 4000);
    }

    // --- EFFECT: FATALITY ---
    function triggerFatality() {
        logCheatStatus("FATALITY_PROTOCOL_IN_PROGRESS");
        playSfx('fatality');
        setLock(true);

        const overlay = document.createElement('div');
        overlay.className = 'ee-overlay fatality-active';
        overlay.style.display = 'flex';
        overlay.innerHTML = `<h1 class="fatality-text">FATALITY<span class="drop"></span><span class="drop"></span><span class="drop"></span><span class="drop"></span><span class="drop"></span></h1>`;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                overlay.remove();
                setLock(false);
                logCheatStatus("FATALITY_CLEANUP_SUCCESS");
            }, 1000);
        }, 3500);
    }

    // --- EFFECT: MATRIX ---
    function triggerMatrix() {
        logCheatStatus("MATRIX_SIMULATION_ACTIVE");
        setLock(true);
        const canvas = document.createElement('canvas');
        canvas.style.cssText = "position:fixed;top:0;left:0;z-index:999998;background:black;";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const drops = Array(Math.floor(canvas.width / 16)).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0F0";
            ctx.font = "16px monospace";
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 16, y * 16);
                if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        };
        const interval = setInterval(draw, 33);
        setTimeout(() => {
            clearInterval(interval);
            canvas.remove();
            setLock(false);
            logCheatStatus("MATRIX_EXIT_SIGNAL_RECEIVED");
        }, 5000);
    }

    // --- EFFECT: BACK TO THE FUTURE ---
    function triggerBTTF() {
        logCheatStatus("TEMPORAL_FLUX_DETECTION_88MPH");
        const tracks = document.createElement('div');
        tracks.className = 'bttf-tracks';
        // Fire tracks
        tracks.innerHTML = `<div class="fire-track left"></div><div class="fire-track right"></div><h1 class="bttf-year">1985</h1>`;
        document.body.appendChild(tracks);

        // White flash (temporal jump)
        const flash = document.createElement('div');
        flash.className = 'time-flash';
        document.body.appendChild(flash);

        setTimeout(() => {
            tracks.remove();
            flash.remove();
            logCheatStatus("PRESENT_DAY_RESTORED");
        }, 4000);
    }

    // --- EFFECT: GHOSTBUSTERS ---
    function triggerGhostbusters() {
        logCheatStatus("PKE_VALENCE_RISING");
        const stream = document.createElement('div');
        stream.className = 'proton-stream';
        document.body.appendChild(stream);
        
        setTimeout(() => {
            stream.remove();
            logCheatStatus("GHOST_TRAPPED_SUCCESS");
        }, 3500);
    }

    // --- INPUT HANDLING ---
    function evaluateBuffer() {
        const buffer = inputBuffer.toUpperCase();
        if (buffer.endsWith(CHEATS.GOD.kb) || buffer.endsWith(CHEATS.GOD.pad)) {
            triggerGodMode(); inputBuffer = "";
        } else if (buffer.endsWith(CHEATS.FATALITY.kb) || buffer.endsWith(CHEATS.FATALITY.pad)) {
            triggerFatality(); inputBuffer = "";
        } else if (buffer.endsWith(CHEATS.MATRIX.kb) || buffer.endsWith(CHEATS.MATRIX.pad)) {
            triggerMatrix(); inputBuffer = "";
        } else if (buffer.endsWith(CHEATS.BTTF.kb) || buffer.endsWith(CHEATS.BTTF.pad)) {
            triggerBTTF(); inputBuffer = "";
        } else if (buffer.endsWith(CHEATS.GHOST.kb) || buffer.endsWith(CHEATS.GHOST.pad)) {
            triggerGhostbusters(); inputBuffer = "";
        }
    }

    window.addEventListener('keydown', (e) => {
        const now = Date.now();
        if (now - lastKeyTime > TIMEOUT) inputBuffer = "";
        inputBuffer += e.key.toUpperCase();
        lastKeyTime = now;
        evaluateBuffer();
    });

    window.mobilePress = function(key) {
        if (navigator.vibrate) navigator.vibrate(25);
        const now = Date.now();
        if (now - lastKeyTime > TIMEOUT) inputBuffer = "";
        inputBuffer += key;
        lastKeyTime = now;
        evaluateBuffer();
    };
})();