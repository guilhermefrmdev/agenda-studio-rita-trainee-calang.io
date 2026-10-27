# Requisitos funcionais do projeto

| ID      | História                                            | Critério de aceitação                                                    | Prioridade    |
|---------|-----------------------------------------------------|--------------------------------------------------------------------------|---------------|
| `RF01`  | Cliente vê os serviços com duração e preço          | Ao abrir o sistema, os 4 serviços aparecem com nome, duração e preço     | `Obrigatório` |
| `RF02`  | Cliente vê os horários livres do dia para o serviço | Com um corte às 10:00, a escova não oferece 10:00 nem 10:30 no mesmo dia. Domingo não tem horários; nenhum serviço termina depois das 18:00 | `Obrigatório` |
| `RF03`  | Cliente agenda com nome e telefone                  | Sem nome ou telefone, o agendamento não é salvo e a cliente vê o motivo    | `Obrigatório` |
| `RF04`  | Sistema nunca aceita atendimentos sobrepostos       | A regra de conflito é uma função pura em src/regras/, com testes  | `Obrigatório` |
| `RF05`  | Rita vê a agenda do dia em ordem de horário         | O painel lista o dia em ordem de horário, com nome, telefone e serviço   | `Obrigatório` |
| `RF06`  | Rita cancela um agendamento                         | Depois de cancelar, o horário volta a aparecer como livre  | `Obrigatório` |
| `RF07`  | Rita bloqueia um horário                            | Pode bloquear um horário específico                | `Diferencial` |
| `RF08`  | Rita marca atendimento como concluído               | Após o atendimento, pode marcar como concluido                           | `Diferencial` |
| `Geral` | Os dados continuam lá depois de recarregar a página |                                                                          |               |