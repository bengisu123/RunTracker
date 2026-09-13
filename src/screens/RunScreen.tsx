import React, { useState, useRef, useEffect} from 'react';
import MapView, {Polyline} from 'react-native-maps';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from 'react-native-paper';
import { useRun } from '../context/RunContext';
import StartRunButton from '../components/StartRunButton';

function RunScreen () {

    const {
      seconds,
      distance,
      locations,
      resetRun,
    } = useRun();
 
  const [calories, setCalories] = useState(0);
  //const [pace, setPace] = useState('---/---');

  const weight = 60;

  useEffect(() => {
    const calculatedCalories = distance * weight * 1.036;

    setCalories(calculatedCalories);
  }, [distance]);


  const mapRef = useRef<MapView | null>(null); 

  useEffect(() => {
  if (locations.length === 0) {
    return;
  }

  const lastLocation = locations[locations.length - 1];

  mapRef.current?.animateToRegion(
    {
      latitude: lastLocation.latitude,
      longitude: lastLocation.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    },
    1000
  );
}, [locations]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    return `${String(hours).padStart(2, '0')}:${
      String(minutes).padStart(2, '0')
    }:${String(secs).padStart(2, '0')}`;  
  };

  const calculatePace = () => {
    if (distance <= 0) {
      return '--:--';
    }

    const totalMinutes = seconds / 60;

    const paceInMinutes = totalMinutes / distance;

    const minutes = Math.floor(paceInMinutes);

    const secondsPart = Math.round(
      (paceInMinutes - minutes) * 60
    );

    return `${minutes}:${String(secondsPart).padStart(2, '0')}`;
  };


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
                  <Text style={styles.statValue}>{calories.toFixed(0)} kcal</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tempo</Text>
                  <Text style={styles.statValue}>{calculatePace()} dk/km</Text>
                </View>
              </View>

              {/* Butonlar */}

              <View style={styles.buttonGroup}>
                <StartRunButton />
                  

                <Button
                mode="outlined"
                onPress={resetRun}
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
        

    
