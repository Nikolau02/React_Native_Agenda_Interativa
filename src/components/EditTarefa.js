/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { forms } from '../styles';
import Database from '../databaseS/database';
import Tarefa from '../models/tarefa';

const db = new Database();

export default function EditTarefa({ route, navigation }) {

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [concluido, setConcluido] = useState('');
    
    useEffect(() => {
        setId(route.params.id);
        setNome(route.params.nome);
        setDescricao(route.params.descricao);
        setPrioridade(route.params.prioridade);
        setConcluido(route.params.concluido);
    }, []);

    let editar = (id, nome, descricao, prioridade, concluido) => {
        const tarefaEditada = new Tarefa(nome, descricao, prioridade, concluido);
        db.Edicao(id, tarefaEditada);
        navigation.navigate('Home');
        //ToastAndroid.show("Tarefa editada com sucesso", ToastAndroid.SHORT);
    }

    return (
        <ScrollView>
            <Text style={forms.titulo}>Edição de Tarefa</Text>
            <Text />
            <Text style={forms.text}>Nome da Tarefa</Text>
            <TextInput
                style={forms.textInputTar}
                value={nome}
                onChangeText={
                    (text) => setNome(text)
                }
            />
            <Text />
            <Text style={forms.text}>Descrição da Tarefa</Text>
            <TextInput
                style={forms.textInputTar}
                value={descricao}
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
                value={prioridade}
                onChangeText={
                    (text) => setPrioridade(text)
                }
            />
            <Text />
            <TouchableOpacity
                style={forms.btnCadTarefas}
                onPress={() => editar(
                    id,
                    nome,
                    descricao,
                    prioridade,
                    concluido
                )
                }
            >
                <Text style={forms.btnTarefasText}>Editar Tarefa</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

