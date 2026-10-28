# Decisões do Projeto

## Padrão de escrita:
### D0X — Formato dos horários
- Data:
- Quem propôs:
- Opções consideradas:
- Decisão e motivo:
- Consequências ou riscos:

--- 

### D01 — Padrões de commit
- Data: 26/10/2026
- Quem propôs: Guilherme Felipe
- Opções consideradas: Outros padrões de commit como o Gitmoji, etc...
- Decisão e motivo: Utilizar o Conventional Commits para estabelecer um padrão de commit para o projeto, evitando confusões nos commits.
- Consequências ou riscos: Pode acontecer de esquecer o padrão e dar um commit erradamente, enquanto não é acostumado ao padrão de commit.

### D02 — Padronização dos dados
- Data: 28/10
- Quem propôs: Guilherme Felipe e Gustavo Xenofonte
- Opções consideradas: Utilizar o LocalStorage, um key por agendamento ou utilizar somente uma key contendo todos os agendamentos.
- Decisão e motivo: Utilizar somente uma key do LocalStorage para armazenar uma lista de JSON, que contém os agendamentos, facilitando a consulta e armazenamento.
- Consequências ou riscos: Erros na consulta, JSON corrompido, JSON vazio.

### D03 — Definição de nomes padrões para ids e classes
- Data: 28/10
- Quem propôs: Guilherme Felipe e Gustavo Xenofonte
- Opções consideradas: Outras padronizações de nomes para os ids e classes
- Decisão e motivo: Padronização dos ids e classes para facilitar a comunicação entre o frontend e a persistência dos dados com o JavaScript.
- Consequências ou riscos: Não seguir a padronização pode quebrar o site.