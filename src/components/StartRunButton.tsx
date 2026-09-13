import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import { useRun } from '../context/RunContext';

function StartRunButton() {

    const{
        isRunning,
        handleRunButton
    } = useRun();

    return (
        <Button
            mode="contained"
            textColor='#FFFFFF'
            onPress={handleRunButton}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonText}
        >
            {isRunning ? 'Koşuyu Tamamla' : 'Koşu Başlat'}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {       
        borderRadius: 10,
        backgroundColor: '#3a8657'
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