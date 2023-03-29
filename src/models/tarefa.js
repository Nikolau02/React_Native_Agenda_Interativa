/* eslint-disable prettier/prettier */
export default class Tarefa {
    constructor(nome, descricao, prioridade, horaFim, concluido) {
        this.nome = nome;
        this.descricao = descricao;
        this.prioridade = prioridade;
        this.horaFim = horaFim;
        this.concluido = concluido;
    }
}
