/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { listaDeTarefas } from '../styles/index';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import MyIcon from 'react-native-vector-icons/MaterialIcons';
//import {ProgressBar} from '@react-native-community/progress-bar-android';
import { ProgressBar, MD3Colors } from 'react-native-paper';

import ListagemRec from './ListagemRec';

import Database from '../databaseS/database';

class Listagem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numero: parseFloat(),
            numeroConcluidas: parseFloat(),
            nome: '',
            descricao: '',
            prioridade: '',
            horaFim: '',
            concluido: '',
            lista: [],
        };

        this.Listagens();
        this.ListaTarefas();
        this.ListaConcluidas();
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
        db.Deletar(id);
        this.Listagens();
        this.ListaTarefas();
        this.ListaConcluidas();
    }

    Concluir = (id) => {
        const db = new Database();
        db.EdicaoConcluido(id);
        this.Listagens();
        this.ListaConcluidas();
    }

    render() {

        var resultado = this.state.numeroConcluidas/this.state.numero;

        var valida = Number.isFinite(resultado) ? resultado : 0;

        const { navegacao } = this.props;

        return (
            <View>
                <Text style={listaDeTarefas.titulo}>Listagem de Tarefas</Text>
                <View style={listaDeTarefas.viewBarraDeProgresso}>
                    <ProgressBar style={listaDeTarefas.barraDeProgresso} animatedValue={valida} color="#02c702" />
                </View>
                {
                    this.state.lista.map(
                        item => (
                            <View style={listaDeTarefas.viewLista}>
                                <Text style={listaDeTarefas.textLista}>Nome da Tarefa: {item.nome}</Text>
                                <Text style={listaDeTarefas.textLista}>Descrição: {item.descricao}</Text>
                                <Text style={listaDeTarefas.textLista}>Prioridade: {item.prioridade}</Text>
                                <Text style={listaDeTarefas.textLista}>Horário de Término: {item.horaFim}</Text>
                                <Text style={listaDeTarefas.textLista}>Status: {item.concluido}</Text>
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
                                            horaFim: item.horaFim,
                                            concluido: item.concluido,
                                        })}
                                    >
                                        <MyIcon name="edit" size={30} color="#ffffff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={listaDeTarefas.btnExcluir} onPress={() => this.Delete(item.id)}>
                                        <Icon name="trash" size={30} color="#ffffff" />
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
