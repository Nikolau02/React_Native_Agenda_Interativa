/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Text, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

import { forms } from '../styles';
import Database from '../databaseS/database';
import Tarefa from '../models/tarefa';

export default function Teste({ navigation }) {

    // Criação dos States
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [concluido, setConcluido] = useState('Não Realizado');

    let cadastrar = (nome, descricao, prioridade, concluido) => {
        const db = new Database();
        const novaTarefa = new Tarefa(nome, descricao, prioridade, concluido);
        db.Adicionar(novaTarefa);
        navigation.navigate('Home');
    };
    return (
        <ScrollView>
            <Text style={forms.titulo}>Cadastrar Tarefa</Text>
            <Text />
            <Text style={forms.text}>Nome da Tarefa</Text>
            <TextInput
                style={forms.textInputTar}
                onChangeText={
                    (text) => setNome(text)
                }
            />
            <Text />
            <Text style={forms.text}>Descrição da Tarefa</Text>
            <TextInput
                style={forms.textInputTar}
                onChangeText={
                    (text) => setDescricao(text)
                }
                multiline={true}
                numberOfLines={4}
            />
            <Text />
            <Text style={forms.text}>Prioridade</Text>
            <TextInput
                style={forms.textInputTar}
                onChangeText={
                    (text) => setPrioridade(text)
                }
            />
            <Text />
            <TouchableOpacity
                style={forms.btnCadTarefas}
                onPress={() => cadastrar(
                    nome,
                    descricao,
                    prioridade,
                    concluido
                )
                }
            >
                <Text style={forms.btnTarefasText}>Cadastrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );

}
