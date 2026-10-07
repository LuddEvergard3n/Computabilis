const STORAGE_KEY = 'computabilis:v1';
const MAX_CENTS = 999_999_999_99;
const CATEGORIES = ['Alimentação', 'Casa', 'Educação', 'Lazer', 'Renda', 'Saúde', 'Transporte', 'Outros'];
const TYPES = ['expense', 'income'];

export function parseMoney(value) {
  if (typeof value !== 'string') return null;
  let normalized = value.trim().replace(/\s/g, '').replace(/^R\$/i, '');
  if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) normalized = normalized.replace(/\./g, '');
  else if (normalized.includes(',')) normalized = normalized.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= MAX_CENTS ? cents : null;
}

export function formatMoney(cents) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export function calculateTotals(entries) {
  return entries.reduce((totals, entry) => {
    totals[entry.type] += entry.cents;
    return totals;
  }, { income: 0, expense: 0 });
}

export function entriesForMonth(entries, month) {
  return entries.filter((entry) => entry.date.startsWith(`${month}-`));
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isValidEntry(entry) {
  return entry && typeof entry.id === 'string' && isValidDate(entry.date)
    && TYPES.includes(entry.type) && CATEGORIES.includes(entry.category)
    && Number.isSafeInteger(entry.cents) && entry.cents > 0 && entry.cents <= MAX_CENTS
    && typeof entry.description === 'string' && entry.description.length <= 120;
}

function localDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function emptyState() {
  return { version: 1, entries: [], budgets: {}, theme: 'light' };
}

function sanitizeState(candidate) {
  if (!candidate || candidate.version !== 1 || !Array.isArray(candidate.entries)) throw new Error('Formato de backup inválido.');
  const entries = candidate.entries.filter(isValidEntry);
  if (entries.length !== candidate.entries.length) throw new Error('O backup contém lançamentos inválidos.');
  const budgets = {};
  if (candidate.budgets && typeof candidate.budgets === 'object') {
    for (const [month, cents] of Object.entries(candidate.budgets)) {
      if (/^\d{4}-\d{2}$/.test(month) && Number.isSafeInteger(cents) && cents > 0 && cents <= MAX_CENTS) budgets[month] = cents;
    }
  }
  return { version: 1, entries, budgets, theme: candidate.theme === 'dark' ? 'dark' : 'light' };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? sanitizeState(JSON.parse(saved)) : emptyState();
  } catch (error) {
    console.error('Não foi possível carregar os dados salvos.', error);
    return emptyState();
  }
}

let state = emptyState();
let selectedMonth = localDate().slice(0, 7);
let pendingDeleteId = null;

function byId(id) { return document.getElementById(id); }

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setText(id, value) { byId(id).textContent = value; }

function monthEntries() {
  return entriesForMonth(state.entries, selectedMonth);
}

function renderSummary() {
  const totals = calculateTotals(monthEntries());
  const balance = totals.income - totals.expense;
  setText('income-total', formatMoney(totals.income));
  setText('expense-total', formatMoney(totals.expense));
  setText('balance-total', formatMoney(balance));
  byId('balance-total').classList.toggle('negative', balance < 0);

  const budget = state.budgets[selectedMonth];
  const remaining = budget ? budget - totals.expense : null;
  setText('budget-remaining', budget ? formatMoney(remaining) : 'Não definido');
  byId('budget-remaining').classList.toggle('negative', remaining !== null && remaining < 0);
  byId('budget-value').value = budget ? (budget / 100).toFixed(2).replace('.', ',') : '';

  const progress = byId('budget-progress');
  const percentage = budget ? Math.min((totals.expense / budget) * 100, 100) : 0;
  progress.style.width = `${percentage}%`;
  progress.classList.toggle('over', Boolean(budget && totals.expense > budget));
  if (!budget) setText('budget-message', 'Nenhum orçamento definido para este mês.');
  else if (remaining >= 0) setText('budget-message', `${formatMoney(remaining)} disponíveis de ${formatMoney(budget)}.`);
  else setText('budget-message', `Orçamento excedido em ${formatMoney(Math.abs(remaining))}.`);
}

function makeButton(label, className, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function renderEntries() {
  const filter = byId('type-filter').value;
  const entries = monthEntries()
    .filter((entry) => filter === 'all' || entry.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const list = byId('entry-list');
  list.replaceChildren();
  byId('empty-state').hidden = entries.length > 0;
  const totalInMonth = monthEntries().length;
  setText('entry-count', totalInMonth === 1 ? '1 lançamento neste mês.' : `${totalInMonth} lançamentos neste mês.`);

  for (const entry of entries) {
    const card = document.createElement('article');
    card.className = 'entry-card';
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = entry.description || entry.category;
    const metadata = document.createElement('p');
    metadata.textContent = `${entry.date.split('-').reverse().join('/')} · ${entry.category}`;
    details.append(title, metadata);
    const value = document.createElement('div');
    value.className = `entry-value ${entry.type}`;
    value.textContent = `${entry.type === 'expense' ? '−' : '+'} ${formatMoney(entry.cents)}`;
    const actions = document.createElement('div');
    actions.className = 'entry-actions';
    actions.append(
      makeButton('Editar', 'button button-secondary', () => startEditing(entry.id)),
      makeButton('Excluir', 'button button-secondary', () => requestDelete(entry.id))
    );
    card.append(details, value, actions);
    list.append(card);
  }
}

function render() {
  renderSummary();
  renderEntries();
}

function resetForm() {
  byId('entry-form').reset();
  byId('editing-id').value = '';
  byId('entry-date').value = selectedMonth === localDate().slice(0, 7) ? localDate() : `${selectedMonth}-01`;
  byId('save-entry').textContent = 'Adicionar lançamento';
  byId('cancel-edit').hidden = true;
  byId('form-error').hidden = true;
}

function showFormError(message) {
  setText('form-error', message);
  byId('form-error').hidden = false;
}

function saveEntry(event) {
  event.preventDefault();
  const cents = parseMoney(byId('entry-value').value);
  const entry = {
    id: byId('editing-id').value || (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`),
    date: byId('entry-date').value,
    type: byId('entry-type').value,
    category: byId('entry-category').value,
    cents,
    description: byId('entry-description').value.trim()
  };
  if (!entry.date || !entry.date.startsWith(`${selectedMonth}-`)) return showFormError('Escolha uma data dentro do mês em análise.');
  if (!CATEGORIES.includes(entry.category)) return showFormError('Escolha uma categoria.');
  if (!cents) return showFormError('Informe um valor válido, maior que zero, com no máximo duas casas decimais.');
  const index = state.entries.findIndex((item) => item.id === entry.id);
  if (index >= 0) state.entries[index] = entry;
  else state.entries.push(entry);
  saveState();
  resetForm();
  render();
}

function startEditing(id) {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) return;
  byId('editing-id').value = entry.id;
  byId('entry-date').value = entry.date;
  byId('entry-type').value = entry.type;
  byId('entry-category').value = entry.category;
  byId('entry-value').value = (entry.cents / 100).toFixed(2).replace('.', ',');
  byId('entry-description').value = entry.description;
  byId('save-entry').textContent = 'Salvar alteração';
  byId('cancel-edit').hidden = false;
  byId('entry-title').scrollIntoView({ behavior: 'smooth' });
}

function requestDelete(id) {
  pendingDeleteId = id;
  const dialog = byId('delete-dialog');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else if (window.confirm('Excluir este lançamento?')) deletePendingEntry();
}

function deletePendingEntry() {
  if (!pendingDeleteId) return;
  state.entries = state.entries.filter((entry) => entry.id !== pendingDeleteId);
  pendingDeleteId = null;
  saveState();
  render();
}

function saveBudget(event) {
  event.preventDefault();
  const raw = byId('budget-value').value.trim();
  if (!raw) delete state.budgets[selectedMonth];
  else {
    const cents = parseMoney(raw);
    if (!cents) {
      byId('budget-value').setCustomValidity('Informe um orçamento válido.');
      byId('budget-value').reportValidity();
      return;
    }
    state.budgets[selectedMonth] = cents;
  }
  byId('budget-value').setCustomValidity('');
  saveState();
  renderSummary();
}

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function exportBackup() {
  download(`computabilis-backup-${localDate()}.json`, JSON.stringify(state, null, 2), 'application/json');
  setText('backup-status', 'Backup baixado. Guarde o arquivo em um local seguro.');
}

async function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = sanitizeState(JSON.parse(await file.text()));
    state = imported;
    saveState();
    applyTheme();
    resetForm();
    render();
    setText('backup-status', 'Backup restaurado com sucesso.');
  } catch (error) {
    setText('backup-status', error.message || 'Não foi possível restaurar o backup.');
  } finally {
    event.target.value = '';
  }
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const entries = monthEntries().sort((a, b) => a.date.localeCompare(b.date));
  if (!entries.length) return setText('backup-status', 'Não há lançamentos neste mês para exportar.');
  const rows = [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'], ...entries.map((entry) => [
    entry.date, entry.type === 'income' ? 'Receita' : 'Despesa', entry.category, entry.description, (entry.cents / 100).toFixed(2).replace('.', ',')
  ])];
  download(`computabilis-${selectedMonth}.csv`, `\uFEFF${rows.map((row) => row.map(csvCell).join(';')).join('\r\n')}`, 'text/csv;charset=utf-8');
  setText('backup-status', 'CSV do mês baixado.');
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const dark = state.theme === 'dark';
  byId('theme-button').textContent = dark ? 'Tema claro' : 'Tema escuro';
  byId('theme-button').setAttribute('aria-pressed', String(dark));
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  applyTheme();
}

function init() {
  state = loadState();
  byId('selected-month').value = selectedMonth;
  applyTheme();
  resetForm();
  render();
  byId('entry-form').addEventListener('submit', saveEntry);
  byId('cancel-edit').addEventListener('click', resetForm);
  byId('budget-form').addEventListener('submit', saveBudget);
  byId('type-filter').addEventListener('change', renderEntries);
  byId('selected-month').addEventListener('change', (event) => {
    if (!/^\d{4}-\d{2}$/.test(event.target.value)) return;
    selectedMonth = event.target.value;
    resetForm();
    render();
  });
  byId('delete-dialog').addEventListener('close', (event) => {
    if (event.target.returnValue === 'confirm') deletePendingEntry();
    else pendingDeleteId = null;
  });
  byId('export-backup').addEventListener('click', exportBackup);
  byId('import-backup').addEventListener('change', importBackup);
  byId('export-csv').addEventListener('click', exportCsv);
  byId('print-report').addEventListener('click', () => window.print());
  byId('theme-button').addEventListener('click', toggleTheme);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch((error) => console.error('Falha ao ativar o modo offline.', error));
}

if (typeof document !== 'undefined') init();
