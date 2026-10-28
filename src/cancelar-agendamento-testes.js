const test = require('node:test')
const assert = require('node:assert')
const { cancelarAgendamento } = require('./cancelar-agendamento.js')
const { acharConflito } = require('./restricoes.js')

test("cancelar muda o status para cancelado", function () {
    const lista = [
        {
        id: "abc",
        data: "2026-10-28",
        inicio: 600,
        duracao: 60,
        status: "agendado" }
    ]
    const resultado = cancelarAgendamento("abc", lista)
    assert.equal(resultado.status, "cancelado")
})

test("id que não existe: retorna null", function () {
    const lista = [
        {
        id: "abc",
        data: "2026-10-28",
        inicio: 600,
        duracao: 60,
        status: "agendado"
    }
]
    const resultado = cancelarAgendamento("xyz", lista)
    assert.equal(resultado, null)
})

test("já cancelado: não cancela de novo", function () {
    const lista = [
        {
        id: "abc",
        data: "2026-10-28",
        inicio: 600,
        duracao: 60,
        status: "cancelado"
    }
]
    const resultado = cancelarAgendamento("abc", lista)
    assert.equal(resultado, null)
})

test("depois de cancelar, o horário fica livre", function () {
    const lista = [
        {id: "abc",
        data: "2026-10-28",
        inicio: 600,
        duracao: 60,
        status: "agendado" 
    }
]
    const novo = { data: "2026-10-28", inicio: 600, duracao: 60 }

    assert.ok(acharConflito(novo, lista))      // antes: ocupado

    cancelarAgendamento("abc", lista)

    assert.equal(acharConflito(novo, lista), null)  // depois: livre
})