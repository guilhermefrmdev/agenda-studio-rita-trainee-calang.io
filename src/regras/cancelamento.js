function cancelarAgendamento(id, existentes) {
    for (let i of existentes) {
        if (i.id === id) {
            if (i.status !== "agendado") {
                return null
            } else {
                i.status = "cancelado"
                return i
            }
        }
    }
    return null
}

function cancelarNoStorage(id) {
    const chave = "studio-rita:v1"
    const valor = localStorage.getItem(chave)
    let lista

    if (valor) {
        lista = JSON.parse(valor)
    } else {
        lista = []
    }

    const cancela = cancelarAgendamento(id, lista)    

    if (cancela === null) {
        return null
    } else {
        localStorage.setItem(chave, JSON.stringify(lista))
        return cancela
    }

}

export { cancelarAgendamento, cancelarNoStorage }