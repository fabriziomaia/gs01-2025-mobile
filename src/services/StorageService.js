import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const EVENTOS_KEY = '@energia_app:eventos';

// Serviço para gerenciar o armazenamento local dos eventos de falta de energia
class StorageService {
  // Obter todos os eventos registrados
  static getEventos = async () => {
    try {
      const eventosJSON = await AsyncStorage.getItem(EVENTOS_KEY);
      return eventosJSON ? JSON.parse(eventosJSON) : [];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      return [];
    }
  };

  // Salvar um novo evento
  static saveEvento = async (evento) => {
    try {
      // Buscar eventos existentes
      const eventos = await this.getEventos();
      
      // Adicionar ID único e data de registro ao novo evento
      const novoEvento = {
        ...evento,
        id: Date.now().toString(),
        dataRegistro: new Date().toISOString()
      };
      
      // Adicionar o novo evento à lista
      const eventosAtualizados = [...eventos, novoEvento];
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem(EVENTOS_KEY, JSON.stringify(eventosAtualizados));
      
      return novoEvento;
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      throw error;
    }
  };

  // Atualizar um evento existente
  static updateEvento = async (eventoAtualizado) => {
    try {
      const eventos = await this.getEventos();
      
      // Encontrar o índice do evento a ser atualizado
      const index = eventos.findIndex(e => e.id === eventoAtualizado.id);
      
      if (index !== -1) {
        // Substituir o evento antigo pelo atualizado
        eventos[index] = {
          ...eventoAtualizado,
          dataAtualizacao: new Date().toISOString()
        };
        
        // Salvar a lista atualizada
        await AsyncStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));
        return eventos[index];
      } else {
        throw new Error('Evento não encontrado');
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  };

  // Excluir um evento
  static deleteEvento = async (id) => {
    try {
      const eventos = await this.getEventos();
      
      // Filtrar o evento a ser excluído
      const eventosAtualizados = eventos.filter(e => e.id !== id);
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem(EVENTOS_KEY, JSON.stringify(eventosAtualizados));
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      throw error;
    }
  };

  // Obter um evento específico pelo ID
  static getEventoById = async (id) => {
    try {
      const eventos = await this.getEventos();
      return eventos.find(e => e.id === id);
    } catch (error) {
      console.error('Erro ao buscar evento por ID:', error);
      return null;
    }
  };

  // Limpar todos os dados (para testes ou reset)
  static clearAll = async () => {
    try {
      await AsyncStorage.removeItem(EVENTOS_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  };
}

export default StorageService;
