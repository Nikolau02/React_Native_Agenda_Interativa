/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { forms } from '../styles';
import Database from '../databaseS/database';
import Tarefa from '../models/tarefa';

const db = new Database();

export default function EditTarefa({ route, navigation }) {

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [horaFim, setHoraFim] = useState(new Date());
    const [concluido, setConcluido] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        setId(route.params.id);
        setNome(route.params.nome);
        setDescricao(route.params.descricao);
        setPrioridade(route.params.prioridade);
        setHoraFim(route.params.horaFim)
        setConcluido(route.params.concluido);
    }, []);

    const showMode = () => {
        if (Platform.OS === 'android') {
            setShowPicker(true);
            // for iOS, add a button that closes the picker
        }
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowPicker(false);
        setHoraFim(currentDate);
    };

    let editar = (id, nome, descricao, prioridade, horaFim, concluido) => {
        const tarefaEditada = new Tarefa(nome, descricao, prioridade, horaFim, concluido);
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
            <Text style={forms.text}>Horário de Término da Tarefa</Text>
            <Button onPress={showMode} title="Selecionar Horário de Término" />
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode='time'
                    onChange={onChange}
                />
            )}
            {/*<Text>Horário Selecionado: {horaFim.toLocaleString()}</Text>*/}
            <Text />
            <TouchableOpacity
                style={forms.btnCadTarefas}
                onPress={() => editar(
                    id,
                    nome,
                    descricao,
                    prioridade,
                    horaFim,
                    concluido
                )
                }
            >
                <Text style={forms.btnTarefasText}>Editar Tarefa</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

