type Language = 'en' | 'es';
type ThemeMode = 'inherit' | 'native';
type ThemeTokens = Record<string, string>;

type DemoMessage =
  | { source: 'gespitia-shell'; type: 'shell.init'; language: Language; theme: ThemeMode; tokens: ThemeTokens }
  | { source: 'gespitia-shell'; type: 'language.changed'; language: Language }
  | { source: 'gespitia-shell'; type: 'theme.changed'; theme: ThemeMode; tokens: ThemeTokens };

const allowedOrigin = window.location.origin;

const tokenMap: Record<string, string> = {
  '--portfolio-bg': '--demo-bg',
  '--portfolio-paper': '--demo-paper',
  '--portfolio-ink': '--demo-ink',
  '--portfolio-muted': '--demo-muted',
  '--portfolio-line': '--demo-line',
  '--portfolio-accent': '--demo-accent',
};

function applyTheme(theme: ThemeMode, tokens: ThemeTokens) {
  document.documentElement.dataset['portfolioTheme'] = theme;
  for (const target of Object.values(tokenMap)) document.documentElement.style.removeProperty(target);
  if (theme !== 'inherit') return;
  for (const [source, target] of Object.entries(tokenMap)) {
    const value = tokens[source];
    if (value) document.documentElement.style.setProperty(target, value);
  }
}

function handle(message: DemoMessage) {
  if (message.source !== 'gespitia-shell') return;
  if (message.type === 'shell.init' || message.type === 'theme.changed') applyTheme(message.theme, message.tokens);
  if (message.type === 'language.changed') document.documentElement.lang = message.language;
}

window.addEventListener('message', event => {
  if (event.origin !== allowedOrigin) return;
  handle(event.data as DemoMessage);
});

window.parent.postMessage({ source: 'gespitia-demo', type: 'demo.ready', capabilities: ['language', 'theme'] }, allowedOrigin);
