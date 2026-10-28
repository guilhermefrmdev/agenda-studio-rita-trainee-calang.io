import test from 'node:test'
import assert from 'node:assert'
import { criarRepositorio } from '../storage.js'

// Testes da função listarHorarios (arquivo: storage.js, dentro de criarRepositorio)

// O que a função faz:
//   Recebe { servico, data, filtro } e devolve a lista de horários do dia
//   no formato [{ inicio, fim, livre }, ...] (inicio e fim em minutos desde 00:00).
//   - filtro 'todos' (padrão): todos os horários, livres e ocupados
//   - filtro 'livres': só os livres
//   - filtro 'ocupados': só os ocupados

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
const DOMINGO = '2026-11-01'

// Cada teste começa com um repositório novo e vazio
function novoRepo() {
    return criarRepositorio(criarStorageFalso())
}

// Agenda um corte às 10:00 (600) na quarta
function agendarCorteAs10(repo) {
    const r = repo.adicionar({ servico: corte, data: QUARTA, inicio: 600, nome: 'Maria', telefone: '88999999999' })
    assert.ok(r.ok)
    return r.agendamento
}

// Pega só os inícios de uma lista de horários
const inicios = (lista) => lista.map((h) => h.inicio)

test('Com um corte às 10:00, a escova não oferece 10:00 nem 10:30', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const livres = inicios(repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'livres' }))
    assert.ok(!livres.includes(600))
    assert.ok(!livres.includes(630))
})

test('Com um corte às 10:00, a escova oferece 09:30 e 11:00', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const livres = inicios(repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'livres' }))
    assert.ok(livres.includes(570))
    assert.ok(livres.includes(660))
})

test('Domingo não tem horários', function () {
    const repo = novoRepo()
    assert.deepEqual(repo.listarHorarios({ servico: corte, data: DOMINGO }), [])
})

test('Nenhum serviço termina depois das 18:00', function () {
    const repo = novoRepo()
    for (const servico of [corte, escova, coloracao]) {
        const horarios = repo.listarHorarios({ servico, data: QUARTA })
        assert.ok(horarios.length > 0)
        for (const h of horarios) {
            assert.ok(h.fim <= 18 * 60)
        }
    }
})

test('Último horário da coloração (90 min) é 16:30', function () {
    const repo = novoRepo()
    const horarios = repo.listarHorarios({ servico: coloracao, data: QUARTA })
    assert.equal(horarios.at(-1).inicio, 990)
    assert.equal(horarios.at(-1).fim, 1080)
})

test('Último horário do corte (60 min) é 17:00', function () {
    const repo = novoRepo()
    const horarios = repo.listarHorarios({ servico: corte, data: QUARTA })
    assert.equal(horarios.at(-1).inicio, 1020)
})

// ---------- Formato e filtros ----------

test('Dia sem agendamentos: todos os horários estão livres', function () {
    const repo = novoRepo()
    const horarios = repo.listarHorarios({ servico: escova, data: QUARTA })
    assert.ok(horarios.length > 0)
    assert.ok(horarios.every((h) => h.livre))
})

test('Cada horário tem inicio, fim e livre; fim = inicio + duração', function () {
    const repo = novoRepo()
    const [primeiro] = repo.listarHorarios({ servico: corte, data: QUARTA })
    assert.deepEqual(primeiro, { inicio: 480, fim: 540, livre: true })
})

test('Filtro "todos" é o padrão e traz livres e ocupados', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const padrao = repo.listarHorarios({ servico: escova, data: QUARTA })
    const todos = repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'todos' })
    assert.deepEqual(padrao, todos)
    assert.ok(todos.some((h) => h.livre))
    assert.ok(todos.some((h) => !h.livre))
})

test('Filtro "ocupados" traz só os ocupados (10:00 e 10:30 para a escova)', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const ocupados = repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'ocupados' })
    assert.deepEqual(inicios(ocupados), [600, 630])
    assert.ok(ocupados.every((h) => !h.livre))
})

test('Livres + ocupados = todos', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const todos = repo.listarHorarios({ servico: escova, data: QUARTA })
    const livres = repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'livres' })
    const ocupados = repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'ocupados' })
    assert.equal(livres.length + ocupados.length, todos.length)
})

// ---------- Conflitos com a duração do serviço ----------

test('Corte (60 min) não oferece 09:30, pois invadiria o corte das 10:00', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const livres = inicios(repo.listarHorarios({ servico: corte, data: QUARTA, filtro: 'livres' }))
    assert.ok(!livres.includes(570)) // 09:30 -> 10:30 sobrepõe
    assert.ok(livres.includes(540))  // 09:00 -> 10:00 encosta, mas não sobrepõe
    assert.ok(livres.includes(660))  // 11:00 começa quando o outro termina
})

test('Coloração (90 min) bloqueia mais horários para a escova', function () {
    const repo = novoRepo()
    repo.adicionar({ servico: coloracao, data: QUARTA, inicio: 600, nome: 'Ana', telefone: '88988888888' })
    const ocupados = inicios(repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'ocupados' }))
    assert.deepEqual(ocupados, [600, 630, 660]) // 10:00 até 11:30
})

// ---------- Outros dias e cancelamento ----------

test('Agendamento em um dia não afeta outro dia', function () {
    const repo = novoRepo()
    agendarCorteAs10(repo)
    const horarios = repo.listarHorarios({ servico: escova, data: QUINTA })
    assert.ok(horarios.every((h) => h.livre))
})

test('Depois de cancelar, o horário volta a aparecer como livre (RF06)', function () {
    const repo = novoRepo()
    const agendamento = agendarCorteAs10(repo)
    repo.cancelar(agendamento.id)
    const livres = inicios(repo.listarHorarios({ servico: escova, data: QUARTA, filtro: 'livres' }))
    assert.ok(livres.includes(600))
    assert.ok(livres.includes(630))
})

// ---------- Entradas inválidas ----------

test('Serviço ausente ou sem duração: lista vazia', function () {
    const repo = novoRepo()
    assert.deepEqual(repo.listarHorarios({ servico: null, data: QUARTA }), [])
    assert.deepEqual(repo.listarHorarios({ servico: undefined, data: QUARTA }), [])
    assert.deepEqual(repo.listarHorarios({ servico: { id: 'x' }, data: QUARTA }), [])
})

test('Data ausente ou inválida: lista vazia', function () {
    const repo = novoRepo()
    assert.deepEqual(repo.listarHorarios({ servico: corte, data: '' }), [])
    assert.deepEqual(repo.listarHorarios({ servico: corte, data: undefined }), [])
    assert.deepEqual(repo.listarHorarios({ servico: corte, data: 'abc' }), [])
    assert.deepEqual(repo.listarHorarios({ servico: corte, data: '2026-02-31' }), [])
})

test('Storage com JSON corrompido: não quebra e retorna tudo livre', function () {
    const storage = criarStorageFalso()
    storage.setItem('studio-rita:v1', '{isso não é json')
    const repo = criarRepositorio(storage)
    const horarios = repo.listarHorarios({ servico: escova, data: QUARTA })
    assert.ok(horarios.length > 0)
    assert.ok(horarios.every((h) => h.livre))
})
