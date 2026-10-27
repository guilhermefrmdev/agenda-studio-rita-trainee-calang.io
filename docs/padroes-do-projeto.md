# Padrões do Projeto
## 1. Padrão de Nomes para Branches

Antes de começar a programar, crie uma branch a partir da branch principal (`main`). Use sempre letras minúsculas e separe as palavras por hífen (`-`).

Utilize os seguintes prefixos de acordo com o tipo de tarefa:

| Prefixo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `feat/` | Nova funcionalidade ou recurso | `feat/login-google` |
| `fix/` | Correção de um bug | `fix/erro-autenticacao` |
| `docs/` | Alteração exclusivo em documentação | `docs/atualiza-readme` |
| `refactor/`| Refatoração de código que não muda o comportamento | `refactor/otimiza-query` |
| `test/` | Criação ou alteração de testes | `test/valida-formulario` |

---

## 2. Padrão de Mensagens de Commit

Nós seguimos o padrão [Conventional Commits](https://conventionalcommits.org). Isso nos ajuda a entender o histórico do projeto de forma rápida.

### Estrutura do Commit:
```text
tipo: descrição curta em letras minúsculas
```

### Exemplos práticos:
* **Para novas funções:** `feat: adiciona botão de recuperar senha`
* **Para correção de bugs:** `fix: corrige quebra de layout no mobile`
* **Para documentação:** `docs: adiciona instruções de instalação`
* **Para refatoração:** `refactor: remove variáveis duplicadas no serviço`

*Nota: Tente manter o título do commit abaixo de 50 caracteres e use o verbo no presente.*

---

## 3. Fluxo de Trabalho (Workflow)

Siga estes passos para que sua alteração seja integrada ao projeto:

1. **Crie sua branch:** A partir da `main`, use o padrão de nomes (ex: `feat/minha-feature`). Uma branch por card.
2. **Desenvolva e teste:** Faça as alterações necessárias e garanta que o projeto continue funcionando.
3. **Faça os commits:** Escreva mensagens claras seguindo o padrão de commits.
4. **Envie para o GitHub:** Faça o push da sua branch (`git push origin feat/minha-feature`).
5. **Abra um Pull Request (PR):** 
   * Direcione o PR para a branch `main`.
   * Descreva brevemente o que foi feito e mencione a Issue relacionada (se houver).
6. **Revisão:** Aguarde a aprovação de pelo menos um mantenedor do projeto antes do Merge.

---

## 4. Descrição do Pull Request

### Tipo de Alteração
- [ ] Correção de Bug
- [ ] Documentação
- [ ] Funcionalidade ou Recurso
- [ ] Testes
- [ ] Refatoração

### O que foi feito
- Item 1 (Ex: Atualizado o passo a passo de instalação no `README.md`)
- Item 2 (Ex: Adicionado o link para a nova API de homologação)
- Item 3 (Ex: Corrigido os comandos de Docker que estavam quebrados)

## 5. Boas Práticas Gerais

* **Mantenha o escopo focado:** Não misture correções de bug com novas funcionalidades no mesmo commit ou branch.
* **Atualize sua branch:** Antes de abrir o PR, atualize sua branch com a `main` mais recente para evitar conflitos.