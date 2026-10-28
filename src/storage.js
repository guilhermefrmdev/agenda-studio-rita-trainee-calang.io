import { cancelarAgendamento } from './regras/cancelamento.js';
import { acharConflito } from './regras/conflito.js';

const CHAVE = 'studio-rita:v1';
const VAZIO = { agendamentos: [] };

export function criarRepositorio(storage = globalThis.localStorage) {
    function carregar() {
        try {
        const bruto = storage.getItem(CHAVE);
        if (!bruto) return structuredClone(VAZIO);
        const parsed = JSON.parse(bruto);

        return { agendamentos: Array.isArray(parsed.agendamentos) ? parsed.agendamentos : [] };
        } catch {
            return structuredClone(VAZIO);
        }
    }

    function salvar(dados) {
        storage.setItem(CHAVE, JSON.stringify(dados));
    }

    return {
        adicionar({ servico, data, inicio, nome, telefone }) {
            if (!nome || !nome.trim() || !telefone || !telefone.trim()) {
                return { ok: false, motivo: 'Informe nome e telefone.' };
            }

            if (!servico || !servico.id || !servico.duracao) {
                return { ok: false, motivo: 'Dados do serviço inválidos.' };
            }

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

            const dados = carregar();

            // Procura se já existe um agendamento nesse horário
            const conflito = acharConflito(novoAgendamento, dados.agendamentos);

            if (conflito) {
                // Achou conflito, então não salva
                return { ok: false, motivo: 'Esse horário já está ocupado.' };
            }

            dados.agendamentos.push(novoAgendamento);
            salvar(dados);

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