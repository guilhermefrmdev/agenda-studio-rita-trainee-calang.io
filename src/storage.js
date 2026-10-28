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
        }
    };
}
