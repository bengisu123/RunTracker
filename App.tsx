import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import RunScreen from './src/screens/RunScreen';

import { PaperProvider } from 'react-native-paper';

import { RunProvider } from './src/context/RunContext';

export type RootTabParamList = {
  Home: undefined;
  Run : undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabLayout = NonNullable<
  React.ComponentProps<typeof Tab.Navigator>['layout']
>;

const renderTabLayout: TabLayout = ({children, navigation, state}) => {
  const currentRoute = state.routes[state.index];

  return (
    <RunProvider
      isRunScreen={currentRoute?.name === 'Run'}
      navigateToRun={() => navigation.navigate('Run')}
    >
      {children}
    </RunProvider>
  );
};

function App() {

    return (
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
              <Tab.Navigator
                layout={renderTabLayout}
                screenOptions={{
                  headerShown: false,
                }}
              >

                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    tabBarLabel: 'Ana Sayfa',
                  }}
                />

                <Tab.Screen
                  name="Run"
                  component={RunScreen}
                  options={{
                    tabBarLabel: 'Koşu',
                  }}
                />

              </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>  
  );
}


export default App;
