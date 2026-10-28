// Testa se os horários se sobrepõem
// a é um objeto e b é outro objeto

function sobrepoe(a, b) {
  return a.inicio < b.inicio + b.duracao && b.inicio < a.inicio + a.duracao;
}

// A função recebe novo (o agendamento que a pessoa quer fazer) e existentes (lista com todos os agendamentos)

function acharConflito(novo, existentes) {
  for (const i of existentes) {
    if (
      i.status === "agendado" &&
      i.data === novo.data &&
      sobrepoe(novo, i)
    ) {
      return i; // Retorna o objeto agendado. Serve para o front conseguir mostrar que esse horário já está agendado
    }
  }
  return null; // Se no for não retornou nada, então retorna null (o horário está livre)
}

export { sobrepoe, acharConflito };