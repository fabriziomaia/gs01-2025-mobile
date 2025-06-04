import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, Checkbox, Text, List } from 'react-native-paper';
import StorageService from '../services/StorageService';

const PrejuizosScreen = ({ route, navigation }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    prejuizosResidenciais: false,
    prejuizosComerciais: false,
    prejuizosIndustriais: false,
    prejuizosPublicos: false,
    descricaoPrejuizos: '',
    valorEstimado: '',
    pessoasAfetadas: '',
    outrosImpactos: ''
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
              prejuizosResidenciais: eventoData.prejuizosResidenciais || false,
              prejuizosComerciais: eventoData.prejuizosComerciais || false,
              prejuizosIndustriais: eventoData.prejuizosIndustriais || false,
              prejuizosPublicos: eventoData.prejuizosPublicos || false,
              descricaoPrejuizos: eventoData.descricaoPrejuizos || '',
              valorEstimado: eventoData.valorEstimado || '',
              pessoasAfetadas: eventoData.pessoasAfetadas || '',
              outrosImpactos: eventoData.outrosImpactos || ''
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

  // Alternar estado de checkbox
  const toggleCheckbox = (field) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  // Salvar os dados dos prejuízos
  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing && evento) {
        // Atualizar evento existente
        const eventoAtualizado = await StorageService.updateEvento({
          ...evento,
          ...formData
        });
        Alert.alert('Sucesso', 'Informações de prejuízos atualizadas com sucesso!');
        navigation.goBack();
      } else if (route.params?.eventoId) {
        // Atualizar evento existente (vindo da tela anterior)
        const eventoExistente = await StorageService.getEventoById(route.params.eventoId);
        const eventoAtualizado = await StorageService.updateEvento({
          ...eventoExistente,
          ...formData
        });
        Alert.alert('Sucesso', 'Informações de prejuízos registradas com sucesso!');
        
        // Navegar para a próxima tela para continuar o registro
        navigation.navigate('Recomendações', { eventoId: eventoAtualizado.id });
      } else {
        // Criar novo evento (caso raro, normalmente viria das telas anteriores)
        const novoEvento = await StorageService.saveEvento(formData);
        Alert.alert('Sucesso', 'Informações de prejuízos registradas com sucesso!');
        navigation.navigate('Recomendações', { eventoId: novoEvento.id });
      }
    } catch (error) {
      console.error('Erro ao salvar prejuízos:', error);
      Alert.alert('Erro', 'Não foi possível salvar as informações de prejuízos.');
    } finally {
      setLoading(false);
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
            <Title>Prejuízos Causados</Title>
            <Paragraph>Informe os prejuízos observados devido à falta de energia</Paragraph>
            
            {/* Tipos de prejuízos (checkboxes) */}
            <Title style={styles.sectionTitle}>Tipos de estabelecimentos afetados</Title>
            
            <List.Item
              title="Residências"
              left={props => (
                <Checkbox
                  status={formData.prejuizosResidenciais ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheckbox('prejuizosResidenciais')}
                />
              )}
            />
            
            <List.Item
              title="Comércios"
              left={props => (
                <Checkbox
                  status={formData.prejuizosComerciais ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheckbox('prejuizosComerciais')}
                />
              )}
            />
            
            <List.Item
              title="Indústrias"
              left={props => (
                <Checkbox
                  status={formData.prejuizosIndustriais ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheckbox('prejuizosIndustriais')}
                />
              )}
            />
            
            <List.Item
              title="Serviços públicos (hospitais, escolas, etc.)"
              left={props => (
                <Checkbox
                  status={formData.prejuizosPublicos ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheckbox('prejuizosPublicos')}
                />
              )}
            />
            
            {/* Descrição dos prejuízos */}
            <TextInput
              label="Descrição dos prejuízos"
              value={formData.descricaoPrejuizos}
              onChangeText={(text) => handleChange('descricaoPrejuizos', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Descreva os prejuízos observados (ex: perda de alimentos em refrigeradores, interrupção de serviços essenciais, etc.)"
            />
            
            {/* Valor estimado */}
            <TextInput
              label="Valor estimado dos prejuízos (R$)"
              value={formData.valorEstimado}
              onChangeText={(text) => handleChange('valorEstimado', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
              placeholder="Ex: 1000"
            />
            
            {/* Pessoas afetadas */}
            <TextInput
              label="Número estimado de pessoas afetadas"
              value={formData.pessoasAfetadas}
              onChangeText={(text) => handleChange('pessoasAfetadas', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
              placeholder="Ex: 50"
            />
            
            {/* Outros impactos */}
            <TextInput
              label="Outros impactos observados"
              value={formData.outrosImpactos}
              onChangeText={(text) => handleChange('outrosImpactos', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Descreva outros impactos não mencionados anteriormente"
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
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

export default PrejuizosScreen;
