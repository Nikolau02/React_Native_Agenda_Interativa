/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Text, ScrollView, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { notificationManager } from '../services/NotificationManager';
import DateTimePicker from '@react-native-community/datetimepicker';

import { forms } from '../styles';
import Database from '../databaseS/database';
import Tarefa from '../models/tarefa';

export default function Teste({ navigation }) {

    const notificador = notificationManager;

    // Criação dos States
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [horaFim, setHoraFim] = useState(new Date());
    const [concluido, setConcluido] = useState('Não Realizado');
    const [showPicker, setShowPicker] = useState(false);

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

    /*useEffect(() => {
        notificador.configure();
        notificador.createChannel();
    });*/

    let cadastrar = (nome, descricao, prioridade, horaFim, concluido) => {
        const dataFormat = Intl.DateTimeFormat('pt-br', {
            hour: 'numeric',
            minute: 'numeric'
        })
        dataFormat.format(horaFim);
        console.log("---------Resultado da Variável horaFim: " + horaFim)
        const db = new Database();
        const novaTarefa = new Tarefa(nome, descricao, prioridade, horaFim, concluido);
        db.Adicionar(novaTarefa);
        //notificador.scheduleNotification();
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
                onPress={() => cadastrar(
                    nome,
                    descricao,
                    prioridade,
                    horaFim,
                    concluido
                )
                }
            >
                <Text style={forms.btnTarefasText}>Cadastrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );

}
