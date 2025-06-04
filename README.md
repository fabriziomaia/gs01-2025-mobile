# README - Aplicativo de Registro de Faltas de Energia

Este é um aplicativo React Native desenvolvido para registrar e monitorar eventos de falta de energia, permitindo aos usuários documentar informações sobre localização, tempo de interrupção, prejuízos causados e receber recomendações.

## Estrutura do Projeto

O aplicativo segue uma arquitetura organizada em camadas:

```
mobile_dev_project/
├── App.js                         # Ponto de entrada do aplicativo
├── package.json                   # Dependências e configurações
└── src/
    ├── components/                # Componentes reutilizáveis
    ├── navigation/                # Configuração de navegação
    │   └── AppNavigator.js        # Navegador principal do app
    ├── screens/                   # Telas do aplicativo
    │   ├── PanoramaGeralScreen.js # Visão geral dos eventos
    │   ├── LocalizacaoScreen.js   # Registro de localização
    │   ├── TempoInterrupcaoScreen.js # Registro de tempo sem energia
    │   ├── PrejuizosScreen.js     # Registro de prejuízos
    │   └── RecomendacoesScreen.js # Recomendações e orientações
    └── services/
        └── StorageService.js      # Serviço para armazenamento local
```

## Funcionalidades

O aplicativo possui as seguintes funcionalidades principais:

1. **Panorama Geral**: Visualização de todos os eventos registrados, com estatísticas sobre regiões mais afetadas e tempo médio de interrupção.

2. **Registro de Localização**: Permite informar detalhes sobre a região afetada pela falta de energia, incluindo CEP, bairro, cidade e estado.

3. **Tempo de Interrupção**: Registro da duração da falta de energia, com opções para informar data/hora de início e fim.

4. **Prejuízos Causados**: Documentação dos tipos de estabelecimentos afetados (residências, comércios, indústrias, serviços públicos) e detalhes sobre os prejuízos.

5. **Recomendações**: Orientações personalizadas baseadas no tipo de evento registrado, além de recomendações gerais e links úteis.

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- React Native Paper (UI)
- AsyncStorage (armazenamento local)

## Instalação e Execução

1. Certifique-se de ter o Node.js e o npm instalados
2. Instale o Expo CLI: `npm install -g expo-cli`
3. Clone o repositório
4. Navegue até a pasta do projeto: `cd mobile_dev_project`
5. Instale as dependências: `npm install`
6. Inicie o aplicativo: `npm start`
7. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR code ou use um emulador

## Armazenamento de Dados

O aplicativo utiliza o AsyncStorage para armazenar localmente os eventos registrados. Não há necessidade de configuração de banco de dados ou servidores externos.

## Contribuição

Este projeto foi desenvolvido como parte da Global Solution 2025 para a disciplina de Mobile Development.
