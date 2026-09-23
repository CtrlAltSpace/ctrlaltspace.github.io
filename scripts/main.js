const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isHomeLink = href === '#home';
    const matches = (isHomeLink && id === 'home') || (href && href === `#${id}`);
    link.classList.toggle('active', matches);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    threshold: 0.35,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.style.display = expanded ? 'none' : 'flex';
  });
}

const terminalRoot = document.getElementById('terminal-root');

if (terminalRoot) {
  const terminalState = {
    interactive: false,
    enabled: false,
    history: [],
    historyIndex: -1,
    currentInput: '',
    cwd: '/home/guest',
    env: {
      HOME: '/home/guest',
      USER: 'guest',
      PWD: '/home/guest',
      HOSTNAME: 'ctrlaltspace',
      SHELL: '/bin/portal',
      TERM: 'xterm-256color',
    },
    aliases: {
      ll: 'ls -l',
      la: 'ls -la',
      '..': 'cd ..',
    },
  };

  const virtualFs = createVirtualFilesystem();

  function createVirtualFilesystem() {
    const root = { type: 'dir', entries: {} };

    const ensurePath = (path) => {
      const normalized = normalizePath(path);
      const parts = normalized.split('/').filter(Boolean);
      let current = root;

      parts.forEach((part) => {
        if (!current.entries[part]) {
          current.entries[part] = { type: 'dir', entries: {} };
        }
        current = current.entries[part];
      });

      return current;
    };

    const createFile = (path, contents = '') => {
      const normalized = normalizePath(path);
      const parentPath = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) || '/' : '/';
      const fileName = normalized.split('/').filter(Boolean).pop();
      const parent = parentPath === '/' ? root : ensurePath(parentPath);
      parent.entries[fileName] = { type: 'file', content: contents };
      return parent.entries[fileName];
    };

    const createDir = (path) => {
      const normalized = normalizePath(path);
      const parts = normalized.split('/').filter(Boolean);
      let current = root;

      parts.forEach((part) => {
        if (!current.entries[part]) {
          current.entries[part] = { type: 'dir', entries: {} };
        }
        current = current.entries[part];
      });

      return current;
    };

    const getNode = (path) => {
      const normalized = normalizePath(path);
      if (normalized === '/') return root;

      const parts = normalized.split('/').filter(Boolean);
      let current = root;

      for (const part of parts) {
        if (!current.entries || !current.entries[part]) {
          return null;
        }
        current = current.entries[part];
      }

      return current;
    };

    const deleteNode = (path) => {
      const normalized = normalizePath(path);
      const parentPath = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) || '/' : '/';
      const key = normalized.split('/').filter(Boolean).pop();
      const parent = getNode(parentPath);

      if (!parent || !parent.entries || !key || !parent.entries[key]) {
        return false;
      }

      delete parent.entries[key];
      return true;
    };

    const moveNode = (sourcePath, targetPath) => {
      const sourceNode = getNode(sourcePath);
      if (!sourceNode) return false;
      const targetParent = getNode(targetPath.includes('/') ? targetPath.slice(0, targetPath.lastIndexOf('/')) || '/' : '/');
      if (!targetParent || targetParent.type !== 'dir') return false;
      const fileName = normalizePath(targetPath).split('/').filter(Boolean).pop();
      if (!fileName) return false;
      deleteNode(sourcePath);
      targetParent.entries[fileName] = sourceNode;
      return true;
    };

    const ensureParent = (path) => {
      const normalized = normalizePath(path);
      const parentPath = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) || '/' : '/';
      return ensurePath(parentPath);
    };

    createDir('/home/guest');
    createDir('/home/guest/projects');
    createDir('/home/guest/projects/finance_manager');
    createDir('/home/guest/projects/captcha');
    createDir('/home/guest/projects/desktop_auto_tools');
    createDir('/home/guest/projects/annoying_site');
    createDir('/home/guest/projects/gem');
    createDir('/home/guest/projects/website');
    createDir('/home/guest/blog');
    createDir('/home/guest/docs');
    createFile('/home/guest/README.md', 'CtrlAltSpace Productions creates desktop applications, web projects, and silly stuff driven by creativity and curiosity.\n');
    createFile('/home/guest/about.txt', 'We are an indie software studio building tools and experiments with impact.\n');
    createFile('/home/guest/contact.txt', 'Email: ctrlaltspace.prod@proton.me\nGitHub: https://github.com/CtrlAltSpace\n');
    createFile('/home/guest/projects/README.md', 'Project directory for software experiments, tools, and release prototypes.\n');
    createFile('/home/guest/projects/finance_manager/README.md', 'A desktop app to help manage your finances.\n');
    createFile('/home/guest/projects/captcha/README.md', 'Computer Access Protection through Triggered Camera & Human Analysis\n');
    createFile('/home/guest/projects/desktop_auto_tools/README.md', 'Contains an autotyper, an autoscroller, and an autoclicker.\n');
    createFile('/home/guest/projects/annoying_site/README.md', 'A silly annoying website.\n');
    createFile('/home/guest/projects/gem/README.md', "Gem 💎, an AI assistant that's here to help you brainstorm, answer questions, and generally make your Discord experience smoother! 🤖\n");
    createFile('/home/guest/projects/website/README.md', 'This website is a personal portfolio and documentation space.\n');
    createFile('/home/guest/blog/README.md', 'Blog index and notes for experiments, ideas, and launch logs.\n');

    return { root, getNode, ensurePath, createFile, createDir, deleteNode, moveNode, ensureParent };
  }

  function normalizePath(path) {
    let raw = (path || '/').replace(/\\/g, '/');
    if (!raw) raw = '/';

    if (raw === '~' || raw.startsWith('~/')) {
      raw = `${terminalState.env.HOME}${raw.slice(1)}`;
    }

    if (!raw.startsWith('/')) {
      raw = `${terminalState.cwd}/${raw}`;
    }

    const segments = raw.split('/').filter(Boolean);
    const normalizedSegments = [];

    segments.forEach((segment) => {
      if (segment === '.' || segment === '') {
        return;
      }
      if (segment === '..') {
        normalizedSegments.pop();
        return;
      }
      normalizedSegments.push(segment);
    });

    const finalPath = `/${normalizedSegments.join('/')}`;
    return finalPath || '/';
  }

  function resolvePath(targetPath) {
    if (!targetPath || targetPath === '.') {
      return terminalState.cwd;
    }

    if (targetPath === '~') {
      return terminalState.env.HOME;
    }

    if (targetPath.startsWith('~')) {
      return normalizePath(targetPath);
    }

    if (targetPath.startsWith('/')) {
      return normalizePath(targetPath);
    }

    return normalizePath(`${terminalState.cwd}/${targetPath}`);
  }

  function getCurrentPrompt() {
    const home = terminalState.env.HOME;
    const current = terminalState.cwd;
    const short = current === home ? '~' : current.replace(home, '~');
    return `guest@${terminalState.env.HOSTNAME}:${short}$`;
  }

  function appendLog(message, className = 'system') {
    if (!terminalLog) return;
    const row = document.createElement('div');
    row.className = `terminal-line ${className}`;
    row.textContent = message;
    terminalLog.appendChild(row);
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  function stripQuotes(value) {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  }

  function evaluateArithmeticExpression(expression) {
    const source = String(expression || '');
    let index = 0;

    function skipWhitespace() {
      while (/\s/.test(source[index])) {
        index += 1;
      }
    }

    function parseNumber() {
      skipWhitespace();
      const rest = source.slice(index);
      const match = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);

      if (!match) {
        throw new Error('Expected number');
      }

      index += match[0].length;
      return Number(match[0]);
    }

    function parsePrimary() {
      skipWhitespace();

      if (source[index] === '(') {
        index += 1;
        const value = parseExpression();
        skipWhitespace();

        if (source[index] !== ')') {
          throw new Error('Expected closing parenthesis');
        }

        index += 1;
        return value;
      }

      return parseNumber();
    }

    function parseUnary() {
      skipWhitespace();

      if (source[index] === '+') {
        index += 1;
        return parseUnary();
      }

      if (source[index] === '-') {
        index += 1;
        return -parseUnary();
      }

      return parsePrimary();
    }

    function parseTerm() {
      let value = parseUnary();

      while (true) {
        skipWhitespace();
        const operator = source[index];

        if (operator !== '*' && operator !== '/' && operator !== '%') {
          break;
        }

        index += 1;
        const right = parseUnary();

        if (operator === '*') {
          value *= right;
        } else if (operator === '/') {
          value /= right;
        } else {
          value %= right;
        }
      }

      return value;
    }

    function parseExpression() {
      let value = parseTerm();

      while (true) {
        skipWhitespace();
        const operator = source[index];

        if (operator !== '+' && operator !== '-') {
          break;
        }

        index += 1;
        const right = parseTerm();
        value = operator === '+' ? value + right : value - right;
      }

      return value;
    }

    const value = parseExpression();
    skipWhitespace();

    if (index !== source.length || Number.isNaN(value)) {
      throw new Error('Invalid arithmetic expression');
    }

    return value;
  }

  function expandVariables(input) {
    let result = String(input || '');

    result = result.replace(/\$\(\(\s*([\s\S]*?)\s*\)\)/g, (match, expression) => {
      try {
        const sanitized = expression.replace(/\s+/g, ' ').trim();
        if (!sanitized) return match;

        const value = evaluateArithmeticExpression(sanitized);
        return Number.isFinite(value) ? String(value) : match;
      } catch (error) {
        return match;
      }
    });

    result = result.replace(/\$([A-Za-z_][A-Za-z0-9_]*)|\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, name1, name2) => {
      const key = name1 || name2;
      return terminalState.env[key] ?? '';
    });

    return result;
  }

  function prettifyPath(path) {
    const home = terminalState.env.HOME;
    return path === home ? '~' : path.replace(home, '~');
  }

  function listDirEntries(path) {
    const actualPath = resolvePath(path);
    const node = virtualFs.getNode(actualPath);

    if (!node || node.type !== 'dir') {
      return null;
    }

    return Object.keys(node.entries || {}).sort();
  }

  function expandGlob(pattern) {
    const absolute = resolvePath(pattern);
    const parentPath = absolute.includes('/') ? absolute.slice(0, absolute.lastIndexOf('/')) || '/' : '/';
    const partial = absolute.split('/').filter(Boolean).pop() || '*';
    const parentEntries = listDirEntries(parentPath) || [];
    const patternRegex = new RegExp(`^${partial.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`);

    return parentEntries.filter((entry) => patternRegex.test(entry)).map((entry) => `${parentPath === '/' ? '/' : parentPath}/${entry}`.replace(/\/+/g, '/'));
  }

  function tokenizeInput(rawInput) {
    const tokens = [];
    let current = '';
    let quote = null;
    let escaped = false;

    for (let index = 0; index < rawInput.length; index += 1) {
      const char = rawInput[index];

      if (char === '$' && rawInput.slice(index, index + 3) === '$((') {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }

        let expression = '$((';
        let depth = 2;
        index += 3;

        while (index < rawInput.length && depth > 0) {
          const nextChar = rawInput[index];
          expression += nextChar;

          if (nextChar === '(') {
            depth += 1;
          } else if (nextChar === ')') {
            depth -= 1;
          }

          index += 1;
        }

        tokens.push(expression);
        continue;
      }

      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }

      if (char === '\\' && quote !== "'") {
        escaped = true;
        continue;
      }

      if (char === '"' || char === "'") {
        if (quote === char) {
          quote = null;
        } else if (!quote) {
          quote = char;
        } else {
          current += char;
        }
        continue;
      }

      if (!quote && ['|', '&', ';', '>', '<'].includes(char)) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }
        if (char === '>' && rawInput[index + 1] === '>') {
          tokens.push('>>');
          index += 1;
        } else if (char === '&' && rawInput[index + 1] === '&') {
          tokens.push('&&');
          index += 1;
        } else if (char === '|' && rawInput[index + 1] === '|') {
          tokens.push('||');
          index += 1;
        } else {
          tokens.push(char);
        }
        continue;
      }

      if (!quote && /\s/.test(char)) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      tokens.push(current.trim());
    }

    return tokens.filter(Boolean);
  }

  function suggestClosestCommand(input) {
    const commands = [
      'help', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'history', 'alias', 'unalias', 'env',
      'export', 'uname', 'hostname', 'whoami', 'date', 'printf', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'find',
      'tree', 'less', 'cp', 'mv', 'rm', 'open', 'goto', 'theme', 'resume', 'home', 'coffee', 'ls', 'pwd', 'env',
    ];

    const normalized = input.toLowerCase();
    const matches = commands.filter((command) => command.startsWith(normalized));

    if (matches.length) {
      return matches.slice(0, 3);
    }

    return commands.filter((command) => command.includes(normalized)).slice(0, 3);
  }

  function getAliasExpanded(commandName, args) {
    const aliasMap = terminalState.aliases;
    if (!aliasMap[commandName]) {
      return { name: commandName, args };
    }

    const aliasValue = aliasMap[commandName];
    const expandedTokens = tokenizeInput(`${aliasValue} ${args.join(' ')}`);
    return { name: expandedTokens[0], args: expandedTokens.slice(1) };
  }

  function executeBuiltinCommand(commandName, args, inputText = '') {
    const name = commandName.toLowerCase();
    const commandWithArgs = args.join(' ');

    if (name === 'help') {
      return `Available commands: help, pwd, ls, cd, mkdir, touch, cat, echo, clear, history, alias, unalias, env, export, uname, hostname, whoami, date, printf, grep, head, tail, wc, sort, uniq, find, tree, less, cp, mv, rm, open, goto, theme, resume, home`;
    }

    if (name === 'pwd') {
      return terminalState.cwd;
    }

    if (name === 'which' || name === 'type') {
      if (!args.length) {
        return `${name}: missing argument`;
      }

      const target = args[0];
      const builtins = [
        'help', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'history', 'alias', 'unalias', 'env',
        'export', 'uname', 'hostname', 'whoami', 'date', 'printf', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'find',
        'tree', 'less', 'cp', 'mv', 'rm', 'open', 'goto', 'theme', 'resume', 'home', 'which', 'type', 'true', 'false',
        'ps', 'jobs', 'sleep', 'basename', 'dirname', 'realpath', 'stat', 'clear'
      ];

      if (builtins.includes(target)) {
        return `${target} is a shell builtin`;
      }

      return `${target}: not found`;
    }

    if (name === 'hostname') {
      return terminalState.env.HOSTNAME;
    }

    if (name === 'whoami') {
      return terminalState.env.USER;
    }

    if (name === 'uname') {
      return 'Linux ctrlaltspace 6.8.0-101-generic #1';
    }

    if (name === 'date') {
      return new Date().toString();
    }

    if (name === 'env') {
      return Object.entries(terminalState.env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    }

    if (name === 'export') {
      if (!args.length) {
        return 'Usage: export NAME=value';
      }

      const assignment = args.join(' ');
      const match = assignment.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) {
        return `export: invalid assignment: ${assignment}`;
      }

      terminalState.env[match[1]] = expandVariables(match[2]);
      if (match[1] === 'PWD') {
        terminalState.cwd = terminalState.env.PWD;
      }
      return '';
    }

    if (name === 'echo') {
      return args.map((arg) => expandVariables(stripQuotes(arg))).join(' ');
    }

    if (name === 'expr') {
      const expression = args.join(' ');
      try {
        return String(evaluateArithmeticExpression(expression));
      } catch (error) {
        return `expr: invalid expression: ${expression}`;
      }
    }

    if (name === 'printf') {
      const formatString = args[0] || '';
      const escaped = formatString
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r');
      return escaped + args.slice(1).join(' ');
    }

    if (name === 'history') {
      return terminalState.history.length ? terminalState.history.join('\n') : '';
    }

    if (name === 'clear' || name === 'cls') {
      terminalLog.innerHTML = '';
      return '';
    }

    if (name === 'alias') {
      if (!args.length) {
        return Object.entries(terminalState.aliases).map(([key, value]) => `${key}='${value}'`).join('\n');
      }

      const assignment = args.join(' ');
      const match = assignment.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) {
        return `alias: invalid alias definition: ${assignment}`;
      }

      terminalState.aliases[match[1]] = stripQuotes(match[2]);
      return '';
    }

    if (name === 'unalias') {
      if (!args.length) {
        return 'Usage: unalias NAME';
      }

      const target = args[0];
      if (!terminalState.aliases[target]) {
        return `unalias: ${target}: not found`;
      }

      delete terminalState.aliases[target];
      return '';
    }

    if (name === 'cd') {
      const target = args[0] || terminalState.env.HOME;
      const nextPath = resolvePath(target);
      const nextNode = virtualFs.getNode(nextPath);

      if (!nextNode || nextNode.type !== 'dir') {
        return `cd: ${target}: No such file or directory`;
      }

      terminalState.cwd = nextPath;
      terminalState.env.PWD = nextPath;
      return '';
    }

    if (name === 'pwd') {
      return terminalState.cwd;
    }

    if (name === 'ls') {
      const flags = new Set();
      args.filter((arg) => arg.startsWith('-')).forEach((arg) => {
        if (arg.startsWith('--')) {
          flags.add(arg);
          return;
        }

        arg.slice(1).split('').forEach((flag) => flags.add(`-${flag}`));
      });
      const showHidden = flags.has('-a') || flags.has('-A') || flags.has('--all');
      const longFormat = flags.has('-l') || flags.has('--long');
      const target = args.find((arg) => !arg.startsWith('-')) || terminalState.cwd;
      const resolved = resolvePath(target);
      const node = virtualFs.getNode(resolved);

      if (!node) {
        return `ls: cannot access '${target}': No such file or directory`;
      }

      if (node.type !== 'dir') {
        return resolved.split('/').filter(Boolean).pop();
      }

      const entries = Object.keys(node.entries || {}).sort();
      const visibleEntries = entries.filter((entry) => showHidden || !entry.startsWith('.'));

      if (!visibleEntries.length) {
        return '';
      }

      if (!longFormat) {
        return visibleEntries.join('\n');
      }

      return visibleEntries.map((entry) => {
        const child = node.entries[entry];
        const kind = child.type === 'dir' ? 'd' : '-';
        const size = child.type === 'dir' ? '4096' : String(child.content?.length || 0);
        return `${kind}rwxr-xr-x 1 guest guest ${size.padStart(5, ' ')} ${entry}`;
      }).join('\n');
    }

    if (name === 'mkdir') {
      const createParents = args.includes('-p') || args.includes('--parents');
      const targets = args.filter((arg) => !arg.startsWith('-'));

      targets.forEach((arg) => {
        const resolved = resolvePath(arg);
        const parent = resolved.includes('/') ? resolved.slice(0, resolved.lastIndexOf('/')) || '/' : '/';
        const key = resolved.split('/').filter(Boolean).pop();
        const parentNode = virtualFs.getNode(parent);

        if (parentNode && parentNode.type === 'dir') {
          if (!parentNode.entries[key]) {
            parentNode.entries[key] = { type: 'dir', entries: {} };
          }
        } else if (createParents) {
          virtualFs.createDir(resolved);
        }
      });
      return '';
    }

    if (name === 'touch') {
      args.filter((arg) => !arg.startsWith('-')).forEach((arg) => {
        const resolved = resolvePath(arg);
        const node = virtualFs.getNode(resolved);
        if (!node) {
          virtualFs.createFile(resolved, '');
        }
      });
      return '';
    }

    if (name === 'cat') {
      if (!args.length) {
        return 'Usage: cat <file>';
      }

      const filePath = resolvePath(args[0]);
      const node = virtualFs.getNode(filePath);
      if (!node || node.type !== 'file') {
        return `cat: ${args[0]}: No such file or directory`;
      }
      return node.content;
    }

    if (name === 'tree') {
      const target = args[0] || terminalState.cwd;
      const node = virtualFs.getNode(resolvePath(target));
      if (!node || node.type !== 'dir') {
        return `tree: ${target}: No such file or directory`;
      }

      function renderTree(currentNode, prefix = '') {
        const lines = [];
        const entries = Object.keys(currentNode.entries || {}).sort();
        entries.forEach((entry, index) => {
          const child = currentNode.entries[entry];
          const connector = index === entries.length - 1 ? '`-- ' : '|-- ';
          lines.push(`${prefix}${connector}${entry}`);
          if (child.type === 'dir' && Object.keys(child.entries || {}).length) {
            const nextPrefix = index === entries.length - 1 ? `${prefix}    ` : `${prefix}|   `;
            lines.push(renderTree(child, nextPrefix).join('\n'));
          }
        });
        return lines;
      }

      const rendered = renderTree(node).join('\n');
      return rendered || '.';
    }

    if (name === 'find') {
      const query = (args[0] || terminalState.cwd).trim();
      const rootPath = resolvePath(query);
      const node = virtualFs.getNode(rootPath);
      if (!node) {
        return `find: ${query}: No such file or directory`;
      }

      const output = [];
      function walk(path, currentNode) {
        if (!currentNode || !currentNode.entries) {
          return;
        }
        Object.keys(currentNode.entries).forEach((entry) => {
          const childPath = `${path}/${entry}`.replace(/\/+/g, '/');
          output.push(childPath);
          if (currentNode.entries[entry].type === 'dir') {
            walk(childPath, currentNode.entries[entry]);
          }
        });
      }
      walk(rootPath, node);
      return output.join('\n');
    }

    if (name === 'grep') {
      const pattern = args[0] || '';
      const filePath = args[1] ? resolvePath(args[1]) : '';
      const source = filePath ? (virtualFs.getNode(filePath)?.content || '') : inputText;
      if (!pattern) {
        return 'Usage: grep <pattern> [file]';
      }
      return source
        .split(/\r?\n/)
        .filter((line) => line.includes(pattern))
        .join('\n');
    }

    if (name === 'head') {
      const source = args.length ? virtualFs.getNode(resolvePath(args[0]))?.content : inputText;
      if (args.length && source === undefined) {
        return `head: ${args[0]}: No such file or directory`;
      }
      const lines = String(source || '').split(/\r?\n/);
      return lines.slice(0, 10).join('\n');
    }

    if (name === 'tail') {
      const source = args.length ? virtualFs.getNode(resolvePath(args[0]))?.content : inputText;
      if (args.length && source === undefined) {
        return `tail: ${args[0]}: No such file or directory`;
      }
      const lines = String(source || '').split(/\r?\n/);
      return lines.slice(-10).join('\n');
    }

    if (name === 'wc') {
      const source = args.length ? virtualFs.getNode(resolvePath(args[0]))?.content : inputText;
      if (args.length && source === undefined) {
        return `wc: ${args[0]}: No such file or directory`;
      }
      const content = String(source || '');
      const lines = content ? content.split(/\r?\n/).length : 0;
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      const chars = content.length;
      return `${lines} ${words} ${chars}`;
    }

    if (name === 'sort') {
      const source = args.length ? (virtualFs.getNode(resolvePath(args[0]))?.content || '') : inputText;
      return source.split(/\r?\n/).sort().join('\n');
    }

    if (name === 'uniq') {
      const source = args.length ? (virtualFs.getNode(resolvePath(args[0]))?.content || '') : inputText;
      return Array.from(new Set(source.split(/\r?\n/))).join('\n');
    }

    if (name === 'less') {
      const filePath = resolvePath(args[0]);
      const node = virtualFs.getNode(filePath);
      if (!node || node.type !== 'file') {
        return `less: ${args[0]}: No such file or directory`;
      }
      return node.content;
    }

    if (name === 'cp') {
      const recursive = args.includes('-r') || args.includes('-R') || args.includes('--recursive');
      const cleanArgs = args.filter((arg) => !arg.startsWith('-'));
      if (cleanArgs.length < 2) {
        return 'Usage: cp <source> <destination>';
      }

      const sourcePath = resolvePath(cleanArgs[0]);
      const destPath = resolvePath(cleanArgs[1]);
      const sourceNode = virtualFs.getNode(sourcePath);

      if (!sourceNode) {
        return `cp: ${cleanArgs[0]}: No such file or directory`;
      }

      if (sourceNode.type === 'dir' && !recursive) {
        return `cp: -r required for directories`;
      }

      if (sourceNode.type === 'dir') {
        virtualFs.createDir(destPath);
        Object.entries(sourceNode.entries || {}).forEach(([key, child]) => {
          if (child.type === 'dir') {
            executeBuiltinCommand('cp', ['-r', `${cleanArgs[0]}/${key}`, `${cleanArgs[1]}/${key}`], inputText);
          } else {
            virtualFs.createFile(`${destPath}/${key}`, child.content || '');
          }
        });
        return '';
      }

      virtualFs.createFile(destPath, sourceNode.content);
      return '';
    }

    if (name === 'mv') {
      if (args.length < 2) {
        return 'Usage: mv <source> <destination>';
      }
      const sourcePath = resolvePath(args[0]);
      const destPath = resolvePath(args[1]);
      if (!virtualFs.getNode(sourcePath)) {
        return `mv: ${args[0]}: No such file or directory`;
      }
      virtualFs.moveNode(sourcePath, destPath);
      return '';
    }

    if (name === 'rm' && args[0] === '-rf' && args[1] === '/') {
      return 'Website protected.\nAttempt logged :)';
    }

    if (name === 'rm') {
      const recursive = args.includes('-r') || args.includes('-R') || args.includes('-rf') || args.includes('--recursive');
      const cleanArgs = args.filter((arg) => !arg.startsWith('-'));
      if (!cleanArgs.length) {
        return 'Usage: rm <path>';
      }

      const target = resolvePath(cleanArgs[0]);
      const node = virtualFs.getNode(target);
      if (!node) {
        return `rm: cannot remove '${cleanArgs[0]}': No such file or directory`;
      }

      if (node.type === 'dir' && !recursive) {
        return `rm: cannot remove '${cleanArgs[0]}': Is a directory`;
      }

      const removed = virtualFs.deleteNode(target);
      if (!removed) {
        return `rm: cannot remove '${cleanArgs[0]}': No such file or directory`;
      }
      return '';
    }

    if (name === 'true') {
      return '';
    }

    if (name === 'false') {
      return '';
    }

    if (name === 'ps') {
      return 'PID TTY CMD\n101 pts/0 bash\n102 pts/0 portal-shell';
    }

    if (name === 'jobs') {
      return 'No jobs currently running.';
    }

    if (name === 'sleep') {
      const seconds = Number(args[0] || '0');
      if (Number.isNaN(seconds)) {
        return 'sleep: invalid time interval';
      }
      return '';
    }

    if (name === 'basename') {
      return (args[0] || '').split('/').filter(Boolean).pop() || '.';
    }

    if (name === 'dirname') {
      const value = args[0] || '.';
      const normalized = value.replace(/\\/g, '/');
      const lastSlash = normalized.lastIndexOf('/');
      if (lastSlash <= 0) return '/';
      return normalized.slice(0, lastSlash) || '/';
    }

    if (name === 'realpath') {
      return resolvePath(args[0] || '.');
    }

    if (name === 'stat') {
      const target = resolvePath(args[0] || '.');
      const node = virtualFs.getNode(target);
      if (!node) {
        return `stat: cannot stat '${args[0] || '.'}': No such file or directory`;
      }
      return `  File: ${target}\n  Size: ${node.type === 'file' ? (node.content || '').length : 0}\n  Type: ${node.type}`;
    }

    if (name === 'theme') {
      const mode = (args[0] || 'dark').toLowerCase();
      if (mode === 'dark') {
        document.body.dataset.theme = 'dark';
        document.body.classList.remove('theme-light');
        return 'Theme set to dark.';
      }
      if (mode === 'light') {
        document.body.dataset.theme = 'light';
        document.body.classList.add('theme-light');
        return 'Theme set to light.';
      }
      return 'Usage: theme [dark|light]';
    }

    if (name === 'resume') {
      window.open('https://github.com/CtrlAltSpace', '_blank', 'noopener,noreferrer');
      return 'Resume link opened.';
    }

    if (name === 'home') {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return 'Home section activated.';
    }

    if (name === 'open') {
      const target = (args.join(' ') || 'home').toLowerCase();
      const sectionMap = {
        home: 'home',
        about: 'about',
        skills: 'skills',
        project: 'projects',
        projects: 'projects',
        contact: 'contact',
        blog: '/blog',
      };

      if (sectionMap[target]) {
        const key = sectionMap[target];
        if (key === '/blog') {
          window.location.href = '/blog';
          return 'Opening blog...';
        }

        const targetElement = document.getElementById(key);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return `Opening ${key}.`;
      }

      return 'Usage: open [home|about|skills|projects|contact|blog]';
    }

    if (name === 'goto') {
      return executeBuiltinCommand('open', args, inputText);
    }

    if (name === 'coffee') {
      return 'Error: Coffee module not installed.';
    }

    return null;
  }

  function runPipeline(commandGroups, input = '') {
    let currentInput = input;
    let status = 0;

    for (let index = 0; index < commandGroups.length; index += 1) {
      const tokens = commandGroups[index];
      const pipeline = [];
      let currentCommand = [];

      tokens.forEach((token) => {
        if (token === '|') {
          pipeline.push(currentCommand);
          currentCommand = [];
        } else {
          currentCommand.push(token);
        }
      });

      if (currentCommand.length) {
        pipeline.push(currentCommand);
      }

      let pipelineInput = currentInput;
      let output = '';

      for (let step = 0; step < pipeline.length; step += 1) {
        const commandTokens = pipeline[step];
        const redirections = [];
        const commandParts = [];

        for (let i = 0; i < commandTokens.length; i += 1) {
          const token = commandTokens[i];
          if (token === '>' || token === '>>' || token === '<') {
            redirections.push({ operator: token, path: commandTokens[i + 1] });
            i += 1;
            continue;
          }
          commandParts.push(token);
        }

        const commandName = commandParts[0] || '';
        const args = commandParts.slice(1);
        const expanded = getAliasExpanded(commandName, args);
        const inputRedirection = redirections.find(({ operator }) => operator === '<');
        const redirectedInput = inputRedirection
          ? virtualFs.getNode(resolvePath(inputRedirection.path))?.content
          : undefined;

        if (inputRedirection && redirectedInput === undefined) {
          appendLog(`${inputRedirection.path}: No such file or directory`, 'error');
          return { status: 1, output: '' };
        }

        const commandInput = inputRedirection ? redirectedInput : pipelineInput;
        const outputString = executeBuiltinCommand(expanded.name, expanded.args, commandInput);

        if (outputString === null) {
          const suggestions = suggestClosestCommand(expanded.name);
          appendLog(`${expanded.name}: command not found`, 'error');
          if (suggestions.length) {
            appendLog(`Did you mean: ${suggestions.join(', ')}?`, 'warning');
          }
          status = 127;
          return { status, output: '' };
        }

        status = expanded.name.toLowerCase() === 'false' ? 1 : 0;

        const outputRedirections = redirections.filter(({ operator }) => operator === '>' || operator === '>>');
        if (outputRedirections.length) {
          outputRedirections.forEach(({ operator, path }) => {
            const resolved = resolvePath(path);
            const targetNode = virtualFs.getNode(resolved);
            const nextValue = operator === '>' ? outputString : `${targetNode?.content || ''}${outputString}`;
            const parent = resolved.includes('/') ? resolved.slice(0, resolved.lastIndexOf('/')) || '/' : '/';
            const fileName = resolved.split('/').filter(Boolean).pop();
            const parentNode = virtualFs.getNode(parent);
            if (parentNode && parentNode.type === 'dir') {
              parentNode.entries[fileName] = { type: 'file', content: nextValue };
            }
          });
        }

        output = outputRedirections.length ? '' : outputString;

        pipelineInput = output;
      }

      currentInput = pipelineInput;
    }

    return { status, output: currentInput };
  }

  function processInput(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return;
    }

    terminalState.history.push(trimmed);
    terminalState.historyIndex = terminalState.history.length;

    const commandTokens = tokenizeInput(trimmed);
    if (!commandTokens.length) {
      return;
    }

    const segments = [];
    let currentSegment = [];

    commandTokens.forEach((token) => {
      if (token === ';') {
        if (currentSegment.length) {
          segments.push(currentSegment);
          currentSegment = [];
        }
        return;
      }
      if (token === '&&' || token === '||') {
        if (currentSegment.length) {
          segments.push(currentSegment);
          currentSegment = [];
        }
        segments.push(token);
        return;
      }
      currentSegment.push(token);
    });

    if (currentSegment.length) {
      segments.push(currentSegment);
    }

    let lastStatus = 0;
    let currentInput = '';

    for (let index = 0; index < segments.length; index += 1) {
      const item = segments[index];
      if (item === '&&' || item === '||') {
        const shouldContinue = item === '&&' ? lastStatus === 0 : lastStatus !== 0;
        if (!shouldContinue) {
          break;
        }
        continue;
      }

      const pipeline = [];
      let pipelineBuffer = [];
      item.forEach((token) => {
        if (token === '|') {
          if (pipelineBuffer.length) {
            pipeline.push(pipelineBuffer);
            pipelineBuffer = [];
          }
        } else {
          pipelineBuffer.push(token);
        }
      });

      if (pipelineBuffer.length) {
        pipeline.push(pipelineBuffer);
      }

      if (!pipeline.length) {
        pipeline.push(item);
      }

      const result = runPipeline(pipeline, currentInput);
      lastStatus = result.status;
      currentInput = result.output;
      if (currentInput && typeof currentInput === 'string' && currentInput.trim()) {
        appendLog(currentInput, 'output');
      }
    }
  }

  function updatePrompt() {
    terminal.prompt.textContent = getCurrentPrompt();
  }

  function triggerInteractiveMode() {
    if (terminalState.enabled) return;

    terminalState.interactive = true;
    terminalState.enabled = true;
    terminalDock.classList.add('is-interactive');
    terminalRoot.classList.add('is-interactive');
    document.body.classList.add('terminal-activated');
    updatePrompt();
    appendLog('[SYS] Scroll threshold reached.', 'system');
    appendLog('[SYS] Terminal unlocked and ready.', 'system');
    appendLog(`${getCurrentPrompt()} `, 'command');
    terminal.input.hidden = false;
    terminal.input.disabled = false;
    terminal.input.style.display = '';
    terminal.input.focus();
  }

  function handleAutocomplete() {
    const value = terminal.input.value.trim();
    if (!value) return;

    const prefix = value.split(/\s+/).pop();
    const names = [
      'help', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'history', 'alias', 'unalias', 'env',
      'export', 'uname', 'hostname', 'whoami', 'date', 'printf', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq',
      'find', 'tree', 'less', 'cp', 'mv', 'rm', 'open', 'goto', 'theme', 'resume', 'home', 'coffee', 'clear'
    ];

    const matches = names.filter((entry) => entry.startsWith(prefix));
    if (!matches.length) {
      return;
    }

    if (matches.length === 1) {
      const before = value.slice(0, value.lastIndexOf(prefix));
      terminal.input.value = `${before}${matches[0]}`;
      return;
    }

    appendLog(matches.join('  '), 'output');
  }

  function maybeEnableTerminal() {
    if (terminalState.enabled) return;

    const contactSection = document.getElementById('contact');
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const unlockScrollY = contactSection
      ? Math.min(contactSection.offsetTop + 180, maxScrollY - 24)
      : maxScrollY - 160;

    if (window.scrollY >= unlockScrollY) {
      triggerInteractiveMode();
    }
  }

  function logNavigation(label, message) {
    const className = label === 'OK' ? 'ok' : label === 'CMD' ? 'command' : 'system';
    appendLog(`[${label}] ${message}`, className);
  }

  function registerNavigationLogs() {
    document.body.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.replace('#', '') || 'home';
        const known = {
          home: 'Home',
          about: 'About',
          skills: 'Skills',
          projects: 'Projects',
          contact: 'Contact',
        };

        suppressScrollLog = true;
        lastLoggedSection = targetId;
        logNavigation('NAV', `Jumped to ${known[targetId] || 'section'}`);

        requestAnimationFrame(() => {
          setTimeout(() => {
            suppressScrollLog = false;
          }, 500);
        });
      }

      if (link.closest('.project-actions')) {
        logNavigation('CMD', 'Opening external project link');
        logNavigation('OK', 'Project redirect prepared.');
      }

      if (href === '/blog') {
        logNavigation('NAV', 'Opening blog section');
      }

      if (link.classList.contains('btn-primary')) {
        logNavigation('NAV', 'Opening Projects section');
      }
    });
  }

  registerNavigationLogs();

  const terminalLog = document.createElement('div');
  terminalLog.className = 'terminal-log';

  const terminalDock = document.createElement('div');
  terminalDock.className = 'terminal-dock';

  const terminalHeader = document.createElement('div');
  terminalHeader.className = 'terminal-header';
  terminalHeader.innerHTML = `
    <div class="terminal-window-controls">
      <span></span><span></span><span></span>
    </div>
    <div class="terminal-title">portfolio-shell</div>
  `;

  const terminalInputRow = document.createElement('div');
  terminalInputRow.className = 'terminal-input-row';

  const promptLabel = document.createElement('span');
  promptLabel.className = 'terminal-prompt';
  promptLabel.id = 'terminal-prompt';

  const terminalInput = document.createElement('input');
  terminalInput.className = 'terminal-input';
  terminalInput.type = 'text';
  terminalInput.autocomplete = 'off';
  terminalInput.spellcheck = false;
  terminalInput.setAttribute('aria-label', 'Portfolio terminal input');

  terminalInputRow.appendChild(promptLabel);
  terminalInputRow.appendChild(terminalInput);

  terminalDock.appendChild(terminalHeader);
  terminalDock.appendChild(terminalLog);
  terminalDock.appendChild(terminalInputRow);
  terminalRoot.appendChild(terminalDock);

  const terminal = {
    dock: terminalDock,
    log: terminalLog,
    input: terminalInput,
    prompt: promptLabel,
  };

  appendLog('[SYS] Portfolio initialized.', 'system');
  appendLog('[SYS] Loading page context...', 'system');
  appendLog('[OK] Shell ready.', 'ok');
  appendLog('[ERR] CtrlAltSpace Productions has rebranded to CurioSpace Labs.');
  appendLog('[SYS] Page saved as history, all functionalities kept.', 'system');
  appendLog(`guest@ctrlaltspace:~$`, 'command');

  const sectionNames = {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
  };

  let lastLoggedSection = '';
  let suppressScrollLog = false;

  const sectionScrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.id;
        if (suppressScrollLog || !sectionNames[sectionId] || lastLoggedSection === sectionId) return;
        lastLoggedSection = sectionId;
        appendLog(`[NAV] Section in view: ${sectionNames[sectionId]}`, 'system');
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => sectionScrollObserver.observe(section));

  const scrollWatcher = () => {
    if (terminalState.enabled) return;

    const contactSection = document.getElementById('contact');
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const unlockScrollY = contactSection
      ? Math.min(contactSection.offsetTop + 180, maxScrollY - 24)
      : maxScrollY - 220;

    if (window.scrollY >= unlockScrollY) {
      maybeEnableTerminal();
    }
  };

  window.addEventListener('scroll', scrollWatcher, { passive: true });
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!lastLoggedSection) {
        lastLoggedSection = 'home';
        appendLog('[NAV] Initial section: Home', 'system');
      }
    }, 200);
  });

  terminal.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = terminal.input.value.trim();
      if (value) {
        appendLog(`${getCurrentPrompt()} ${value}`, 'command');
        processInput(value);
      } else {
        appendLog(`${getCurrentPrompt()} `, 'command');
      }
      terminal.input.value = '';
      updatePrompt();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      handleAutocomplete();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!terminalState.history.length) return;
      terminalState.historyIndex = Math.max(0, terminalState.historyIndex - 1);
      terminal.input.value = terminalState.history[terminalState.historyIndex] || '';
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!terminalState.history.length) return;
      terminalState.historyIndex = Math.min(terminalState.history.length, terminalState.historyIndex + 1);
      terminal.input.value = terminalState.history[terminalState.historyIndex] || '';
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      terminal.input.value = '';
      appendLog('^C', 'warning');
      updatePrompt();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      terminalLog.innerHTML = '';
      updatePrompt();
      appendLog(`${getCurrentPrompt()} `, 'command');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      terminal.input.setSelectionRange(0, 0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      terminal.input.setSelectionRange(terminal.input.value.length, terminal.input.value.length);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      terminal.input.value = '';
    }
  });

  terminal.input.addEventListener('input', () => {
    terminalState.currentInput = terminal.input.value;
  });

  terminal.dock.addEventListener('click', () => {
    if (terminalState.enabled) {
      terminal.input.focus();
      return;
    }
    triggerInteractiveMode();
  });

  updatePrompt();
  terminal.input.disabled = true;
  terminal.input.hidden = true;
  terminal.input.style.display = 'none';
  terminal.input.value = '';
}
