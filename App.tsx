import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView, 
} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import RunScreen from './src/screens/RunScreen';

import { styles } from './styles';

import { PaperProvider } from 'react-native-paper';

function App() {

  const [currentScreen, setCurrentScreen] =
   useState<'home' | 'run'>('home');


    return (
      <PaperProvider>
        <SafeAreaProvider>        
            <SafeAreaView style={styles.container}>

              {/* 1. Koşullu Alan: Ana Sayfa (Dashboard) */}
              {currentScreen === 'home' && (
                <HomeScreen />
              )}
                

              {/* 2. Ekran: Koşu Ekranı (Run) */}

              {currentScreen === 'run' && (
                <RunScreen />
              )}

              
              {/* 3. Alan: Sabit Tab Bar */}

              <View style ={styles.bottomNavigation}>

                <Pressable 
                  style={[styles.tabButton, currentScreen === 'home' && styles.tabButtonActive]}
                  onPress={() => setCurrentScreen('home')} 
                  >
                    <Text style={[styles.tabText, currentScreen === 'home' && styles.tabTextActive]}>
                      Ana Sayfa
                    </Text>
                  </Pressable>

                <Pressable
                  style={[styles.tabButton, currentScreen === 'run' && styles.tabButtonActive]}
                  onPress={() => setCurrentScreen('run')}
                >
                  <Text style={[styles.tabText, currentScreen === 'run' && styles.tabTextActive]}>Koşu</Text>
                </Pressable>

              </View>

          </SafeAreaView>
        </SafeAreaProvider> 
      </PaperProvider>  
  );
}


export default App;