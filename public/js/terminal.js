'use strict';

const PROMPT = 'adriano@website:~$ ';

const history = [];
let historyIndex = -1;
let currentInput = '';

const $ = (id) => document.getElementById(id);
const getAsciiEl = () => document.querySelector('.ascii-art');

const t = () => (window.__I18N__ || {});
const supported = () => (window.__I18N_SUPPORTED__ || ['en', 'pt-br']);

function format(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
}

// ─── Commands ────────────────────────────────────────────────────────────────

const COMMANDS = {

    help: () => {
        const h = t().terminal.help;
        return `<span class="cmd-highlight">${h.title}</span>

  <span class="cmd-highlight">about</span>        ${h.about}
  <span class="cmd-highlight">skills</span>       ${h.skills}
  <span class="cmd-highlight">contact</span>      ${h.contact}
  <span class="cmd-highlight">refresh</span>      ${h.refresh}
  <span class="cmd-highlight">lang</span>         ${h.lang}
  <span class="cmd-highlight">clear</span>        ${h.clear}`;
    },

    about: () => {
        const a = t().terminal.about;
        return `<span class="cmd-highlight">Adriano Franco</span> — ${a.title}

  ${a.labels.location}   ${a.locationValue}
  ${a.labels.github}     <a href="https://github.com/adrianofranco" target="_blank">github.com/adrianofranco</a>
  ${a.labels.linkedin}   <a href="https://linkedin.com/in/adrianofranco" target="_blank">linkedin.com/in/adrianofranco</a>

  ${a.description}`;
    },

    skills: () => {
        const s = t().terminal.skills;
        return `<span class="cmd-highlight">// ${s.languages}</span>
  PHP · JavaScript · Python

<span class="cmd-highlight">// ${s.frameworks}</span>
  CodeIgniter · Express.js · Node.js

<span class="cmd-highlight">// ${s.frontend}</span>
  HTML · CSS · SASS · HTMX · PWA

<span class="cmd-highlight">// ${s.databases}</span>
  MySQL · PostgreSQL

<span class="cmd-highlight">// ${s.tools}</span>
  Git · Linux · Docker · REST APIs`;
    },

    contact: () => {
        const c = t().terminal.contact;
        return `<span class="cmd-highlight">${c.github}</span>     <a href="https://github.com/adrianofranco" target="_blank">github.com/adrianofranco</a>
<span class="cmd-highlight">${c.linkedin}</span>   <a href="https://linkedin.com/in/adrianofranco" target="_blank">linkedin.com/in/adrianofranco</a>
<span class="cmd-highlight">${c.location}</span>   ${c.locationValue}`;
    },

    refresh: async () => {
        const r = t().terminal.refresh;
        try {
            const art = await fetch('/ascii-art').then(r => r.text());
            const ascii = getAsciiEl();
            const terminal = ascii.querySelector('.terminal');
            ascii.innerHTML = art;
            if (terminal) ascii.appendChild(terminal);
            return `<span class="cmd-dim">${r.ok}</span>`;
        } catch {
            return `<span class="cmd-error">${r.fail}</span>`;
        }
    },

    lang: async (args) => {
        const l = t().terminal.lang;
        const current = t().code;
        const list = supported();

        if (!args.length) {
            return `<span class="cmd-highlight">${l.current}:</span> ${current}
<span class="cmd-highlight">${l.available}:</span> ${list.join(', ')}
<span class="cmd-dim">${l.usage}</span>`;
        }

        const code = args[0].toLowerCase();
        if (list.indexOf(code) === -1) {
            return `<span class="cmd-error">${format(l.unknown, { code: esc(code) })}</span>
<span class="cmd-dim">${l.available}: ${list.join(', ')}</span>`;
        }

        try {
            const res = await fetch('/lang/' + encodeURIComponent(code), { method: 'POST' });
            if (!res.ok) throw new Error('bad response');
        } catch {
            return `<span class="cmd-error">${l.unknown}</span>`;
        }

        const langName = code === 'en' ? 'English' : 'Português (Brasil)';
        setTimeout(() => window.location.reload(), 400);
        return `<span class="cmd-dim">${format(l.switching, { name: langName })}</span>`;
    },

    sudo: (args) => {
        const s = t().terminal.sudo;
        if (args.join(' ') === 'make me a sandwich') return s.sandwich;
        return `<span class="cmd-error">${s.denied}</span>`;
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
        const notFound = t().terminal.notFound || 'command not found';
        const hintTpl = t().terminal.hint404 || 'type {help} for available commands';
        const hint = format(hintTpl, { help: '<span class="cmd-highlight">help</span>' });
        print(trimmed,
            `<span class="cmd-error">${esc(cmd)}: ${notFound}</span> <span class="cmd-dim">— ${hint}</span>`
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
