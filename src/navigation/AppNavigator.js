import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importação das telas
import PanoramaGeralScreen from '../screens/PanoramaGeralScreen';
import LocalizacaoScreen from '../screens/LocalizacaoScreen';
import TempoInterrupcaoScreen from '../screens/TempoInterrupcaoScreen';
import PrejuizosScreen from '../screens/PrejuizosScreen';
import RecomendacoesScreen from '../screens/RecomendacoesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de abas inferior
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Panorama') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Localização') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Tempo') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Prejuízos') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Recomendações') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Panorama" 
        component={PanoramaGeralScreen} 
        options={{ title: 'Panorama Geral' }}
      />
      <Tab.Screen 
        name="Localização" 
        component={LocalizacaoScreen} 
        options={{ title: 'Localização' }}
      />
      <Tab.Screen 
        name="Tempo" 
        component={TempoInterrupcaoScreen} 
        options={{ title: 'Tempo' }}
      />
      <Tab.Screen 
        name="Prejuízos" 
        component={PrejuizosScreen} 
        options={{ title: 'Prejuízos' }}
      />
      <Tab.Screen 
        name="Recomendações" 
        component={RecomendacoesScreen} 
        options={{ title: 'Recomendações' }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
