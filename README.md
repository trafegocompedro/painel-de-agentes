# painel-de-agentes

Mod para o [Claude Code](https://claude.com/claude-code) que mostra, num painel ao lado da conversa, os subagentes que o Claude abre durante uma tarefa. É a versão em português do [savvy-progress](https://github.com/johnnyvizz/claude-kit/tree/main/plugins/savvy-progress), de johnnyvizz.

## O que ele mostra

- **Painel de agentes** (`/agentes`): cada subagente em andamento, concluído ou planejado, com modelo, esforço, progresso da tarefa, uso de contexto, custo estimado e tempo. No topo, o custo, os tokens e o tempo somados. Os caranguejos dos subagentes em andamento andam; quem prefere menos movimento no sistema (`prefers-reduced-motion`) vê os caranguejos parados.
- **Barra de progresso** acima da caixa de mensagem: o nome do trabalho, a fase e as tarefas aceitas do total planejado. Ela aparece quando o Claude informa um plano pela ferramenta `progress` (a skill [savvy-flow](https://github.com/johnnyvizz/claude-kit/tree/main/plugins/savvy-flow) faz isso sozinha) ou quando começa um subagente `savvy-*`.

## Como instalar

**No app do Claude (desktop):** clique no **+** ao lado da caixa de mensagem, depois em **Plugins**, **Add marketplace** com `trafegocompedro/painel-de-agentes` e, por fim, **Add plugin**.

**Numa sessão do Claude Code no terminal:**

```
/plugin install painel-de-agentes --marketplace trafegocompedro/painel-de-agentes
```

Responda `y` para adicionar o marketplace e escolha o escopo (o primeiro, de usuário, vale para todas as sessões).

**Pelo terminal do sistema:**

```bash
claude plugin install painel-de-agentes --marketplace trafegocompedro/painel-de-agentes
```

## Como usar

- `/agentes` mostra ou esconde o painel.
- `/agentes abrir` abre o painel ou traz ele para a frente, sem fechar.
- Por padrão, o painel abre sozinho na primeira vez que um subagente começa em cada sessão.

## Configurações

As duas opções aparecem nas configurações do plugin. Para um mod carregado à mão, ficam em `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "painel-de-agentes": { "options": { "language": "pt", "autoOpen": "any" } } } }
```

- `language`: `pt` (padrão), `en`, `ru`, `he` ou `auto`. Com `auto`, segue o idioma do Claude Code e depois o do sistema.
- `autoOpen`: `any` (padrão) abre o painel com qualquer subagente; `savvy` só com os subagentes do savvy-flow ou quando um plano é informado.

## O custo é uma estimativa

O valor sai da contagem de tokens e do preço de lista de cada modelo, em dólar (tabela `PRICES` em `hooks/register.tsx`). Não é a sua fatura. Numa assinatura, o custo real é a mensalidade; o número serve para comparar o peso de cada subagente.

## Ferramentas que ele adiciona

- `mcp__painel-de-agentes__progress`: a sessão principal informa o plano, a fase e as tarefas aceitas. A chamada de um subagente é ignorada, para nenhum subagente renomear ou encerrar o trabalho.
- `mcp__painel-de-agentes__step`: cada subagente informa as próprias etapas (`done`, `total`, `note`). Sem isso, a barra do subagente mostra o uso de contexto em cinza.

## Versão do Claude Code

O mod usa os function hooks do Claude Code, uma API ainda em teste. Foi testado na versão 2.1.330 e pode parar de funcionar numa versão futura.

## Créditos e licença

Baseado no savvy-progress de [johnnyvizz](https://github.com/johnnyvizz/claude-kit), sob a licença MIT. Adaptado para o português pela [Tráfego com Pedro](https://github.com/trafegocompedro): textos em português, custo em US$ com vírgula, comando `/agentes` e painel abrindo com qualquer subagente. Licença MIT, no arquivo [LICENSE](LICENSE).
