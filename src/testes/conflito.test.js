import test from 'node:test'
import assert from 'node:assert'
import { acharConflito } from '../regras/conflito.js'

// Testes da função acharConflito (arquivo: restricoes.js, se encontra na pasta src)
//
// O que a função faz:
//   Recebe o agendamento novo e a lista de agendamentos existentes.
//   - Se algum existente conflita com o novo, retorna esse agendamento existente.
//   - Se nenhum conflita, retorna null.
//
// Como os testes conferem isso:
//   - assert.ok(resultado) - teve conflito (retornou um objeto)
//   - assert.equal(resultado, null) - não teve conflito (retornou null)

// Agendamento base dos testes

const corte = {
    data: "2026-10-28",
    inicio: 600,
    duracao: 60,
    status: "agendado"
}

// Testes

test("Novo agendamento no mesmo horario do corte: conflita", function () {
    const agendamento = {
        data: "2026-10-28",
        inicio: 600,
        duracao: 60 }
    const resultado = acharConflito(agendamento, [corte])
    assert.ok(resultado)
})

test("Novo agendamento começa no meio do corte: confilta", function () {
    const agendamento = {
        data: "2026-10-28",
        inicio: 630,
        duracao: 60,
    }
    const resultado = acharConflito(agendamento, [corte])
    assert.ok(resultado)
})

test("Novo agendamento começa na hora que o corte termina: nao conflita", function () {
    const agendamento = {
        data: "2026-10-28",
        inicio: 660,
        duracao: 60,
    }
    const resultado = acharConflito(agendamento, [corte])
    assert.equal(resultado, null)
})

test("Novo agendamento termina na hora que o corte começa: nao conflita", function () {
    const agendamento = {
        data: "2026-10-28",
        inicio: 570,
        duracao: 30,
    }
    const resultado = acharConflito(agendamento, [corte])
    assert.equal(resultado, null)
})

test("Novo agendamento engloba o corte inteiro: conflita", function () {
    const novo = {
        data: "2026-10-28",
        inicio: 570,
        duracao: 120
    }
    const resultado = acharConflito(novo, [corte])
    assert.ok(resultado)
})


test("corte cancelado não bloqueia: nao conflita", function () {
    const corteCancelado = {
        data: "2026-10-28",
        inicio: 600,
        duracao: 60,
        status: "cancelado",
    }
    const novo = { data: "2026-10-28", inicio: 600, duracao: 60 }
    const resultado = acharConflito(novo, [corteCancelado])
    assert.equal(resultado, null)

})

test("em outro dia: livre", function () {
    const novo = {
        data: "2026-10-29",
        inicio: 600,
        duracao: 60
    }
    const resultado = acharConflito(novo, [corte])
    assert.equal(resultado, null)

})

test("Lista vazia: nao conflita", function () {
    const agendamento = {
        data: "2026-10-28",
        inicio: 600,
        duracao: 60 }
    const resultado = acharConflito(agendamento, [])
    assert.equal(resultado, null)
})