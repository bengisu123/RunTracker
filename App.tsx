import React, { useState, useEffect } from 'react';
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
  
  const [isRunning, setIsRunning] = useState(false); 
  const [seconds, setSeconds] = useState(0);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${String(hours).padStart(2, '0')}:${
      String(minutes).padStart(2, '0')
    }:${String(secs).padStart(2, '0')}`;  
  };


  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);   // setSeconds(seconds + 1)  
      }, 1000);
    }

    return () => {
      if (timer) {
      clearInterval(timer);
      }
    };
  }, [isRunning]);    //dependency array


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>

          <View style={styles.header}>
            <Text style={styles.title}>RunTracker</Text>


            <View style={styles.profileButton}>
              <Text style={styles.profileText}/>
            </View>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              Bugün koşmaya hazır mısın?
            </Text>

            <Text style={styles.welcomeText}>
              Hedefine bir adım daha yaklaş!
            </Text>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.cardLabel}>BUGÜNKÜ HEDEF</Text>

            <Text style={styles.goalValue}>5.0 km</Text>

            <Text style={styles.goalDescription}>
              Günlük koşu hedefin
            </Text>
          </View>


          <Text style={styles.timer}>{formatTime(seconds)}</Text> 


          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Mesafe</Text>
              <Text style={styles.statValue}>0.00 km</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Kalori</Text>
              <Text style={styles.statValue}>0 kcal</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Pace</Text>
              <Text style={styles.statValue}>--:--</Text>
            </View>
          </View>

          
          <View style={styles.buttonGroup}>
            <Pressable 
              style={styles.button}
              onPress={() => setIsRunning(!isRunning)}
              >
              <Text style={styles.buttonText}>
                {isRunning ? 'Koşuyu Bitir' : 'Koşuyu Başlat'}   
              </Text>
            </Pressable>

            <Pressable 
            style={styles.button}
            onPress={resetTimer}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08131F',
  },

  content: {
    flex: 1,
    padding: 24,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },

  buttonGroup: {
    gap:12,
   }, 

  button: {
    backgroundColor: '#222222',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#87caad',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    color: '#08131F',
    fontSize: 18,
    fontWeight: 'bold',
  },

  welcomeSection: {
    marginBottom: 24,
  },

  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  welcomeText: {
    fontSize: 15,
    color: '#8D9AAA',
  },

  goalCard: {
    backgroundColor: '#102131',
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1DDC89',
    marginBottom: 10,
  },

  goalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  goalDescription: {
    fontSize: 14,
    color: '#8D9AAA',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#102131',
    
  },

  statLabel: {
    fontSize: 12,
  },

  statValue: {
    fontSize: 16,
  },



});

export default App;