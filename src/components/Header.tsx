import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

function Header() {

    return (
    <View style={styles.header}>
      <Text style={styles.title}>
        RunTracker
      </Text>

      <View style={styles.profileButton}>
        <Text style={styles.profileText}>
          B
        </Text>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
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

});

    
export default Header;

