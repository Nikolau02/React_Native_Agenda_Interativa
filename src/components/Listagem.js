/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';

// Bibliotecas
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyIcon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from "react-native-animated-progress";

// Páginas e Serviços
import { notificationManager } from '../services/NotificationManager';
import ListagemRec from './ListagemRec';
import Database from '../databaseS/database';
import { listaDeTarefas } from '../styles/index';

const notificador = notificationManager;

class Listagem extends Component {

    // States
    constructor(props) {
        super(props);
        this.state = {
            numeroConcluidas: parseFloat(),
            numero: parseFloat(),
            id: '',
            nome: '',
            descricao: '',
            prioridade: '',
            horaCompleta: new Date(),
            horaFormatada: '',
            concluido: '',
            notifId: '',
            lista: [],
        };

        this.Listagens();
        this.ListaTarefas();
        this.ListaConcluidas();
        notificador.configure();
        notificador.createChannel();
    }

    // Funções anõnimas para chamada dos métodos das Tarefas
    TestarConexao = () => {
        const db = new Database();
        db.Conectar();
        this.Listagens();
    };

    Listagens = () => {
        const db = new Database();
        db.Listar().then(data => {
            this.setState({ lista: data });
        });
    }

    ListaTarefas = () => {
        const db = new Database();
        db.ListarQuantidade().then(data => {
            this.setState({ numero: data });
        });
    }

    ListaConcluidas = () => {
        const db = new Database();
        db.ListarConcluidas().then(data => {
            this.setState({ numeroConcluidas: data });
        });
    }

    Delete = (id) => {
        const db = new Database();
        notificador.cancelOneLocalNotification(id);
        db.Deletar(id);
        this.Listagens();
        this.ListaConcluidas();
        this.ListaTarefas();
    }

    Concluir = (id) => {
        const db = new Database();
        db.EdicaoConcluido(id);
        this.Listagens();
        this.ListaConcluidas();
    }

    // Função para a criação de notificação agendada para a tarefa específica
    LembreteNotificacao = (id, nome, horaCompleta, notifId) => {
        const agora = new Date();
        const horaMarcada = new Date(horaCompleta);
        // Criação da Notificação
        if (notifId == 0) {
            if (horaMarcada > agora) {
                //notificador.cancelOneLocalNotification(id);
                notificador.scheduleNotification(id, nome, horaCompleta) // CRIAR OUTRA NOTIFICAÇÃO
                ToastAndroid.show("Lembrete Agendado!", ToastAndroid.SHORT);

                // Atualiza o notifId pra identificar que tal tarefa está com notificação agendada
                const db = new Database();
                db.EdicaoCriarNotif(id);
                this.Listagens();
            } else {
                ToastAndroid.show("Você não pode marcar uma notificação para um horário passado!", ToastAndroid.SHORT);
            }
        } else {
            ToastAndroid.show("Lembrete já existe!", ToastAndroid.SHORT);
        }
    }

    CancelNotification = (id, notifId) => {
        if (notifId == 1) {
            // Cancela a notificação agendada
            notificador.cancelOneLocalNotification(id);
            ToastAndroid.show("Notificação Cancelada!", ToastAndroid.SHORT);

            // Altera o notifId para 0, identificando que não há notificações
            // agendadas para aquela tarefa
            const db = new Database();
            db.EdicaoCancelNotif(id);
            this.Listagens();
        } else {
            ToastAndroid.show("Não há notificações para esta tarefa.", ToastAndroid.SHORT);
        }
    }

    render() {

        var resultado = (this.state.numeroConcluidas / this.state.numero) * 100;

        var valida = Number.isFinite(resultado) ? resultado : 0;

        const { navegacao } = this.props;

        return (
            <View>
                <Text style={listaDeTarefas.titulo}>Listagem de Tarefas:</Text>
                <View style={listaDeTarefas.viewBarraDeProgresso}>
                    <ProgressBar style={listaDeTarefas.barraDeProgresso} progress={valida} height={15} backgroundColor="#02c702" />
                </View>
                {
                    this.state.lista.map(
                        item => (
                            <View key={item.id} style={listaDeTarefas.viewLista}>
                                <Text style={listaDeTarefas.textLista}>Nome da Tarefa: {item.nome}</Text>
                                <Text style={listaDeTarefas.textLista}>Descrição: {item.descricao}</Text>
                                <Text style={listaDeTarefas.textLista}>Prioridade: {item.prioridade}</Text>
                                <Text style={listaDeTarefas.textLista}>Horário de Término: {item.horaFormatada}</Text>
                                <Text style={listaDeTarefas.textLista}>Status: {item.concluido}</Text>
                                <Text style={listaDeTarefas.textLista}>NotifId: {item.notifId}</Text>
                                <View style={listaDeTarefas.viewBtn}>
                                    <TouchableOpacity style={listaDeTarefas.btnConcluido} onPress={() => this.Concluir(item.id)}>
                                        <Icon name="checkmark-sharp" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={listaDeTarefas.btnEditar}
                                        onPress={() => navegacao.navigate('Editar Tarefa', {
                                            id: item.id,
                                            nome: item.nome,
                                            descricao: item.descricao,
                                            prioridade: item.prioridade,
                                            horaCompleta: item.horaCompleta,
                                            concluido: item.concluido,
                                            notifId: item.notifId,
                                        })}
                                    >
                                        <MyIcon name="edit" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={listaDeTarefas.btnExcluir} onPress={() => this.Delete(item.id)}>
                                        <Icon name="trash" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={listaDeTarefas.btnNotificacoes} onPress={() => this.LembreteNotificacao(item.id, item.nome, item.horaCompleta, item.notifId)}>
                                        <Icon name="notifications" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={listaDeTarefas.btnCancelNotif} onPress={() => this.CancelNotification(item.id, item.notifId)}>
                                        <Icon name="notifications-off" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    )
                }
            </View>
        );
    }
}

export default function ListaFunction(props) {
    const navigation = useNavigation();

    return <ScrollView><Listagem {...props} navegacao={navigation} /><ListagemRec {...props} navegacao={navigation} /></ScrollView>;
}
