/**
 * Home folder content map
 */
const folderList = {
  'script.sh': {
    man: 'Simulate running a shell script and display a custom message.',
    output: 'Running script.sh...\nCustom logic.'
  },
  'doom': {
    man: 'Start a simple demo of doom shareware in webasm.',
    handler() {
      return '... coming soon ...';
    }
  },
}

/**
 * Terminal commands map
 */
const cmdList = {
  clear: {
    man: 'Remove all previous terminal output and start with a fresh prompt.',
    action: 'clear'
  },

  echo: {
    man: 'Repeat the provided text back to the terminal exactly as entered.',
    args: '<text>',
    output: '{{args}}'
  },

  ls : {
    man: 'Return an ordered list of the home folder content.',
    handler() {
      return Object.keys(folderList)
        .sort()
        .map(name => {
          const rndDate = new Date(new Date(2024, 0, 1).getTime() + Math.random() * (Date.now() - new Date(2024, 0, 1).getTime())).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
          return `drwxr-xr-x 1 aoscarius aoscarius  4096 ${rndDate} ${name}`;
        })
        .join('\n');
    }
  },

  cat : {
    man: 'Return the content of a file in the home folder.',
    args: '<file>',
    handler({ args }) {
      const arg0 = args[0];
      const content = folderList[arg0];
      if (!content) {
        return `File not found: ${arg0}`;
      }

      // Convert to string map content
      const output = JSON.stringify(content, (key, value) => {
        if (typeof value === 'function') {
          return value.toString();
        }
        return value;
      }, 2);

      return `${output}`;
    }
  },
  
  help: {
    man: 'List all available commands and display a short description for each one.',
    args: '[name]',
    handler({ args }) {
      const arg0 = args[0];
      if (!arg0) {
        return Object.keys(cmdList)
          .sort()
          .map(name => {
            if (!name.startsWith('./')){
              const cmd = cmdList[name];
              return `${name} ${cmd.args || ''}\n${cmd.man || 'No manual available.'}`;
            }
          })
          .join('\n\n');
      }

      const cmd = cmdList[arg0];
      if (!cmd) {
        return `Command not found: ${arg0}`;
      }

      return `Usage: ${arg0} ${cmd.args || ''}`;
    }
  },

  man: {
    man: 'Show detailed help text for the specified command.',
    args: '<command>',
    handler({ args }) {
      const arg0 = args[0];
      if (!arg0) {
        return 'Usage: man <command>';
      }

      const cmd = cmdList[arg0];
      if (!cmd) {
        return `Command not found: ${arg0}`;
      }

      return `${arg0} ${cmd.args || ''}: ${cmd.man || 'No manual available.'}`;
    }
  },

  sum: {
    man: 'Add two numeric values and print their sum.',
    args: '<a> <b>',
    handler({ args }) {
      const a = Number(args[0] || 0);
      const b = Number(args[1] || 0);
      return `Result: ${a + b}`;
    }
  },

  greet: {
    man: 'Print a friendly greeting using the first argument as the name.',
    args: '<name>',
    handler({ args }) {
      return `Hello ${args[0] || 'guest'}, welcome!`;
    }
  },

  eggs: {
    man: 'Show hidden easter eggs full list. If a egg passed, execute it with keypress emulation.',
    args: '[eggkey]',
    handler({ args }) {
      // If args execute selected egg
      const arg0 = args[0];
      if (arg0) {
        const egg = CHEATS[arg0.toUpperCase()];
        if (egg) {
          for (let char in egg.kb) {
            window.dispatchEvent(new KeyboardEvent('keydown', {key: egg.kb[char], bubbles: true, cancelable: true}));
          }
          return `${arg0} successfully executed`;
        }
        return `${arg0} not found`;
      }

      // If no args list all
      const output = JSON.stringify(CHEATS, (key, value) => {
        if (typeof value === 'function') {
          return value.toString();
        }
        return value;
      }, 2);

      return `Avaiable easter eggs:\n${output}`;
    }
  },
};