import { SERVICOS } from '../regras/servicos.js';
import { criarRepositorio } from '../storage.js';

function lerFormulario() {

    const servicoEl = document.querySelector('.servico-card--selecionado');
    const horarioEl = document.querySelector('.horario-btn--selecionado');

    // Busca os dados e retorna o array com informações do agendamento
    return {
        servicoId: servicoEl ? servicoEl.dataset.servicoId : null, // busca o Id do serviço
        data: document.getElementById('campo-data').value,   // já vem "2026-10-28"
        inicio: horarioEl ? Number(horarioEl.dataset.inicio) : null, // busca o horário de inicio (em minutos, a partir de 00:00)
        nome: document.getElementById('campo-nome').value.trim(), // busca o nome
        telefone: document.getElementById('campo-telefone').value.replace(/\D/g, ''), // busca o telefone (só números)
    };
}

// Cria a conexão com o repositório
const repo = criarRepositorio();

document.getElementById('form-agendamento').addEventListener('submit', (evento) => {
    evento.preventDefault();               // impede a página de recarregar

    const { servicoId, data, inicio, nome, telefone } = lerFormulario();  // Busca os dados

    const servico = SERVICOS.find(s => s.id === servicoId); // Busca o serviço

    repo.adicionar({ servico, data, inicio, nome, telefone }); // Persiste o agendamento
});