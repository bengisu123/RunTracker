import React, { useState, useEffect, useRef} from 'react';

import Geolocation from '@react-native-community/geolocation';
import MapView, {Polyline} from 'react-native-maps';

import {
    PermissionsAndroid,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from 'react-native-paper';

type LocationPoint = {
  latitude: number,
  longitude: number,
};

function RunScreen () {

  const [isRunning, setIsRunning] = useState(false); 
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState('--:--');
  const [locations,setLocations] = useState<LocationPoint[]>([]); 


  const watchIdRef = useRef<number | null>(null);     //İçinde sayı veya null tutulabilen bir ref oluştur ve başlangıç değerini null yap.

  const mapRef = useRef<MapView | null>(null); 

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${String(hours).padStart(2, '0')}:${
      String(minutes).padStart(2, '0')
    }:${String(secs).padStart(2, '0')}`;  
  };


  const calculateDistance = (
    point1: LocationPoint,
    point2: LocationPoint
  ) => {
    const earthRadius = 6371;

    const lat1 = point1.latitude * (Math.PI / 180);
    const lat2 = point2.latitude * (Math.PI / 180);

    const deltaLat =
      (point2.latitude - point1.latitude) * (Math.PI / 180);

    const deltaLon =
      (point2.longitude - point1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

    return earthRadius * c;
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

          setLocations((prevLocations) => {
            if(prevLocations.length > 0) {
              const lastLocation =
                prevLocations[prevLocations.length - 1];

              const newDistance = calculateDistance(
                lastLocation,
                newLocation
              );

              setDistance((prevDistance) =>
                prevDistance + newDistance
              );
            }

            return [
              ...prevLocations,
              newLocation,
            ];
          });

          mapRef.current?.animateToRegion(
            {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
            },
            1
          );

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
  }, [isRunning]);  

    return(
        <View style={styles.content}>

            {/* Harita */}

              <MapView 
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: locations.length > 0
                  ? locations[0].latitude
                  : 37.4219983,
                  longitude: locations.length > 0
                  ? locations[0].longitude
                  : -122.084,
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

              {/* İstatistikler */}

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

              {/* Butonlar */}

              <View style={styles.buttonGroup}>
                <Button
                  mode="contained"
                  onPress={handleRunButton}
                  >    
                    {isRunning ? 'Koşuyu Bitir' : 'Koşuyu Başlat'}   
                  
                </Button>

                <Button
                mode="outlined"
                onPress={resetTimer}
                >
                  Reset
                </Button>
                
              </View>

            </View>

           );
        }

    const styles = StyleSheet.create({

        content: {
            flex: 1,
            padding: 24,
        },

        map: {
            width: '100%',
            height: 220,
            marginBottom: 24,
            borderRadius: 20,
        },

        timer: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 30,
            color: '#FFFFFF',
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

        buttonGroup: {
            gap: 12,
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
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '600',
        },

        });


export default RunScreen;
        

    
