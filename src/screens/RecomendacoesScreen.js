import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, List, Button, Divider } from 'react-native-paper';
import StorageService from '../services/StorageService';

const RecomendacoesScreen = ({ route, navigation }) => {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar se estamos visualizando um evento específico
  useEffect(() => {
    const carregarEvento = async () => {
      if (route.params?.eventoId) {
        setLoading(true);
        try {
          const eventoData = await StorageService.getEventoById(route.params.eventoId);
          if (eventoData) {
            setEvento(eventoData);
          }
        } catch (error) {
          console.error('Erro ao carregar evento:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    carregarEvento();
  }, [route.params]);

  // Lista de recomendações gerais
  const recomendacoesGerais = [
    {
      titulo: 'Antes da Falta de Energia',
      itens: [
        'Mantenha lanternas e pilhas extras em locais de fácil acesso',
        'Tenha um carregador portátil (power bank) para dispositivos móveis',
        'Armazene água potável em recipientes limpos',
        'Mantenha uma lista de contatos de emergência impressa',
        'Considere a instalação de um gerador de emergência, se possível'
      ]
    },
    {
      titulo: 'Durante a Falta de Energia',
      itens: [
        'Desligue aparelhos eletrônicos para evitar danos quando a energia voltar',
        'Mantenha refrigeradores e freezers fechados para preservar os alimentos',
        'Use lanternas em vez de velas para evitar riscos de incêndio',
        'Evite abrir portas e janelas desnecessariamente para manter a temperatura',
        'Verifique se vizinhos idosos ou com necessidades especiais estão bem'
      ]
    },
    {
      titulo: 'Após o Restabelecimento',
      itens: [
        'Ligue os aparelhos gradualmente para evitar sobrecarga',
        'Verifique alimentos refrigerados - descarte se estiverem em temperatura ambiente por mais de 4 horas',
        'Recarregue dispositivos de emergência e power banks',
        'Reponha suprimentos de emergência utilizados',
        'Registre o incidente no aplicativo para ajudar a mapear áreas afetadas'
      ]
    }
  ];

  // Recomendações específicas baseadas no tipo de estabelecimento afetado
  const getRecomendacoesEspecificas = () => {
    if (!evento) return [];

    const recomendacoes = [];

    if (evento.prejuizosResidenciais) {
      recomendacoes.push({
        titulo: 'Para Residências',
        itens: [
          'Instale dispositivos de proteção contra surtos em equipamentos sensíveis',
          'Considere sistemas de backup de energia para equipamentos médicos essenciais',
          'Mantenha um kit de emergência com alimentos não perecíveis, água e medicamentos',
          'Tenha um plano familiar para situações de emergência',
          'Considere instalar detectores de fumaça com bateria'
        ]
      });
    }

    if (evento.prejuizosComerciais) {
      recomendacoes.push({
        titulo: 'Para Comércios',
        itens: [
          'Invista em sistemas UPS (No-break) para equipamentos críticos como caixas registradoras e servidores',
          'Mantenha backup de dados em nuvem ou sistemas redundantes',
          'Tenha um plano de continuidade de negócios para interrupções prolongadas',
          'Considere seguros específicos para perdas relacionadas a falhas de energia',
          'Treine funcionários para procedimentos de emergência'
        ]
      });
    }

    if (evento.prejuizosIndustriais) {
      recomendacoes.push({
        titulo: 'Para Indústrias',
        itens: [
          'Implemente sistemas de energia de emergência para processos críticos',
          'Realize manutenção preventiva regular nos sistemas elétricos',
          'Desenvolva procedimentos de desligamento seguro para equipamentos sensíveis',
          'Considere sistemas de monitoramento remoto para equipamentos críticos',
          'Mantenha estoque de peças de reposição para equipamentos essenciais'
        ]
      });
    }

    if (evento.prejuizosPublicos) {
      recomendacoes.push({
        titulo: 'Para Serviços Públicos',
        itens: [
          'Priorize geradores de emergência para áreas críticas como UTIs e centros de comunicação',
          'Mantenha sistemas de comunicação alternativos (rádios, satélites)',
          'Desenvolva planos de evacuação e resposta a emergências',
          'Realize simulações periódicas de resposta a apagões',
          'Estabeleça parcerias com empresas de energia para resposta prioritária'
        ]
      });
    }

    return recomendacoes;
  };

  // Links úteis
  const linksUteis = [
    {
      titulo: 'Defesa Civil Nacional',
      url: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil'
    },
    {
      titulo: 'ANEEL - Agência Nacional de Energia Elétrica',
      url: 'https://www.gov.br/aneel/pt-br'
    },
    {
      titulo: 'Cruz Vermelha Brasileira',
      url: 'https://www.cruzvermelha.org.br/'
    },
    {
      titulo: 'INMET - Instituto Nacional de Meteorologia',
      url: 'https://portal.inmet.gov.br/'
    }
  ];

  // Abrir link externo
  const abrirLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir este link.');
      }
    });
  };

  // Finalizar registro do evento
  const finalizarRegistro = () => {
    Alert.alert(
      'Registro Completo',
      'Obrigado por registrar este evento de falta de energia. Suas informações ajudarão a mapear áreas afetadas e melhorar a resposta a eventos futuros.',
      [
        { text: 'OK', onPress: () => navigation.navigate('Panorama') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Recomendações gerais */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recomendações Gerais</Title>
          <Paragraph>Orientações para lidar com eventos de falta de energia</Paragraph>
          
          {recomendacoesGerais.map((secao, index) => (
            <View key={index} style={styles.secao}>
              <Title style={styles.secaoTitulo}>{secao.titulo}</Title>
              {secao.itens.map((item, itemIndex) => (
                <List.Item
                  key={itemIndex}
                  title={item}
                  left={props => <List.Icon {...props} icon="check" />}
                  titleNumberOfLines={3}
                />
              ))}
              {index < recomendacoesGerais.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
      
      {/* Recomendações específicas baseadas no evento */}
      {evento && getRecomendacoesEspecificas().length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recomendações Específicas</Title>
            <Paragraph>Baseadas no tipo de estabelecimento afetado</Paragraph>
            
            {getRecomendacoesEspecificas().map((secao, index) => (
              <View key={index} style={styles.secao}>
                <Title style={styles.secaoTitulo}>{secao.titulo}</Title>
                {secao.itens.map((item, itemIndex) => (
                  <List.Item
                    key={itemIndex}
                    title={item}
                    left={props => <List.Icon {...props} icon="check" />}
                    titleNumberOfLines={3}
                  />
                ))}
                {index < getRecomendacoesEspecificas().length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      
      {/* Links úteis */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Links Úteis</Title>
          <Paragraph>Recursos adicionais para informações e assistência</Paragraph>
          
          {linksUteis.map((link, index) => (
            <List.Item
              key={index}
              title={link.titulo}
              left={props => <List.Icon {...props} icon="link" />}
              onPress={() => abrirLink(link.url)}
              style={styles.linkItem}
            />
          ))}
        </Card.Content>
      </Card>
      
      {/* Botão para finalizar registro (se veio de um fluxo de registro) */}
      {route.params?.eventoId && !evento?.registroFinalizado && (
        <Button 
          mode="contained" 
          onPress={finalizarRegistro}
          style={styles.button}
        >
          Finalizar Registro
        </Button>
      )}
      
      {/* Espaço extra no final para scroll */}
      <View style={styles.bottomSpace} />
    </ScrollView>
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
  secao: {
    marginTop: 12,
  },
  secaoTitulo: {
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  linkItem: {
    paddingVertical: 4,
  },
  button: {
    marginVertical: 16,
    paddingVertical: 8,
  },
  bottomSpace: {
    height: 40,
  }
});

export default RecomendacoesScreen;
