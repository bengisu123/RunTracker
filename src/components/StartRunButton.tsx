import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import { useRun } from '../context/RunContext';

function StartRunButton() {

   const{
        runStatus,
        handleRunButton
    } = useRun(); 

    return (
        <Button
            mode="contained"
            textColor='#FFFFFF'
            onPress={handleRunButton}
            style={[styles.button,
                runStatus === 'running' && styles.finishButton,
                runStatus === 'paused' && styles.pausedButton,
                runStatus === 'idle' && styles.startButton,            
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonText}
        >
            {runStatus === 'running'
            ? 'Koşuyu Durdur'
            : runStatus === 'paused'
            ? 'Koşuya Devam Et'
            : 'Koşuyu Başlat'
            }
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {       
        borderRadius: 10,
    },

    finishButton: {
        backgroundColor: '#da3c3c',
    },

    pausedButton: {
       backgroundColor: '#F59E0B',
    },

    startButton: {
        backgroundColor: '#3a8657',
    },

    buttonContent: {
        height: 48,
    },

    buttonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default StartRunButton;