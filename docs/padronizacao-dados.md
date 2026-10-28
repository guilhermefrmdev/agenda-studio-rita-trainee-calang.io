# Padronização da consulta e persistência dos dados

## Como vai ser inserido no LocalStorage
Será salvo no LocalStorage um item com a CHAVE = 'studio-rita:v1'

E como value será uma lista contendo itens no formato JSON, com as seguintes chaves:
| Chave     | Exemplo de Valor                      | Explicação                                                     |
|-----------|----------------------------------------|----------------------------------------------------------------|
| `id`        | "3f2b8c1e-9a4d-4e7b-b1c2-8d5f6a7e9c0d" | ID único para cada agendamento                                 |
| `servicoId` | "corte"                                | Identificador do tipo de serviço                               |
| `data`      | "2026-10-28"                           | Data do agendamento (sempre uma String)                        |
| `inicio`    | 600                                    | Horário do agendamento (minutos desde 00:00 (10:00))           |
| `duracao`   | 60                                     | Duração do serviço (em minutos)                                |
| `nome`      | "Maria"                                | Nome do usuário do agendamento                                 |
| `telefone`  | "88999999999"                          | Telefone do usuário do agendamento (String somente números)    |
| `status`    | "agendado"                             | Status do agendamento ("agendado" | "cancelado" | "concluido") |

Exemplo:
```JSON
[
{
    id: "3f2b8c1e-9a4d-4e7b-b1c2-8d5f6a7e9c0d",
    servicoId: "corte",
    data: "2026-10-28",
    inicio: 600,
    duracao: 60,
    nome: "Maria",
    telefone: "88999999999",
    status: "agendado"
}
]
```

## Quem fornece cada campo
 
| Campo                      | Origem                                                    |
|----------------------------|-----------------------------------------------------------|
| `servicoId`                | Front (serviço selecionado)                               |
| `data`                     | Front (input de data)                                     |
| `inicio`                   | Front (horário selecionado)                               |
| `nome`, `telefone`         | Front (inputs de texto)                                   |
| `duracao`                  | Catálogo de serviços, a partir do `servicoId` (nunca da tela) |
| `id`, `status`             | Gerados pelo repositório (`status` inicia como `"agendado"`) |
 
## Serviços (valores de `data-servico-id`)
 
| `servicoId`   | Nome       | Duração | Preço   |
|---------------|------------|---------|---------|
| `corte`       | Corte      | 60 min  | R$ 50   |
| `escova`      | Escova     | 30 min  | R$ 35   |
| `manicure`    | Manicure   | 30 min  | R$ 25   |
| `coloracao`   | Coloração  | 90 min  | R$ 120  |
 
---
 
## Contrato de IDs e classes para o Frontend
 
### Regras gerais
 
- **`id`**: elementos que aparecem **uma única vez** na página.
- **`class`**: elementos que **se repetem** (cards, botões de horário, itens da agenda).
- **`data-*`**: carregam valores usados pelo JavaScript (id do serviço, minutos, id do agendamento).
- **Estado selecionado**: classe modificadora `--selecionado`.
- **Não renomeie** nenhum seletor abaixo sem avisar o time de JavaScript.
 
### Aba "Agendar"
 
| Elemento                    | Seletor                                              |
|-----------------------------|------------------------------------------------------|
| Container dos serviços      | `#lista-servicos`                                    |
| Card de serviço (repete)    | `.servico-card` + `data-servico-id="corte"`          |
| Card selecionado            | `.servico-card--selecionado`                         |
| Input de data               | `#campo-data` (`type="date"`)                        |
| Container dos horários      | `#lista-horarios`                                    |
| Botão de horário (repete)   | `.horario-btn` + `data-inicio="600"`                 |
| Horário selecionado         | `.horario-btn--selecionado`                          |
| Formulário                  | `#form-agendamento`                                  |
| Input nome                  | `#campo-nome` (`type="text"`)                        |
| Input telefone              | `#campo-telefone` (`type="tel"`)                     |
| Botão de envio              | `#btn-agendar` (`type="submit"`)                     |
 
### Aba "Painel da Rita"
 
| Elemento                      | Seletor                                                              |
|-------------------------------|----------------------------------------------------------------------|
| Input de data                 | `#painel-data` (`type="date"`)                                       |
| Container da agenda           | `#lista-agenda`                                                      |
| Atendimento (repete)          | `.agenda-item` + `data-id="<id do agendamento>"`                     |
| Campos dentro do atendimento  | `.agenda-horario`, `.agenda-servico`, `.agenda-nome`, `.agenda-telefone` |
| Botão cancelar                | `.btn-cancelar`                                                      |