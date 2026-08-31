import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>RunTracker</Text>

          <Text style={styles.subtitle}>Koşunu Takip Et</Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Koşuyu Başlat</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },

  button: {
    backgroundColor: '#222222',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;