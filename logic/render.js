/**
 * Component Renderer
 * Generates a section block with the standard grid and card style
 */
function createSection(key, data) {
    const section = document.createElement('section');
    section.className = 'content-section';
    
    let cardsHtml = data.items.map(item => `
        <article class="repo-card">
            <span class="repo-tag ${item.class}">${item.tag}</span>
            <h3>${item.h3}</h3>
            <p>${item.p}</p>
            <a href="${item.url}" class="repo-link">${item.link}</a>
        </article>
    `).join('');

    section.innerHTML = `
        <h2 class="section-label">${data.title}</h2>
        <div class="repos-grid">${cardsHtml}</div>
    `;
    return section;
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

async function runTerminal(sequence) {
    const container = document.getElementById('terminal-content');
    for (const item of sequence) {
        const line = document.createElement('div');
        if (item.type === "command") {
            if (item.host == "") item.host = "dev";
            line.innerHTML = `<span class="terminal-prompt">aoscarius@${item.host}:~$ </span><span class="cmd-text"></span>`;
            container.appendChild(line);
            const cmdText = line.querySelector('.cmd-text');
            for (let char of item.text) {
                cmdText.textContent += char; // textContent preserves spaces
                await new Promise(r => setTimeout(r, 40));
                container.scrollTop = container.scrollHeight; // Auto-scroll durante il typing
            }
            await new Promise(r => setTimeout(r, 500));
        } else {
            const output = document.createElement('div');
            output.className = 'terminal-output';
            output.innerText = item.text;
            container.appendChild(output);
            container.scrollTop = container.scrollHeight; // Auto-scroll dopo output
            await new Promise(r => setTimeout(r, 600));
        }
        if (item === sequence[sequence.length - 1]) {
            line.innerHTML += `<span class="terminal-cursor"></span>`;
            container.scrollTop = container.scrollHeight;
        }
    }
}

// Theme Switch Logic
document.getElementById("theme-toggle").onclick = () => {
    const root = document.documentElement;
    const target = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", target);
};

window.onload = bootstrap;
