import React, { useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Polyline} from 'react-native-maps';
import {
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView, 
} from 'react-native-safe-area-context';

type LocationPoint = {
  latitude: number,
  longitude: number,
};

function App() {
  
  const [isRunning, setIsRunning] = useState(false); 
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState('--:--');
  const [locations,setLocations] = useState<LocationPoint[]>([]);

  const watchIdRef = useRef<number | null>(null);     //İçinde sayı veya null tutulabilen bir ref oluştur ve başlangıç değerini null yap.

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${String(hours).padStart(2, '0')}:${
      String(minutes).padStart(2, '0')
    }:${String(secs).padStart(2, '0')}`;  
  };


  const resetTimer = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsRunning(false);
    setSeconds(0);
    setDistance(0);
    setCalories(0);
    setPace('--:--');
    setLocations([]);
  };

  const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Konum izni verildi');
      return true;
    }

    else if (granted === PermissionsAndroid.RESULTS.DENIED) {
      console.log('Konum izni reddedildi');
      return false;
    }

    else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log('Konum izni kalıcı olarak reddedildi');
      return false;
    }

    return false;
  };


  const handleRunButton = async () => {
    if (isRunning) {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      setIsRunning(false);
      return;
    }

    const hasPermission = await requestLocationPermission();

    if(hasPermission) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLocations((prevLocations) => [
            ...prevLocations,
            newLocation,
          ]);


          console.log('Yeni konum:', newLocation);
        },

        (error) => {
          console.log('Konum hatası:',error);
        },
        
        {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 2000,
        fastestInterval: 1000,
        }

      );

      watchIdRef.current = watchId;
      setIsRunning(true);     
    }
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

          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: locations.length > 0 ? locations[0].latitude : 37.4219983,
              longitude: locations.length > 0 ? locations[0].longitude : -122.084,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
                      
          <Polyline 
            coordinates={locations}
            strokeWidth={4}
          />
          </MapView>


          <Text style={styles.timer}>{formatTime(seconds)}</Text> 


          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Mesafe</Text>
              <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Kalori</Text>
              <Text style={styles.statValue}>{calories} kcal</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tempo</Text>
              <Text style={styles.statValue}>{pace} dk/km</Text>
            </View>
          </View>

          
          <View style={styles.buttonGroup}>
            <Pressable 
              style={styles.button}
              onPress={handleRunButton}
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
    padding: 14,
    borderRadius: 14,
    
  },

  statLabel: {
    fontSize: 12,
    color: '#8D9AAA',
    marginBottom: 6,
  },

  statValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF', 
  },

  map: {
    width: '100%',
    height: 220,
    marginBottom: 24,
    borderRadius: 20,
  },

});

export default App;