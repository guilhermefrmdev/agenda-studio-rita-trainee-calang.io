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

export { cancelarAgendamento }