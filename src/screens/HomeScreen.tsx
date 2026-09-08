import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Header from '../components/Header';

function HomeScreen() {
    return (
        <View style={styles.screenContainer}>

              <Header />
              
              {/* Karşılama */}

              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>
                  Bugün koşmaya hazır mısın?
                </Text>

                <Text style={styles.welcomeText}>
                  Hedefine bir adım daha yaklaş!
                </Text>
              </View>

            {/* Hedef Kartı */}
            
              <View style={styles.goalCard}>
                  <Text style={styles.cardLabel}>BUGÜNKÜ HEDEF</Text>

                  <Text style={styles.goalValue}>5.0 km</Text>

                  <Text style={styles.goalDescription}>
                    Günlük koşu hedefin
                  </Text>
                </View>
          </View>
          
          );
        }


    const styles = StyleSheet.create({
        screenContainer: {
            flex: 1,
            padding: 24,
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

        });

export default HomeScreen;
    


