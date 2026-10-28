import { cancelarAgendamento } from './regras/cancelamento.js';
import { acharConflito } from './regras/conflito.js';

const CHAVE = 'studio-rita:v1';
const VAZIO = { agendamentos: [] };

// Função que retorna as funções relacionadas com a persistência dos dados
export function criarRepositorio(storage = globalThis.localStorage) {
    // Função que carrega os dados do LocalStorage e retorna um Array com os agendamentos formato JSON
    function carregar() {
        try {
        const bruto = storage.getItem(CHAVE);
        if (!bruto) return structuredClone(VAZIO); // Se estiver vazio retorna um clone da constante VAZIO
        const parsed = JSON.parse(bruto);

        // Garante que agendamentos seja sempre um array
        return { agendamentos: Array.isArray(parsed.agendamentos) ? parsed.agendamentos : [] };
        } catch {
            return structuredClone(VAZIO);
        }
    }

    // Função que persiste os dados no LocalStorage
    function salvar(dados) {
        storage.setItem(CHAVE, JSON.stringify(dados));
    }

    // Retorna as funções
    return {
        // Adiciona um agendamento no array e persiste no LocalStorage
        adicionar({ servico, data, inicio, nome, telefone }) {
            // Verifica as informações do nome e telefone
            if (!nome || !nome.trim() || !telefone || !telefone.trim()) {
                return { ok: false, motivo: 'Informe nome e telefone.' };
            }

            // Verifica as informações do serviço
            if (!servico || !servico.id || !servico.duracao) {
                return { ok: false, motivo: 'Dados do serviço inválidos.' };
            }

            // Cria o novo agendamento
            const novoAgendamento = {
                id: crypto.randomUUID(),
                servicoId: servico.id,
                data,
                inicio,
                duracao: servico.duracao,
                nome: nome.trim(),
                telefone: telefone.trim(),
                status: 'agendado',
            };

            // Adiciona e persiste o agendamento
            const dados = carregar();

            // Procura se já existe um agendamento nesse horário
            const conflito = acharConflito(novoAgendamento, dados.agendamentos);

            if (conflito) {
                // Achou conflito, então não salva
                return { ok: false, motivo: 'Esse horário já está ocupado.' };
            }

            dados.agendamentos.push(novoAgendamento);
            salvar(dados);

            // Retorna a confirmação que o agendamento foi feito e o mesmo
            return { ok: true, agendamento: novoAgendamento };
        },

        // Cancela um agendamento pelo id
        cancelar(id) {
            const dados = carregar();

            // Troca o status do agendamento para "cancelado"
            const cancelado = cancelarAgendamento(id, dados.agendamentos);

            if (cancelado === null) {
                // Não achou o id, ou o agendamento já não estava como "agendado"
                return { ok: false, motivo: 'Agendamento não encontrado ou já finalizado.' };
            } else {
                salvar(dados);
                return { ok: true, agendamento: cancelado };
            }
        },

        // Retorna a lista de horários de um dia para um serviço, marcando cada um como livre ou ocupado
        // filtro: 'todos' (padrão) | 'livres' | 'ocupados'
        // Retorno: [{ inicio: 600, fim: 660, livre: true }, ...] (inicio e fim em minutos desde 00:00)
        listarHorarios({ servico, data, filtro = 'todos' }) {
            const ABERTURA = 8 * 60;     // 08:00 (ajustar se a Rita definir outro horário)
            const FECHAMENTO = 18 * 60;  // 18:00 (nenhum serviço pode terminar depois disso)
            const PASSO = 30;            // intervalo entre os horários oferecidos (minutos)

            // Valida o serviço
            if (!servico || !servico.duracao) return [];

            // Valida a data (formato "AAAA-MM-DD")
            const partes = typeof data === 'string' ? data.split('-').map(Number) : [];
            if (partes.length !== 3 || partes.some(Number.isNaN)) return [];

            // Monta a data local (evita erro de fuso horário) e confere se é uma data real
            const [ano, mes, dia] = partes;
            const dataObj = new Date(ano, mes - 1, dia);
            if (dataObj.getFullYear() !== ano || dataObj.getMonth() !== mes - 1 || dataObj.getDate() !== dia) return [];

            // Domingo não tem horários
            if (dataObj.getDay() === 0) return [];

            const { agendamentos } = carregar();
            const horarios = [];

            // Percorre o dia em passos de 30 min, só até onde o serviço ainda termina às 18:00
            for (let inicio = ABERTURA; inicio + servico.duracao <= FECHAMENTO; inicio += PASSO) {
                const candidato = { data, inicio, duracao: servico.duracao };
                const livre = acharConflito(candidato, agendamentos) === null;
                horarios.push({ inicio, fim: inicio + servico.duracao, livre });
            }

            if (filtro === 'livres') return horarios.filter(h => h.livre);
            if (filtro === 'ocupados') return horarios.filter(h => !h.livre);
            return horarios;
        },

        // Retorna a agenda de um dia (lida do LocalStorage) em ordem de horário
        // Traz os agendamentos "agendado" e "concluido"; os "cancelado" ficam de fora
        // Retorno: [{ id, servicoId, data, inicio, duracao, nome, telefone, status }, ...]
        listarAgendaDoDia(data) {
            // Valida a data
            if (typeof data !== 'string' || !data) return [];

            const { agendamentos } = carregar();

            return agendamentos
                .filter(a => a.data === data && a.status !== 'cancelado')
                .map(a => ({ ...a })) // devolve cópias, para não alterar os dados do repositório
                .sort((a, b) => a.inicio - b.inicio); // do mais cedo para o mais tarde
        },
    };
}
