import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'

// O que esta versão muda no savvy-progress: português por padrão, o comando
// /agentes e o painel abrindo sozinho com qualquer subagente.

const PROGRESS = 'mcp__painel-de-agentes__progress'
const PANE = 'savvy-agents'

async function start($: Engine, on: On) {
  mock.clock(on, { now: Date.parse('2026-11-23T12:00:00Z') })
  // O sistema em inglês não muda o idioma: a opção padrão é pt.
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  on('command.register', () => ({ value: { command: 'agentes' } }) as never)
  on('tool.register', (_$, e) => ({ value: { tool: `mcp__painel-de-agentes__${e.name}` } }) as never)
  on('agent.spawn', () => ({ model: 'claude-opus-5-5', agentId: 'a1' }))
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'desktop', isInteractive: true } as never)
}

// Registra os painéis que o mod abre.
function opened(on: On): string[] {
  const ids: string[] = []
  on('ui.open', (_$, e) => {
    ids.push(e.id)
    return { value: { isPlaced: true } }
  })
  return ids
}

async function spawn($: Engine) {
  await $.agent.spawn({ tool_use_id: 't1', prompt: 'p', description: 'Ler o relatório', subagentType: 'general-purpose', provider: 'engine', parentModel: 'claude-opus-5-5', background: false, fork: false } as never)
}

test('idioma: português por padrão, mesmo com o sistema em inglês', async ($, on) => {
  await start($, on)
  expect(await $.tool.call({ tool: PROGRESS, title: 'Relatório', phase: 'delegate', total: 2 } as never)).toMatchObject({ result: 'ok: Tarefas 0/2' })
})

test('idioma: a opção en volta para o inglês', { options: { language: 'en' } }, async ($, on) => {
  await start($, on)
  expect(await $.tool.call({ tool: PROGRESS, title: 'Report', phase: 'delegate', total: 2 } as never)).toMatchObject({ result: 'ok: Tasks 0/2' })
})

test('/agentes abrir abre o painel e responde em português', async ($, on) => {
  const ids = opened(on)
  await start($, on)
  const ran = await $.command.run({ command: 'agentes', args: 'abrir' } as never)
  expect(ran).toMatchObject({ text: 'Painel de agentes aberto.' })
  expect(ids).toEqual([PANE])
})

test('painel: abre sozinho quando qualquer subagente começa', async ($, on) => {
  const ids = opened(on)
  await start($, on)
  await spawn($)
  expect(ids).toEqual([PANE])
})

test('painel: com autoOpen savvy, um subagente comum não abre o painel', { options: { autoOpen: 'savvy' } }, async ($, on) => {
  const ids = opened(on)
  await start($, on)
  await spawn($)
  expect(ids).toEqual([])
})

test('painel: textos, custo e tokens em português', async ($, on) => {
  on('ui.open', () => ({ value: { isPlaced: true } }))
  await start($, on)
  await spawn($)
  const ui = await $.ui.mount({
    plugin: 'painel-de-agentes',
    surface: 'terminal',
    component: 'Pane',
    requestId: PANE,
    props: { title: '', isFocused: false, bodyColumns: 60, placement: 'dock', scroll: { offset: 0, bodyRows: 30 }, view: {} },
  })
  expect(await ui.find({ type: 'Text', text: /Em andamento · 1/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /≈US\$0,00 · 0 tokens/ })).toBeDefined()
  await ui.unmount()
})
