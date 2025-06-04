import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, Chip } from 'react-native-paper';
import StorageService from '../services/StorageService';

const LocalizacaoScreen = ({ route, navigation }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    localizacao: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    detalhes: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar se estamos editando um evento existente
  useEffect(() => {
    const carregarEvento = async () => {
      if (route.params?.eventoId) {
        setLoading(true);
        try {
          const evento = await StorageService.getEventoById(route.params.eventoId);
          if (evento) {
            setFormData({
              localizacao: evento.localizacao || '',
              cep: evento.cep || '',
              bairro: evento.bairro || '',
              cidade: evento.cidade || '',
              estado: evento.estado || '',
              detalhes: evento.detalhes || ''
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

  // Salvar os dados da localização
  const handleSave = async () => {
    // Validação básica
    if (!formData.localizacao && (!formData.cidade || !formData.bairro)) {
      Alert.alert('Erro', 'Por favor, informe pelo menos a localização ou cidade/bairro.');
      return;
    }

    setLoading(true);
    try {
      // Preparar dados para salvar
      const localizacaoData = {
        ...formData,
        // Se não tiver uma localização definida, criar uma a partir de cidade/bairro
        localizacao: formData.localizacao || `${formData.bairro}, ${formData.cidade}/${formData.estado}`
      };

      if (isEditing && route.params?.eventoId) {
        // Atualizar evento existente
        const eventoAtualizado = await StorageService.updateEvento({
          id: route.params.eventoId,
          ...localizacaoData
        });
        Alert.alert('Sucesso', 'Localização atualizada com sucesso!');
      } else {
        // Criar novo evento
        const novoEvento = await StorageService.saveEvento(localizacaoData);
        Alert.alert('Sucesso', 'Localização registrada com sucesso!');
        
        // Navegar para a próxima tela para continuar o registro
        navigation.navigate('Tempo', { eventoId: novoEvento.id });
      }
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados da localização.');
    } finally {
      setLoading(false);
    }
  };

  // Sugestões de regiões comuns (para facilitar a entrada de dados)
  const regioesSugeridas = [
    'Centro', 'Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste'
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Localização Atingida</Title>
            <Paragraph>Informe os detalhes da região afetada pela falta de energia</Paragraph>
            
            {/* Campo de localização principal */}
            <TextInput
              label="Nome da região/localidade"
              value={formData.localizacao}
              onChangeText={(text) => handleChange('localizacao', text)}
              style={styles.input}
              mode="outlined"
              placeholder="Ex: Vila Mariana, Jardim Paulista"
            />
            
            {/* Sugestões rápidas */}
            <View style={styles.chipContainer}>
              {regioesSugeridas.map((regiao) => (
                <Chip 
                  key={regiao} 
                  onPress={() => handleChange('localizacao', regiao)}
                  style={styles.chip}
                >
                  {regiao}
                </Chip>
              ))}
            </View>
            
            {/* Campos adicionais */}
            <TextInput
              label="CEP"
              value={formData.cep}
              onChangeText={(text) => handleChange('cep', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
              placeholder="00000-000"
            />
            
            <TextInput
              label="Bairro"
              value={formData.bairro}
              onChangeText={(text) => handleChange('bairro', text)}
              style={styles.input}
              mode="outlined"
            />
            
            <View style={styles.row}>
              <TextInput
                label="Cidade"
                value={formData.cidade}
                onChangeText={(text) => handleChange('cidade', text)}
                style={[styles.input, styles.flex7]}
                mode="outlined"
              />
              
              <TextInput
                label="Estado"
                value={formData.estado}
                onChangeText={(text) => handleChange('estado', text)}
                style={[styles.input, styles.flex3]}
                mode="outlined"
                maxLength={2}
              />
            </View>
            
            <TextInput
              label="Detalhes adicionais"
              value={formData.detalhes}
              onChangeText={(text) => handleChange('detalhes', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Informe detalhes específicos sobre a área afetada"
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
            {isEditing ? 'Atualizar Localização' : 'Salvar e Continuar'}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex7: {
    flex: 0.7,
    marginRight: 8,
  },
  flex3: {
    flex: 0.3,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
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

export default LocalizacaoScreen;
