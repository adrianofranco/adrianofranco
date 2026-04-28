'use strict';

const PROMPT = 'adriano@website:~$ ';

const history = [];
let historyIndex = -1;
let currentInput = '';

const $ = (id) => document.getElementById(id);
const getAsciiEl = () => document.querySelector('.ascii-art');

// ─── Commands ────────────────────────────────────────────────────────────────

const COMMANDS = {

    help: () =>
        `<span class="cmd-highlight">Available commands:</span>

  <span class="cmd-highlight">about</span>        About Adriano Franco
  <span class="cmd-highlight">skills</span>       Technologies and skills
  <span class="cmd-highlight">contact</span>      Contact information
  <span class="cmd-highlight">refresh</span>      Reload ASCII art
  <span class="cmd-highlight">clear</span>        Clear terminal`,

    about: () =>
        `<span class="cmd-highlight">Adriano Franco</span> — Full Stack Developer

  Location   São Paulo, Brazil
  GitHub     <a href="https://github.com/adrianofranco" target="_blank">github.com/adrianofranco</a>
  LinkedIn   <a href="https://linkedin.com/in/adrianofranco" target="_blank">linkedin.com/in/adrianofranco</a>

  Fullstack developer focused on building solid,
  maintainable and well crafted web applications.`,

    skills: () =>
        `<span class="cmd-highlight">// Languages</span>
  PHP · JavaScript · Python

<span class="cmd-highlight">// Frameworks & Runtimes</span>
  CodeIgniter · Express.js · Node.js

<span class="cmd-highlight">// Frontend</span>
  HTML · CSS · SASS · HTMX · PWA

<span class="cmd-highlight">// Databases</span>
  MySQL · PostgreSQL

<span class="cmd-highlight">// Tools</span>
  Git · Linux · Docker · REST APIs`,

    contact: () =>
        `<span class="cmd-highlight">GitHub</span>     <a href="https://github.com/adrianofranco" target="_blank">github.com/adrianofranco</a>
<span class="cmd-highlight">LinkedIn</span>   <a href="https://linkedin.com/in/adrianofranco" target="_blank">linkedin.com/in/adrianofranco</a>
<span class="cmd-highlight">Location</span>   São Paulo, Brazil`,

    refresh: async () => {
        try {
            const art = await fetch('/ascii-art').then(r => r.text());
            const ascii = getAsciiEl();
            const terminal = ascii.querySelector('.terminal');
            ascii.innerHTML = art;
            if (terminal) ascii.appendChild(terminal);
            return '<span class="cmd-dim">ASCII art reloaded</span>';
        } catch {
            return '<span class="cmd-error">Failed to reload ASCII art</span>';
        }
    },

    sudo: (args) => {
        if (args.join(' ') === 'make me a sandwich') return 'Okay.';
        return '<span class="cmd-error">sudo: permission denied — nice try though</span>';
    },

    // clear is handled in execute()
};

// ─── Engine ───────────────────────────────────────────────────────────────────

function esc(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function print(cmdLine, output) {
    const outputEl = $('terminal-output');

    const block = document.createElement('div');
    block.className = 'cmd-block';

    const cmdLineEl = document.createElement('span');
    cmdLineEl.className = 'cmd-line';
    cmdLineEl.textContent = PROMPT + cmdLine;
    block.appendChild(cmdLineEl);

    if (output !== null && output !== undefined) {
        const outEl = document.createElement('div');
        outEl.className = 'cmd-output';
        outEl.innerHTML = output;
        block.appendChild(outEl);
    }

    outputEl.appendChild(block);
    $('terminal-input')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function execute(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(/\s+/);
    const cmdKey = cmd.toLowerCase();

    if (cmdKey === 'clear') {
        $('terminal-output').innerHTML = '';
        return;
    }

    const fn = COMMANDS[cmdKey];
    if (fn) {
        const result = fn(args);
        if (result instanceof Promise) {
            result.then(output => print(trimmed, output));
        } else {
            print(trimmed, result);
        }
    } else {
        print(trimmed,
            `<span class="cmd-error">${esc(cmd)}: command not found</span> <span class="cmd-dim">— type <span class="cmd-highlight">help</span> for available commands</span>`
        );
    }
}

// ─── Input ────────────────────────────────────────────────────────────────────

function getInputText(input) {
    return input.textContent;
}

function setInputText(input, text) {
    input.textContent = text;
    moveCursorToEnd(input);
}

function moveCursorToEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

function handleKeydown(e) {
    const input = $('terminal-input');

    if (e.key === 'Enter') {
        e.preventDefault();
        const value = getInputText(input);
        if (value.trim()) {
            history.unshift(value);
            historyIndex = -1;
            currentInput = '';
        }
        execute(value);
        setInputText(input, '');

    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex === -1) currentInput = getInputText(input);
        if (historyIndex < history.length - 1) {
            historyIndex++;
            setInputText(input, history[historyIndex]);
        }

    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > -1) {
            historyIndex--;
            setInputText(input, historyIndex === -1 ? currentInput : history[historyIndex]);
        }

    } else if (e.key === 'Tab') {
        e.preventDefault();
        autocomplete(input);
    }
}

function autocomplete(input) {
    const val = getInputText(input).toLowerCase();
    if (!val) return;
    const match = Object.keys(COMMANDS).find(cmd => cmd.startsWith(val));
    if (match) setInputText(input, match);
}

// Click anywhere on the page focuses the input
document.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
        $('terminal-input')?.focus();
    }
});

// ─── Init ─────────────────────────────────────────────────────────────────────

function initTerminal() {
    const input = $('terminal-input');
    if (!input) return;

    input.addEventListener('keydown', handleKeydown);

    // Sanitize paste — strip HTML, insert plain text only
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    input.addEventListener('blur', () => {
        const c = $('terminal-cursor');
        if (c) c.style.visibility = 'hidden';
    });
    input.addEventListener('focus', () => {
        const c = $('terminal-cursor');
        if (c) c.style.visibility = 'visible';
    });

    input.focus();
}

document.addEventListener('htmx:afterSwap', (e) => {
    if (e.detail.target.classList.contains('ascii-art')) {
        initTerminal();
    }
});
