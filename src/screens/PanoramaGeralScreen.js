import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import StorageService from '../services/StorageService';

const PanoramaGeralScreen = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    mediaTempoInterrupcao: 0,
    regioesMaisAfetadas: []
  });

  // Carregar eventos ao iniciar a tela
  useEffect(() => {
    carregarEventos();
    
    // Atualizar ao voltar para esta tela
    const unsubscribe = navigation.addListener('focus', () => {
      carregarEventos();
    });

    return unsubscribe;
  }, [navigation]);

  // Função para carregar eventos do AsyncStorage
  const carregarEventos = async () => {
    try {
      setLoading(true);
      const eventosData = await StorageService.getEventos();
      setEventos(eventosData);
      calcularEstatisticas(eventosData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos registrados.');
      setLoading(false);
    }
  };

  // Calcular estatísticas básicas dos eventos
  const calcularEstatisticas = (eventosData) => {
    if (eventosData.length === 0) {
      setStats({
        total: 0,
        mediaTempoInterrupcao: 0,
        regioesMaisAfetadas: []
      });
      return;
    }

    // Calcular média de tempo de interrupção
    const tempoTotal = eventosData.reduce((acc, evento) => {
      return acc + (evento.tempoInterrupcao ? parseInt(evento.tempoInterrupcao) : 0);
    }, 0);
    
    const mediaTempoInterrupcao = tempoTotal / eventosData.length;

    // Encontrar regiões mais afetadas
    const regioesCont = {};
    eventosData.forEach(evento => {
      if (evento.localizacao) {
        regioesCont[evento.localizacao] = (regioesCont[evento.localizacao] || 0) + 1;
      }
    });

    // Converter para array e ordenar
    const regioesMaisAfetadas = Object.entries(regioesCont)
      .map(([regiao, count]) => ({ regiao, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3 regiões

    setStats({
      total: eventosData.length,
      mediaTempoInterrupcao,
      regioesMaisAfetadas
    });
  };

  // Renderizar cada evento na lista
  const renderEvento = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.localizacao || 'Localização não informada'}</Title>
        <Paragraph>
          Tempo sem energia: {item.tempoInterrupcao || '0'} horas
        </Paragraph>
        <Paragraph>
          Data: {new Date(item.dataRegistro).toLocaleDateString('pt-BR')}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          onPress={() => navigation.navigate('Localização', { eventoId: item.id })}
        >
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Seção de estatísticas */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Resumo de Eventos</Title>
          <Paragraph>Total de eventos registrados: {stats.total}</Paragraph>
          <Paragraph>
            Tempo médio de interrupção: {stats.mediaTempoInterrupcao.toFixed(1)} horas
          </Paragraph>
          
          {stats.regioesMaisAfetadas.length > 0 && (
            <View>
              <Paragraph style={styles.subtitle}>Regiões mais afetadas:</Paragraph>
              {stats.regioesMaisAfetadas.map((item, index) => (
                <Paragraph key={index}>
                  • {item.regiao}: {item.count} {item.count === 1 ? 'evento' : 'eventos'}
                </Paragraph>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Lista de eventos */}
      <Title style={styles.listTitle}>Eventos Recentes</Title>
      
      {eventos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum evento registrado. Clique no botão + para adicionar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={eventos.sort((a, b) => new Date(b.dataRegistro) - new Date(a.dataRegistro))}
          renderItem={renderEvento}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Botão flutuante para adicionar novo evento */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Localização')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 4,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  listTitle: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  list: {
    paddingBottom: 80, // Espaço para o FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e91e63',
  },
});

export default PanoramaGeralScreen;
