/**
 * Component Renderer
 * Generates a section block with the standard grid and card style
 */
function createSection(key, data) {
    const section = document.createElement('section');
    section.className = 'content-section';
    
    let cardsHtml = data.items.map(item => {
        const linksHtml = item.links.map(linkObj => `
            <a href="${linkObj.url}" class="repo-link">${linkObj.link}</a>
        `).join(' ');
        return `
            <article class="repo-card">
                <span class="repo-tag ${item.class}">${item.tag}</span>
                <h3>${item.h3}</h3>
                <p>${item.p}</p>
                <div class="repo-links-container">
                    ${linksHtml}
                </div>
            </article>
        `;
    }).join('');

    section.innerHTML = `
        <h2 class="section-label">${data.title}</h2>
        <div class="repos-grid">${cardsHtml}</div>
    `;
    return section;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

/**
 * Main Bootstrapping
 */
async function bootstrap() {
    try {
        // Parallel fetching
        const [termRes, sectRes] = await Promise.all([
            fetch('data/terminal.json'),
            fetch('data/sections.json')
        ]);

        await loadScript('logic/commands.js');

        const termData = await termRes.json();
        const sectData = await sectRes.json();

        // Immediate UI Population (No waiting for terminal)
        const mountPoint = document.getElementById('dynamic-sections');
        Object.keys(sectData).forEach(key => {
            mountPoint.appendChild(createSection(key, sectData[key]));
        });

        // Start Terminal Animation in background
        runTerminal(termData.sequence);

    } catch (err) {
        console.error("Critical System Boot Failure:", err);
    }
}

/**
 * Terminal section
 */
async function runTerminal(sequence) {
    const container = document.getElementById('terminal-content');
    for (const item of sequence) {
        const line = document.createElement('div');
        if (item.type === "command") {
            if (item.host == "") item.host = "dev";
            line.innerHTML = `<span class="terminal-prompt">aoscarius@${item.host}:~$ </span><span class="cmd-text"></span><span class="terminal-cursor"></span>`;
            container.appendChild(line);
            const cmdText = line.querySelector('.cmd-text');
            for (let char of item.text) {
                cmdText.textContent += char; // textContent preserves spaces
                await new Promise(r => setTimeout(r, 40));
                container.scrollTop = container.scrollHeight; // Auto-scroll durante il typing
            }
            await new Promise(r => setTimeout(r, 500));
            const cursor = line.querySelector('.terminal-cursor');
            if (cursor) cursor.remove();
        } else {
            const output = document.createElement('div');
            output.className = 'terminal-output';
            output.innerText = item.text;
            container.appendChild(output);
            container.scrollTop = container.scrollHeight; // Auto-scroll dopo output
            await new Promise(r => setTimeout(r, 600));
        }
        if (item === sequence[sequence.length - 1]) {
            container.scrollTop = container.scrollHeight;
            interactiveTerminal(item.host || 'dev');
        }
    }
}

/**
 * Interactive shell section
 */
function interactiveTerminal(host='dev') {
    const container = document.getElementById('terminal-content');
    const termContainer = container.closest('.terminal-container') || container;
    const fsToggle = document.getElementById('termFSToggle');
    const hiddenIn = document.getElementById('hiddenTermIn');
    if (!hiddenIn) return;

    hiddenIn.autocomplete = 'off';
    hiddenIn.autocapitalize = 'off';
    hiddenIn.spellcheck = false;
    hiddenIn.inputMode = 'text';
    hiddenIn.value = '';

    // Helpers
    const newInputLine = (host='dev') => {
        const line = document.createElement('div');
        line.innerHTML = `<span class="terminal-prompt">aoscarius@${host}:~$ </span><span class="cmd-text"></span><span class="terminal-cursor"></span>`;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
        return line;
    };

    const newOutputLines = (text) => {
        const lines = document.createElement('div');
        lines.className = 'terminal-output';
        lines.innerText = `\n${text}`;
        container.appendChild(lines);
        container.scrollTop = container.scrollHeight;
        return lines;
    };

    const renderTemplate = (template, ctx = {}) => {
        return template.replace(/\{\{(\w+)\}\}/g, (_, key) => ctx[key] ?? '');
    };

    const buildArgsContext = (args) => {
        const ctx = { args: args.join(' ') };
        args.forEach((value, index) => {ctx[`arg${index}`] = value;});
        return ctx;
    };

    // Start with a new prompt and empty output
    let currPrompt = newInputLine(host);

    const execCMD = (cmdstr) => {
        const command = cmdstr.trim();
        if (!command) {
            currPrompt = newInputLine(host);
            return;
        }

        const [name, ...args] = command.split(/\s+/);
        const cmdDef = name.startsWith('./') ? folderList[name.slice(2)] : cmdList[name];
        const ctx = buildArgsContext(args);

        if (name === '#') { 
            /* Skip comments (do nothing) */
        } else if (!cmdDef) {
            newOutputLines(`${name}: command not found`);
        } else if (cmdDef.action === 'clear') {
            container.innerHTML = '';
        } else if (typeof cmdDef.handler === 'function') {
            const result = cmdDef.handler({ 
                args, ctx, 
                write: newOutputLines, 
                clear: () => container.innerHTML = '' 
            });
            if (result !== undefined) newOutputLines(result);
        } else if (cmdDef.output) {
            newOutputLines(renderTemplate(cmdDef.output, ctx));
        }

        currPrompt = newInputLine(host);
    };

    // Listners logics
    hiddenIn.addEventListener("focusout", (e) => { 
        document.querySelector('.mobile-controls').classList.remove('hidden');
    });
    hiddenIn.addEventListener("focusin", (e) => { 
        document.querySelector('.mobile-controls').classList.add('hidden');
    });

    hiddenIn.addEventListener('input', () => {
        const textContainer = currPrompt.querySelector('.cmd-text');
        if (textContainer) {
            textContainer.textContent = hiddenIn.value;
            container.scrollTop = container.scrollHeight;
        }
    });

    hiddenIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cursor = currPrompt.querySelector('.terminal-cursor');
            if (cursor) cursor.remove();
            execCMD(hiddenIn.value);
            hiddenIn.value = '';
        }
    });

    fsToggle.addEventListener('click', () => {
        const enabled = !termContainer.classList.contains('fullscreen');
        termContainer.classList.toggle('fullscreen', enabled);
        container.scrollTop = container.scrollHeight;
        hiddenIn.focus();
    });

    container.addEventListener('click', () => {
        hiddenIn.focus();
    });
}

// Theme Switch Logic
document.getElementById("theme-toggle").onclick = () => {
    const root = document.documentElement;
    const target = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", target);
};

window.onload = bootstrap;
