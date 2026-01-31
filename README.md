# Computabilis

Sistema profissional de gestão financeira pessoal com interface web moderna, gráficos interativos e funcionalidades de importação/exportação.

## Descrição

Aplicação web single-page para controle financeiro que permite registro, categorização e análise de receitas e despesas com persistência local via LocalStorage e capacidade de exportação para CSV/PDF.

## Demonstração

**URL de Produção:** https://luddevergard3n.github.io/Computabilis/

**Repositório GitHub:** https://github.com/LuddEvergard3n/Computabilis

## Tecnologias

### Stack Tecnológico
- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript ES6+ (Vanilla)
- LocalStorage API
- Service Worker (PWA)
- Web App Manifest

### Padrões e Bibliotecas
- **Armazenamento:** LocalStorage para persistência client-side
- **Arquitetura:** MVC simplificado
- **PWA:** Progressive Web App com Service Worker e cache offline
- **Responsividade:** Mobile-first com CSS Grid e media queries

## Funcionalidades

### Gestão de Lançamentos
- Registro de receitas e despesas com campos:
  - Data (campo date picker HTML5)
  - Tipo (Receita/Despesa via dropdown)
  - Categoria (16 categorias pré-definidas)
  - Valor (campo numérico com validação)
  - Descrição (campo textarea opcional)
- Listagem tabular com opção de exclusão individual
- Confirmação antes de deletar lançamentos

### Categorias Pré-definidas
```
Academia, Água, Aluguel, Beleza, Combustível, Cursos, Delivery,
Educação, Farmácia, Gás, Higiene Pessoal, Hobbies, Internet,
Investimentos, Lazer, Livros
```

### Dashboard de Indicadores
**Métricas Principais**
- Receitas totais (verde: `#00ff88`)
- Despesas totais (vermelho: `#ff4466`)
- Saldo atual (azul: `#4488ff`)

**Metas Configuráveis (via prompt)**
- Meta mensal (padrão: R$ 3000.00, roxo: `#aa88ff`)
- Patrimônio total (padrão: R$ 0.00, laranja: `#ffaa44`)

**Estatísticas Calculadas**
- Categoria mais frequente (contagem de ocorrências)
- Ticket médio (valor total ÷ quantidade)
- Total de lançamentos

### Importação e Exportação

**Exportação CSV**
- Formato: `Data,Tipo,Categoria,Descrição,Valor`
- Nome do arquivo: `computabilis_YYYY-MM-DD.csv`
- Encoding: UTF-8

**Exportação PDF**
- Status: Placeholder (sugestão de usar Ctrl+P)
- Funcionalidade completa não implementada

**Importação**
- Formatos suportados: CSV, JSON
- Upload via input file
- Validação e merge com dados existentes
- Feedback de quantidade de registros importados

### Internacionalização
Estrutura preparada para i18n com seletor de idiomas:
- Português (PT) - padrão
- Inglês (EN) - implementado
- Espanhol (ES) - implementado

**Nota:** A funcionalidade de tradução não está implementada no código atual.

### Interface do Usuário
- Tema escuro (dark mode único)
- Design responsivo (breakpoint: 768px)
- Gradientes em botões de ação
- Transições suaves (0.3s)
- Estados hover com elevação visual

## Estrutura de Dados

### Modelo de Lançamento
```javascript
{
  date: "YYYY-MM-DD",        // String ISO 8601
  type: "income|expense",    // String enum
  category: "string",        // Uma das 16 categorias
  value: number,             // Float
  description: "string"      // Texto livre
}
```

### Modelo de Configuração
```javascript
{
  entries: Array<Entry>,     // Array de lançamentos
  monthlyGoal: number,       // Meta mensal (padrão: 3000)
  patrimony: number          // Patrimônio (padrão: 0)
}
```

### Estrutura LocalStorage
**Chave:** `computabilis-data`  
**Formato:** JSON stringificado  
**Persistência:** Permanente até limpeza manual do navegador

## Arquitetura de Arquivos

```
Computabilis/
├── index.html              # Estrutura HTML principal
├── style.css               # Estilos e tema escuro
├── app.js                  # Lógica da aplicação
├── manifest.json           # Configuração PWA
├── sw.js                   # Service Worker
└── LICENSE                 # MIT License
```

## Instalação e Execução

### Pré-requisitos
- Navegador moderno com suporte a ES6+ e LocalStorage
- Servidor HTTP para desenvolvimento (opcional)

### Execução Local

**Método 1: Abertura Direta**
```bash
git clone https://github.com/LuddEvergard3n/Computabilis.git
cd Computabilis
# Abrir index.html no navegador
```

**Método 2: Servidor HTTP (Recomendado)**
```bash
# Python 3
cd Computabilis
python3 -m http.server 8000
# Acesse: http://localhost:8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Instalação como PWA
1. Acesse o site via HTTPS (GitHub Pages ou localhost com certificado)
2. Chrome/Edge: Ícone de instalação na barra de endereços
3. Safari iOS: Compartilhar > Adicionar à Tela Inicial

## Guia de Uso

### Adicionar Lançamento
1. Preencher data (padrão: hoje)
2. Selecionar tipo (Despesa ou Receita)
3. Escolher categoria
4. Inserir valor (validação numérica automática)
5. Adicionar descrição (opcional)
6. Clicar em "+ Adicionar"

### Definir Meta Mensal
1. Clicar no card "Meta Mensal (clique)"
2. Inserir valor no prompt
3. Validação: número >= 0

### Definir Patrimônio
1. Clicar no card "Patrimônio (clique)"
2. Inserir valor no prompt
3. Validação: número >= 0

### Exportar Dados

**CSV:**
```bash
# Ação: Clicar no botão "⬇ CSV"
# Resultado: Download de computabilis_YYYY-MM-DD.csv
# Formato:
Data,Tipo,Categoria,Descrição,Valor
2026-01-31,expense,Aluguel,"Aluguel janeiro",1500.00
```

**PDF:**
```bash
# Funcionalidade não implementada
# Alternativa: Ctrl+P / Cmd+P > Salvar como PDF
```

### Importar Dados

**JSON:**
```json
{
  "entries": [
    {
      "date": "2026-01-31",
      "type": "expense",
      "category": "Aluguel",
      "value": 1500.00,
      "description": "Aluguel janeiro"
    }
  ],
  "monthlyGoal": 3000.00,
  "patrimony": 50000.00
}
```

**CSV:**
```csv
Data,Tipo,Categoria,Descrição,Valor
2026-01-31,expense,Aluguel,"Aluguel janeiro",1500.00
2026-01-31,income,Salário,"Salário janeiro",5000.00
```

## Funcionalidades Implementadas

### Core
- [x] Adicionar lançamentos (receitas/despesas)
- [x] Deletar lançamentos (com confirmação)
- [x] Cálculo automático de totais
- [x] Persistência via LocalStorage
- [x] Inicialização com data atual

### Estatísticas
- [x] Categoria mais frequente
- [x] Ticket médio
- [x] Contagem total

### Exportação
- [x] Exportação CSV funcional
- [ ] Exportação PDF (placeholder)

### Importação
- [x] Importação JSON
- [x] Importação CSV
- [x] Merge com dados existentes

### PWA
- [x] Service Worker registrado
- [x] Manifest configurado
- [x] Cache offline básico

### Interface
- [x] Design responsivo
- [x] Tema escuro
- [x] Transições e animações

## Limitações Conhecidas

### Armazenamento
- Persistência limitada ao LocalStorage (5-10MB por domínio)
- Dados perdidos ao limpar cache do navegador
- Sem backup automático
- Sem sincronização multi-dispositivo

### Funcionalidades
- Categorias fixas (não permite criação via UI)
- Sem edição de lançamentos existentes
- Sem filtros ou busca
- Exportação PDF não funcional

## Compatibilidade

### Navegadores Testados
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Requisitos Mínimos
- JavaScript ES6
- LocalStorage
- Fetch API
- Service Worker (para PWA)

### Dispositivos
- Desktop: Windows, macOS, Linux
- Mobile: iOS 14+, Android 10+
- Tablet: Responsivo

## Segurança

### Considerações
- Dados não criptografados no LocalStorage
- Sem autenticação
- Sem proteção contra XSS (mitigado por uso de textContent)
- Dados acessíveis via DevTools

### Recomendações
- Não armazenar dados financeiros sensíveis
- Fazer backup manual regular (exportar CSV)
- Usar HTTPS em produção (GitHub Pages fornece)

## Performance

### Otimizações Implementadas
- Carregamento estático (sem dependências externas)
- Processamento client-side
- Service Worker para cache offline
- CSS inline e minificado
- JavaScript vanilla (sem frameworks)

### Métricas Estimadas
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Bundle Size: ~21KB total (HTML+CSS+JS)

## Desenvolvimento

### Estrutura de Código

**app.js - Funções Principais:**
```javascript
loadData()           // Carrega do LocalStorage
saveData()           // Salva no LocalStorage
updateUI()           // Atualiza toda interface
updateSummary()      // Calcula totais
updateStats()        // Calcula estatísticas
updateEntries()      // Renderiza tabela
deleteEntry(index)   // Remove lançamento
setMonthlyGoal()     // Define meta via prompt
setPatrimony()       // Define patrimônio via prompt
exportCSV()          // Gera e baixa CSV
importData()         // Processa upload de arquivo
```

### Personalização

**Alterar Categorias:**
```html
<!-- index.html linha ~94 -->
<select id="entry-category" required>
    <option value="Nova Categoria">Nova Categoria</option>
</select>
```

**Alterar Cores:**
```css
/* style.css linha 1-15 */
:root {
    --income-color: #00ff88;
    --expense-color: #ff4466;
    --balance-color: #4488ff;
}
```

**Alterar Meta Padrão:**
```javascript
// app.js linha 3
let monthlyGoal = 5000.00;  // Nova meta padrão
```

## Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abrir Pull Request

### Guidelines
- Manter código vanilla JavaScript (sem frameworks)
- Seguir estilo de código existente
- Testar em múltiplos navegadores
- Atualizar README quando necessário
- Manter compatibilidade com LocalStorage

## Licença

MIT License

Copyright (c) 2025 Ludd Evergarden

Consultar arquivo LICENSE para detalhes completos.

## Autor

**Ludd Evergarden**
- GitHub: [@LuddEvergard3n](https://github.com/LuddEvergard3n)

## Links

- **Repositório:** https://github.com/LuddEvergard3n/Computabilis
- **Demo:** https://luddevergard3n.github.io/Computabilis/

## Agradecimentos

Projeto desenvolvido como ferramenta pessoal de gestão financeira, disponibilizado open-source para a comunidade.

---

**Última Atualização:** 2026-01-31  
**Versão:** 1.0.0  
**Status:** Produção (funcional com limitações documentadas)
