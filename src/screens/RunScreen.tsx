import React, { useState, useRef, useEffect} from 'react';
import MapView, {Polyline} from 'react-native-maps';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from 'react-native-paper';
import { useRun } from '../context/RunContext';

function RunScreen () {

    const {
      runStatus,
      seconds,
      distance,
      locations,
      resetRun,
      handleRunButton,
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
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Aktif Koşu
            </Text>
          </View>

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

              {/* İstatistikler */}

              <View style={styles.infoCard}>

                <View style={styles.infoRow}>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Mesafe</Text>
                      <Text style={styles.infoValue}>{distance.toFixed(2)} km</Text>
                    </View>

                    <View style={styles.verticalDivider} />

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Süre</Text>
                      <Text style={styles.infoValue}>{formatTime(seconds)}</Text>
                    </View>
                </View>

                    <View style={styles.horizontalDivider} />

                <View style={styles.infoRow}>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Kalori</Text>
                      <Text style={styles.infoValue}>{calories.toFixed(0)} kcal</Text>
                    </View>

                    <View style={styles.verticalDivider} />

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Tempo</Text>
                      <Text style={styles.infoValue}>{calculatePace()} dk/km</Text>
                    </View>
                  </View>

              </View>

              

              {/* Butonlar */}

              <View style={styles.buttonRow}>

                {runStatus === 'idle' && (

                    <Button
                      mode="contained"
                      onPress={handleRunButton}
                      style={styles.startButton}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}    
                    >
                      Koşuyu Başlat
                    </Button>
                )}


                {runStatus === 'running' && (

                  <>
                     <Button
                      mode="contained"
                      onPress={handleRunButton}
                      style={styles.pauseButton}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}
                    >
                      Duraklat
                    </Button>

                    <Button
                      mode="contained"
                      onPress={resetRun}
                      style={styles.finishButton}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}
                    >
                      Bitir
                    </Button>

                  </>
                )}

                {runStatus === 'paused' && (

                  <>

                   <Button
                      mode="contained"
                      onPress={handleRunButton}
                      style={styles.startButton}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}
                    >
                      Devam Et
                    </Button>


                     <Button
                      mode="contained"
                      onPress={resetRun}
                      style={styles.finishButton}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}
                    >
                      Bitir
                    </Button>

                  </>
                )}

              </View>
            </View>
           );
        }

    const styles = StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: '#F3F7FB',
        },

        header: {
          height: 58,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        },

        headerTitle: {
          fontSize: 20,
          fontWeight: '700',
          color: '#101828',
        },

        map: {
            width: '100%',
            height: 400,
        },

        infoCard: {
          backgroundColor: '#FFFFFF',
          marginHorizontal: 16,
          marginTop: -24,
          borderRadius: 18,
          paddingVertical: 18,
        },

        infoRow: {
          flexDirection: 'row',
          marginBottom: 14,
        },

        infoItem: {
          flex: 1,
          alignItems: 'center',
        },

        infoLabel: {
          fontSize: 15,
          fontWeight: '500',
          color: '#404349',
          marginBottom: 5,
        },

        infoValue: {
          fontSize: 22,
          fontWeight: '700',
          color: '#101828'
        },

        verticalDivider: {
          width: 1,
          height: 35,
          marginTop: 10,
          backgroundColor: '#9299a9',
        },

        horizontalDivider: {
          height: 0.7,
          marginHorizontal: 40,
          marginVertical: 14,
          backgroundColor: '#9299a9',
        },

        buttonRow: {
          flexDirection: 'row',
          gap: 12,
          marginHorizontal: 16,
          marginTop: 14,
        },

        startButton: {
          flex: 1,
          borderRadius: 10,
          backgroundColor: '#3a8657',
        },

        pauseButton: {
          flex: 1,
          borderRadius: 10,
          backgroundColor: '#1597E5',
        },

        finishButton: {
          flex: 1,
          borderRadius: 10,
          backgroundColor: '#EF4444',
        },

        buttonContent: {
          height: 48,
        },

        buttonText: {
          fontSize: 14,
          fontWeight: '700',
          color: '#FFFFFF',
        },

      });


export default RunScreen;
        

    
