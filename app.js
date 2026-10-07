const STORAGE_KEY = 'computabilis:v1';
const MAX_CENTS = 999_999_999_99;
const CATEGORIES = ['Alimentação', 'Casa', 'Educação', 'Lazer', 'Renda', 'Saúde', 'Transporte', 'Outros'];
const TYPES = ['expense', 'income'];
const CATEGORY_LABELS = {
  'pt-BR': CATEGORIES,
  en: ['Food', 'Home', 'Education', 'Leisure', 'Income', 'Health', 'Transport', 'Other']
};
const TRANSLATIONS = {
  'pt-BR': {
    eyebrow: 'Controle financeiro pessoal', language: 'Idioma', monthTitle: 'Mês em análise', monthDescription: 'Os totais abaixo consideram apenas o mês escolhido.', month: 'Mês', income: 'Receitas', expenses: 'Despesas', balance: 'Saldo', budgetAvailable: 'Disponível no orçamento', savingsRate: 'Taxa de economia', expenseRatio: 'Comprometimento da renda', averageExpense: 'Despesa média', largestCategory: 'Maior categoria', expenseDistribution: 'Distribuição das despesas', expenseDistributionHelp: 'Participação de cada categoria no mês.', noExpenseData: 'Sem despesas neste mês.', cashFlow: 'Fluxo líquido', cashFlowHelp: 'Receitas menos despesas nos últimos seis meses.', budgetTitle: 'Orçamento do mês', budgetHelp: 'Defina quanto pode ser gasto no mês selecionado.', expenseLimit: 'Limite de despesas', moneyExample: 'Ex.: 2500,00', saveBudget: 'Salvar orçamento', newEntry: 'Novo lançamento', date: 'Data', type: 'Tipo', expense: 'Despesa', incomeSingular: 'Receita', category: 'Categoria', select: 'Selecione', value: 'Valor', description: 'Descrição', descriptionExample: 'Ex.: mercado da semana', addEntry: 'Adicionar lançamento', saveChange: 'Salvar alteração', cancelEdit: 'Cancelar edição', entries: 'Lançamentos', filter: 'Filtrar', all: 'Todos', noEntries: 'Nenhum lançamento para mostrar.', backupTitle: 'Backup e relatório', backupHelp: 'Os dados ficam somente neste navegador. Guarde um backup antes de trocar ou limpar o celular.', downloadBackup: 'Baixar backup', restoreBackup: 'Restaurar backup', exportCsv: 'Exportar mês em CSV', printReport: 'Imprimir relatório', deleteQuestion: 'Excluir lançamento?', deleteWarning: 'Esta ação não pode ser desfeita.', cancel: 'Cancelar', delete: 'Excluir', footer: 'Computabilis funciona sem conta e mantém os dados no aparelho.', themeLight: 'Tema claro', themeDark: 'Tema escuro', notDefined: 'Não definido', noBudget: 'Nenhum orçamento definido para este mês.', availableOf: (remaining, budget) => `${remaining} disponíveis de ${budget}.`, budgetExceeded: (value) => `Orçamento excedido em ${value}.`, entryCount: (count) => count === 1 ? '1 lançamento neste mês.' : `${count} lançamentos neste mês.`, edit: 'Editar', chooseCategory: 'Escolha uma categoria.', invalidValue: 'Informe um valor válido, maior que zero, com no máximo duas casas decimais.', invalidDate: 'Escolha uma data dentro do mês em análise.', invalidBudget: 'Informe um orçamento válido.', deletedQuestion: 'Excluir este lançamento?', backupDownloaded: 'Backup baixado. Guarde o arquivo em um local seguro.', backupRestored: 'Backup restaurado com sucesso.', backupFailed: 'Não foi possível restaurar o backup.', noCsvData: 'Não há lançamentos neste mês para exportar.', csvDownloaded: 'CSV do mês baixado.'
  },
  en: {
    eyebrow: 'Personal finance control', language: 'Language', monthTitle: 'Month under review', monthDescription: 'The totals below include only the selected month.', month: 'Month', income: 'Income', expenses: 'Expenses', balance: 'Balance', budgetAvailable: 'Available budget', savingsRate: 'Savings rate', expenseRatio: 'Income committed', averageExpense: 'Average expense', largestCategory: 'Largest category', expenseDistribution: 'Expense distribution', expenseDistributionHelp: 'Share of each category during the month.', noExpenseData: 'No expenses this month.', cashFlow: 'Net cash flow', cashFlowHelp: 'Income minus expenses over the last six months.', budgetTitle: 'Monthly budget', budgetHelp: 'Set the spending limit for the selected month.', expenseLimit: 'Expense limit', moneyExample: 'Example: 2500.00', saveBudget: 'Save budget', newEntry: 'New entry', date: 'Date', type: 'Type', expense: 'Expense', incomeSingular: 'Income', category: 'Category', select: 'Select', value: 'Amount', description: 'Description', descriptionExample: 'Example: weekly groceries', addEntry: 'Add entry', saveChange: 'Save changes', cancelEdit: 'Cancel editing', entries: 'Entries', filter: 'Filter', all: 'All', noEntries: 'No entries to display.', backupTitle: 'Backup and report', backupHelp: 'Data stays in this browser. Save a backup before replacing or clearing the phone.', downloadBackup: 'Download backup', restoreBackup: 'Restore backup', exportCsv: 'Export month as CSV', printReport: 'Print report', deleteQuestion: 'Delete entry?', deleteWarning: 'This action cannot be undone.', cancel: 'Cancel', delete: 'Delete', footer: 'Computabilis works without an account and keeps data on the device.', themeLight: 'Light theme', themeDark: 'Dark theme', notDefined: 'Not set', noBudget: 'No budget set for this month.', availableOf: (remaining, budget) => `${remaining} available from ${budget}.`, budgetExceeded: (value) => `Budget exceeded by ${value}.`, entryCount: (count) => count === 1 ? '1 entry this month.' : `${count} entries this month.`, edit: 'Edit', chooseCategory: 'Choose a category.', invalidValue: 'Enter a valid amount greater than zero with no more than two decimal places.', invalidDate: 'Choose a date within the selected month.', invalidBudget: 'Enter a valid budget.', deletedQuestion: 'Delete this entry?', backupDownloaded: 'Backup downloaded. Keep the file somewhere safe.', backupRestored: 'Backup restored successfully.', backupFailed: 'The backup could not be restored.', noCsvData: 'There are no entries to export this month.', csvDownloaded: 'Monthly CSV downloaded.'
  }
};

export function parseMoney(value) {
  if (typeof value !== 'string') return null;
  let normalized = value.trim().replace(/\s/g, '').replace(/^R\$/i, '');
  if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) normalized = normalized.replace(/\./g, '');
  else if (normalized.includes(',')) normalized = normalized.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= MAX_CENTS ? cents : null;
}

export function formatMoney(cents, locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(cents / 100);
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
  return { version: 1, entries: [], budgets: {}, theme: 'light', lang: 'pt-BR' };
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
  return { version: 1, entries, budgets, theme: candidate.theme === 'dark' ? 'dark' : 'light', lang: candidate.lang === 'en' ? 'en' : 'pt-BR' };
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
function tr(key) { return TRANSLATIONS[state.lang][key]; }
function money(cents) { return formatMoney(cents, state.lang); }
function categoryLabel(category) {
  const index = CATEGORIES.indexOf(category);
  return index >= 0 ? CATEGORY_LABELS[state.lang][index] : category;
}

function monthEntries() {
  return entriesForMonth(state.entries, selectedMonth);
}

function renderSummary() {
  const entries = monthEntries();
  const totals = calculateTotals(entries);
  const balance = totals.income - totals.expense;
  setText('income-total', money(totals.income));
  setText('expense-total', money(totals.expense));
  setText('balance-total', money(balance));
  byId('balance-total').classList.toggle('negative', balance < 0);

  const budget = state.budgets[selectedMonth];
  const remaining = budget ? budget - totals.expense : null;
  setText('budget-remaining', budget ? money(remaining) : tr('notDefined'));
  byId('budget-remaining').classList.toggle('negative', remaining !== null && remaining < 0);
  byId('budget-value').value = budget ? (budget / 100).toFixed(2).replace('.', ',') : '';

  const progress = byId('budget-progress');
  const percentage = budget ? Math.min((totals.expense / budget) * 100, 100) : 0;
  progress.style.width = `${percentage}%`;
  progress.classList.toggle('over', Boolean(budget && totals.expense > budget));
  if (!budget) setText('budget-message', tr('noBudget'));
  else if (remaining >= 0) setText('budget-message', tr('availableOf')(money(remaining), money(budget)));
  else setText('budget-message', tr('budgetExceeded')(money(Math.abs(remaining))));

  const expenses = entries.filter((entry) => entry.type === 'expense');
  const categoryTotals = expenses.reduce((result, entry) => {
    result[entry.category] = (result[entry.category] || 0) + entry.cents;
    return result;
  }, {});
  const largest = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  setText('savings-rate', totals.income ? `${((balance / totals.income) * 100).toFixed(1)}%` : '—');
  setText('expense-ratio', totals.income ? `${((totals.expense / totals.income) * 100).toFixed(1)}%` : '—');
  setText('average-expense', expenses.length ? money(Math.round(totals.expense / expenses.length)) : '—');
  setText('largest-category', largest ? categoryLabel(largest[0]) : '—');
}

function makeButton(label, className, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function renderCategoryChart() {
  const expenses = monthEntries().filter((entry) => entry.type === 'expense');
  const totals = expenses.reduce((result, entry) => {
    result[entry.category] = (result[entry.category] || 0) + entry.cents;
    return result;
  }, {});
  const data = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = data.reduce((sum, [, cents]) => sum + cents, 0);
  const chart = byId('category-chart');
  chart.replaceChildren();
  byId('category-chart-empty').hidden = data.length > 0;
  chart.hidden = data.length === 0;
  for (const [category, cents] of data) {
    const percentage = total ? (cents / total) * 100 : 0;
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = categoryLabel(category);
    const track = document.createElement('span');
    track.className = 'bar-track';
    const fill = document.createElement('span');
    fill.className = 'bar-fill';
    fill.style.width = `${percentage}%`;
    track.append(fill);
    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = `${percentage.toFixed(1)}%`;
    row.append(label, track, value);
    chart.append(row);
  }
}

function shiftMonth(month, offset) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function renderCashflowChart() {
  const months = Array.from({ length: 6 }, (_, index) => shiftMonth(selectedMonth, index - 5));
  const values = months.map((month) => {
    const totals = calculateTotals(entriesForMonth(state.entries, month));
    return totals.income - totals.expense;
  });
  const width = 420;
  const height = 190;
  const margin = { top: 16, right: 12, bottom: 32, left: 12 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = maximum - minimum || 1;
  const x = (index) => margin.left + (plotWidth * index) / (months.length - 1);
  const y = (value) => margin.top + ((maximum - value) / range) * plotHeight;
  const zeroY = y(0);
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
  const container = byId('cashflow-chart');
  container.replaceChildren();
  const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, 'aria-hidden': 'true' });
  svg.append(svgElement('line', { x1: margin.left, y1: zeroY, x2: width - margin.right, y2: zeroY, class: 'chart-zero' }));
  svg.append(svgElement('polygon', { points: `${margin.left},${zeroY} ${points} ${width - margin.right},${zeroY}`, class: 'chart-area' }));
  svg.append(svgElement('polyline', { points, class: 'chart-line' }));
  months.forEach((month, index) => {
    svg.append(svgElement('circle', { cx: x(index), cy: y(values[index]), r: 4, class: 'chart-point' }));
    const label = svgElement('text', { x: x(index), y: height - 9, class: 'chart-label' });
    const [year, monthNumber] = month.split('-').map(Number);
    label.textContent = new Intl.DateTimeFormat(state.lang, { month: 'short' }).format(new Date(year, monthNumber - 1, 1)).replace('.', '');
    svg.append(label);
  });
  container.setAttribute('aria-label', `${tr('cashFlow')}: ${values.map((value, index) => `${months[index]} ${money(value)}`).join(', ')}`);
  container.append(svg);
}

function renderCharts() {
  renderCategoryChart();
  renderCashflowChart();
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
  setText('entry-count', tr('entryCount')(totalInMonth));

  for (const entry of entries) {
    const card = document.createElement('article');
    card.className = 'entry-card';
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = entry.description || entry.category;
    const metadata = document.createElement('p');
    metadata.textContent = `${entry.date.split('-').reverse().join('/')} · ${categoryLabel(entry.category)}`;
    details.append(title, metadata);
    const value = document.createElement('div');
    value.className = `entry-value ${entry.type}`;
    value.textContent = `${entry.type === 'expense' ? '−' : '+'} ${money(entry.cents)}`;
    const actions = document.createElement('div');
    actions.className = 'entry-actions';
    actions.append(
      makeButton(tr('edit'), 'button button-secondary', () => startEditing(entry.id)),
      makeButton(tr('delete'), 'button button-secondary', () => requestDelete(entry.id))
    );
    card.append(details, value, actions);
    list.append(card);
  }
}

function render() {
  renderSummary();
  renderCharts();
  renderEntries();
}

function resetForm() {
  byId('entry-form').reset();
  byId('editing-id').value = '';
  byId('entry-date').value = selectedMonth === localDate().slice(0, 7) ? localDate() : `${selectedMonth}-01`;
  byId('save-entry').textContent = tr('addEntry');
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
  if (!entry.date || !entry.date.startsWith(`${selectedMonth}-`)) return showFormError(tr('invalidDate'));
  if (!CATEGORIES.includes(entry.category)) return showFormError(tr('chooseCategory'));
  if (!cents) return showFormError(tr('invalidValue'));
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
  byId('save-entry').textContent = tr('saveChange');
  byId('cancel-edit').hidden = false;
  byId('entry-title').scrollIntoView({ behavior: 'smooth' });
}

function requestDelete(id) {
  pendingDeleteId = id;
  const dialog = byId('delete-dialog');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else if (window.confirm(tr('deletedQuestion'))) deletePendingEntry();
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
      byId('budget-value').setCustomValidity(tr('invalidBudget'));
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
  setText('backup-status', tr('backupDownloaded'));
}

async function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = sanitizeState(JSON.parse(await file.text()));
    state = imported;
    saveState();
    applyLanguage();
    resetForm();
    render();
    setText('backup-status', tr('backupRestored'));
  } catch (error) {
    setText('backup-status', error.message || tr('backupFailed'));
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
  if (!entries.length) return setText('backup-status', tr('noCsvData'));
  const header = state.lang === 'en' ? ['Date', 'Type', 'Category', 'Description', 'Amount'] : ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
  const rows = [header, ...entries.map((entry) => [
    entry.date, entry.type === 'income' ? tr('incomeSingular') : tr('expense'), categoryLabel(entry.category), entry.description, (entry.cents / 100).toFixed(2).replace('.', ',')
  ])];
  download(`computabilis-${selectedMonth}.csv`, `\uFEFF${rows.map((row) => row.map(csvCell).join(';')).join('\r\n')}`, 'text/csv;charset=utf-8');
  setText('backup-status', tr('csvDownloaded'));
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  byId('language-select').value = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = tr(element.dataset.i18n);
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = tr(element.dataset.i18nPlaceholder);
  });
  const categoryOptions = [...byId('entry-category').options].slice(1);
  categoryOptions.forEach((option, index) => { option.textContent = CATEGORY_LABELS[state.lang][index]; });
  byId('save-entry').textContent = byId('editing-id').value ? tr('saveChange') : tr('addEntry');
  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const dark = state.theme === 'dark';
  byId('theme-button').textContent = dark ? tr('themeLight') : tr('themeDark');
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
  applyLanguage();
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
  byId('language-select').addEventListener('change', (event) => {
    state.lang = event.target.value === 'en' ? 'en' : 'pt-BR';
    saveState();
    applyLanguage();
    render();
  });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch((error) => console.error('Falha ao ativar o modo offline.', error));
}

if (typeof document !== 'undefined') init();
