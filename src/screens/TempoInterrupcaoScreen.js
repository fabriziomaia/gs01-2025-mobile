import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, RadioButton, Text } from 'react-native-paper';
import StorageService from '../services/StorageService';

const TempoInterrupcaoScreen = ({ route, navigation }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    tempoInterrupcao: '',
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: '',
    statusAtual: 'em_andamento', // 'em_andamento' ou 'resolvido'
    observacoes: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evento, setEvento] = useState(null);

  // Verificar se estamos editando um evento existente
  useEffect(() => {
    const carregarEvento = async () => {
      if (route.params?.eventoId) {
        setLoading(true);
        try {
          const eventoData = await StorageService.getEventoById(route.params.eventoId);
          if (eventoData) {
            setEvento(eventoData);
            setFormData({
              tempoInterrupcao: eventoData.tempoInterrupcao || '',
              dataInicio: eventoData.dataInicio || '',
              horaInicio: eventoData.horaInicio || '',
              dataFim: eventoData.dataFim || '',
              horaFim: eventoData.horaFim || '',
              statusAtual: eventoData.statusAtual || 'em_andamento',
              observacoes: eventoData.observacoes || ''
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error('Erro ao carregar evento:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados do evento.');
        } finally {
          setLoading(false);
        }
      }
    };

    carregarEvento();
  }, [route.params]);

  // Atualizar um campo do formulário
  const handleChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // Salvar os dados do tempo de interrupção
  const handleSave = async () => {
    // Validação básica
    if (!formData.tempoInterrupcao && (!formData.dataInicio || !formData.horaInicio)) {
      Alert.alert('Erro', 'Por favor, informe pelo menos o tempo estimado ou a data/hora de início.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && evento) {
        // Atualizar evento existente
        const eventoAtualizado = await StorageService.updateEvento({
          ...evento,
          ...formData
        });
        Alert.alert('Sucesso', 'Tempo de interrupção atualizado com sucesso!');
        navigation.goBack();
      } else if (route.params?.eventoId) {
        // Atualizar evento existente (vindo da tela anterior)
        const eventoExistente = await StorageService.getEventoById(route.params.eventoId);
        const eventoAtualizado = await StorageService.updateEvento({
          ...eventoExistente,
          ...formData
        });
        Alert.alert('Sucesso', 'Tempo de interrupção registrado com sucesso!');
        
        // Navegar para a próxima tela para continuar o registro
        navigation.navigate('Prejuízos', { eventoId: eventoAtualizado.id });
      } else {
        // Criar novo evento (caso raro, normalmente viria da tela de localização)
        const novoEvento = await StorageService.saveEvento(formData);
        Alert.alert('Sucesso', 'Tempo de interrupção registrado com sucesso!');
        navigation.navigate('Prejuízos', { eventoId: novoEvento.id });
      }
    } catch (error) {
      console.error('Erro ao salvar tempo de interrupção:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do tempo de interrupção.');
    } finally {
      setLoading(false);
    }
  };

  // Formatar data atual para o formato YYYY-MM-DD
  const getDataAtual = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  // Formatar hora atual para o formato HH:MM
  const getHoraAtual = () => {
    const data = new Date();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${hora}:${minuto}`;
  };

  // Preencher data e hora atuais
  const preencherDataHoraAtual = (tipo) => {
    if (tipo === 'inicio') {
      setFormData(prevState => ({
        ...prevState,
        dataInicio: getDataAtual(),
        horaInicio: getHoraAtual()
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        dataFim: getDataAtual(),
        horaFim: getHoraAtual(),
        statusAtual: 'resolvido'
      }));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Tempo de Interrupção</Title>
            <Paragraph>Informe por quanto tempo a região ficou ou está sem energia</Paragraph>
            
            {/* Tempo estimado em horas */}
            <TextInput
              label="Tempo estimado (em horas)"
              value={formData.tempoInterrupcao}
              onChangeText={(text) => handleChange('tempoInterrupcao', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
              placeholder="Ex: 4"
            />
            
            {/* Status atual */}
            <Title style={styles.sectionTitle}>Status atual</Title>
            <RadioButton.Group
              onValueChange={value => handleChange('statusAtual', value)}
              value={formData.statusAtual}
            >
              <View style={styles.radioOption}>
                <RadioButton value="em_andamento" />
                <Text>Interrupção em andamento</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="resolvido" />
                <Text>Energia restabelecida</Text>
              </View>
            </RadioButton.Group>
            
            {/* Data e hora de início */}
            <Title style={styles.sectionTitle}>Início da interrupção</Title>
            <View style={styles.row}>
              <TextInput
                label="Data"
                value={formData.dataInicio}
                onChangeText={(text) => handleChange('dataInicio', text)}
                style={[styles.input, styles.flex1, styles.marginRight]}
                mode="outlined"
                placeholder="AAAA-MM-DD"
              />
              
              <TextInput
                label="Hora"
                value={formData.horaInicio}
                onChangeText={(text) => handleChange('horaInicio', text)}
                style={[styles.input, styles.flex1]}
                mode="outlined"
                placeholder="HH:MM"
              />
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => preencherDataHoraAtual('inicio')}
              style={styles.dateButton}
            >
              Usar data/hora atual
            </Button>
            
            {/* Data e hora de fim (se resolvido) */}
            {formData.statusAtual === 'resolvido' && (
              <>
                <Title style={styles.sectionTitle}>Fim da interrupção</Title>
                <View style={styles.row}>
                  <TextInput
                    label="Data"
                    value={formData.dataFim}
                    onChangeText={(text) => handleChange('dataFim', text)}
                    style={[styles.input, styles.flex1, styles.marginRight]}
                    mode="outlined"
                    placeholder="AAAA-MM-DD"
                  />
                  
                  <TextInput
                    label="Hora"
                    value={formData.horaFim}
                    onChangeText={(text) => handleChange('horaFim', text)}
                    style={[styles.input, styles.flex1]}
                    mode="outlined"
                    placeholder="HH:MM"
                  />
                </View>
                
                <Button 
                  mode="outlined" 
                  onPress={() => preencherDataHoraAtual('fim')}
                  style={styles.dateButton}
                >
                  Usar data/hora atual
                </Button>
              </>
            )}
            
            {/* Observações adicionais */}
            <TextInput
              label="Observações"
              value={formData.observacoes}
              onChangeText={(text) => handleChange('observacoes', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Informações adicionais sobre a interrupção"
            />
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {isEditing ? 'Atualizar Informações' : 'Salvar e Continuar'}
          </Button>
          
          {isEditing && (
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
            >
              Cancelar
            </Button>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  cancelButton: {
    borderColor: '#888',
  }
});

export default TempoInterrupcaoScreen;
