import test from 'node:test'
import assert from 'node:assert'
import { criarRepositorio } from '../storage.js'

// Testes da função listarAgendaDoDia (arquivo: storage.js, dentro de criarRepositorio)

// O que a função faz:
//   Recebe a data ("AAAA-MM-DD") e devolve os agendamentos daquele dia,
//   lidos do LocalStorage, em ordem de horário (do mais cedo para o mais tarde).
//   - Traz os status "agendado" e "concluido"
//   - Não traz os "cancelado"
//   - Cada item tem: id, servicoId, data, inicio, duracao, nome, telefone, status

// Storage falso (em memória), para não depender do navegador
function criarStorageFalso() {
    const memoria = {}
    return {
        getItem: (chave) => memoria[chave] ?? null,
        setItem: (chave, valor) => { memoria[chave] = valor },
    }
}

// Serviços usados nos testes
const corte = { id: 'corte', duracao: 60 }
const escova = { id: 'escova', duracao: 30 }
const coloracao = { id: 'coloracao', duracao: 90 }

// Datas usadas nos testes
const QUARTA = '2026-10-28'
const QUINTA = '2026-10-29'

// Cada teste começa com um repositório novo e vazio
function novoRepo() {
    return criarRepositorio(criarStorageFalso())
}

// Agenda e garante que deu certo
function agendar(repo, servico, data, inicio, nome = 'Maria', telefone = '88999999999') {
    const r = repo.adicionar({ servico, data, inicio, nome, telefone })
    assert.ok(r.ok)
    return r.agendamento
}

// Pega só os inícios de uma lista de agendamentos
const inicios = (lista) => lista.map((a) => a.inicio)

test('Agenda do dia vem em ordem de horário, mesmo agendada fora de ordem', function () {
    const repo = novoRepo()
    agendar(repo, corte, QUARTA, 840)     // 14:00
    agendar(repo, escova, QUARTA, 540)    // 09:00
    agendar(repo, coloracao, QUARTA, 600) // 10:00
    agendar(repo, escova, QUARTA, 480)    // 08:00
    assert.deepEqual(inicios(repo.listarAgendaDoDia(QUARTA)), [480, 540, 600, 840])
})

test('Cada item traz nome, telefone e serviço', function () {
    const repo = novoRepo()
    agendar(repo, corte, QUARTA, 600, 'Maria', '88999999999')
    const [item] = repo.listarAgendaDoDia(QUARTA)
    assert.equal(item.nome, 'Maria')
    assert.equal(item.telefone, '88999999999')
    assert.equal(item.servicoId, 'corte')
    assert.equal(item.inicio, 600)
    assert.equal(item.duracao, 60)
    assert.equal(item.status, 'agendado')
})

test('Traz só os agendamentos da data pedida', function () {
    const repo = novoRepo()
    agendar(repo, corte, QUARTA, 600)
    agendar(repo, corte, QUINTA, 540)
    const agenda = repo.listarAgendaDoDia(QUARTA)
    assert.equal(agenda.length, 1)
    assert.equal(agenda[0].data, QUARTA)
})

test('Dia sem agendamentos: lista vazia', function () {
    const repo = novoRepo()
    assert.deepEqual(repo.listarAgendaDoDia(QUARTA), [])
})

test('Agendamento cancelado não aparece na agenda (RF06)', function () {
    const repo = novoRepo()
    const a = agendar(repo, corte, QUARTA, 600)
    agendar(repo, escova, QUARTA, 540)
    repo.cancelar(a.id)
    assert.deepEqual(inicios(repo.listarAgendaDoDia(QUARTA)), [540])
})

test('Agendamento concluído continua aparecendo na agenda (RF08)', function () {
    // Não existe função para concluir ainda, então gravamos direto no storage
    const storage = criarStorageFalso()
    storage.setItem('studio-rita:v1', JSON.stringify({
        agendamentos: [
            { id: '1', servicoId: 'corte', data: QUARTA, inicio: 600, duracao: 60, nome: 'Ana', telefone: '1', status: 'concluido' },
            { id: '2', servicoId: 'escova', data: QUARTA, inicio: 540, duracao: 30, nome: 'Bia', telefone: '2', status: 'agendado' },
        ],
    }))
    const repo = criarRepositorio(storage)
    const agenda = repo.listarAgendaDoDia(QUARTA)
    assert.deepEqual(inicios(agenda), [540, 600])
    assert.equal(agenda[1].status, 'concluido')
})

test('Lê do LocalStorage: um repositório novo com o mesmo storage enxerga a agenda', function () {
    const storage = criarStorageFalso()
    agendar(criarRepositorio(storage), corte, QUARTA, 600)
    const outroRepo = criarRepositorio(storage) // simula recarregar a página
    assert.deepEqual(inicios(outroRepo.listarAgendaDoDia(QUARTA)), [600])
})

test('Alterar o resultado não altera os dados salvos', function () {
    const repo = novoRepo()
    agendar(repo, corte, QUARTA, 600, 'Maria')
    const agenda = repo.listarAgendaDoDia(QUARTA)
    agenda[0].nome = 'Alterado'
    agenda.pop()
    assert.equal(repo.listarAgendaDoDia(QUARTA)[0].nome, 'Maria')
})

test('Storage com JSON corrompido: não quebra e retorna lista vazia', function () {
    const storage = criarStorageFalso()
    storage.setItem('studio-rita:v1', '{isso não é json')
    const repo = criarRepositorio(storage)
    assert.deepEqual(repo.listarAgendaDoDia(QUARTA), [])
})

test('Data ausente ou inválida: lista vazia', function () {
    const repo = novoRepo()
    agendar(repo, corte, QUARTA, 600)
    assert.deepEqual(repo.listarAgendaDoDia(), [])
    assert.deepEqual(repo.listarAgendaDoDia(''), [])
    assert.deepEqual(repo.listarAgendaDoDia(null), [])
    assert.deepEqual(repo.listarAgendaDoDia('abc'), [])
})
