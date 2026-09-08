import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08131F',
    },

    bottomNavigation: {
        flexDirection: 'row',
        backgroundColor: '#102131',
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#1A2F45',
    
    },

    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
    },


    tabButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#1DDC89',
    },

    tabTextActive: {
        color: '#1DDC89',
    },


    tabText: {
        color: '#8D9AAA',
        fontSize: 14,
        fontWeight: '600',
    },


});