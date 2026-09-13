import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {LineChart} from 'react-native-chart-kit'; 
import { Card } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import StartRunButton from '../components/StartRunButton';

type HomeScreenProps = {
    onStartRun: () => void;
};

function HomeScreen({onStartRun}: HomeScreenProps) {

    const weeklyTotal= 12.4;
    const weeklyDistance = 3;
    const weeklyGoal = 5;
    const dailyDistance = 4;
    const dailyGoal = 5;
    const weeklyData = [2.1, 3.4, 2.8, 4.2, 3.6, 4.8, 5.2];

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.screenContainer}>
            <View style={styles.topSection}>
                <Text style={styles.pageTitle}>
                    Ana Sayfa
                </Text>

                <Text style={styles.weeklyLabel}>
                    Haftalık Mesafe
                </Text>

                <Text style={styles.weeklyDistance}>
                    {weeklyTotal} km 
                </Text>

                <LineChart
                   data={{
                    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],

                    datasets: [
                        {
                            data: weeklyData,
                        },
                    ],
                   }}

                   width={screenWidth - 55}
                   height={160}

                   chartConfig={{
                    backgroundGradientFrom: '#1597E5',
                    backgroundGradientTo: '#1597E5',

                    decimalPlaces: 0,

                    color: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,

                    labelColor: (opacity = 1) =>
                         `rgba(255, 255, 255, ${opacity})`,
                   
                   propsForLabels: {
                    fontSize: 11,
                    fontWeight: '700',
                   },

                }}

                   bezier
                   fromZero
                   withHorizontalLabels={false}
                />


            </View>

            <View style={styles.goalRow}>

                <Card style={styles.goalCard}>
                    <Card.Content style={styles.goalCardContent}>

                        <Text style={styles.goalTitle}>
                        Haftalık Mesafe
                        </Text>

                        <Progress.Circle
                            progress={weeklyDistance / weeklyGoal}
                            size={76}
                            thickness={8}
                            color="#3266cd"
                            unfilledColor='#E6EDF5'
                            borderWidth={0}
                            showsText={true}
                            formatText={() => `${weeklyDistance} km`}
                            textStyle={styles.weeklyProgressText}
                        />

                    </Card.Content>
                </Card>

                <Card style={styles.goalCard}>
                    <Card.Content style={styles.goalCardContent}>

                        <Text style={styles.goalTitle}>
                        Günlük Hedef
                        </Text>

                         <Progress.Circle
                            progress={dailyDistance / dailyGoal}
                            size={76}
                            thickness={8}
                            color="#15a760"
                            unfilledColor='#E6EDF5'
                            borderWidth={0}
                            showsText={true}
                            formatText={() => `${dailyDistance} km`}
                            textStyle={styles.dailyProgressText}
                        />
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.bottomSection}>
                <StartRunButton onPress={onStartRun} /> 
            </View>
              
        </View>
          
          );
        }


const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F3F7FB',
    },

    topSection: {
        backgroundColor: '#1597E5',
        paddingHorizontal: 22,
        paddingTop: 30,
        paddingBottom: 35,

        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },

    pageTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 26,
    },

    weeklyLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#DDEFFF',
        marginBottom: 6,
    },

    weeklyDistance: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 22,
    },

    chartPlaceholder: {
        height: 110,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    chartText: {
        color: '#DDEFFF',
        fontSize: 13,
    },

    bottomSection: {
       paddingHorizontal: 16,
       paddingTop: 15,
    },

    goalRow: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginTop: -18,

    },

    goalCard:{
        flex: 1,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },

    goalCardContent:{
        alignItems: 'center',
    },

    goalTitle: {
        fontSize: 12,
        color: '#667085',
        marginBottom: 8,
    },

    goalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#101828',
    },

    weeklyProgressText: {
           fontSize: 15,
           fontWeight: '600',
           color: "#3266cd"
    },

    dailyProgressText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#15a760',      
    },
});

export default HomeScreen;
    


