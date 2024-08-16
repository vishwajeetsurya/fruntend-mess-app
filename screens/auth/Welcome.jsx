import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function Welcome({ navigation }) {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Welcome</Text>
            <Button mode="contained" onPress={() => navigation.navigate('Login')} style={styles.button}>
                Login
            </Button>
            <View style={styles.space} />
            <Button mode="outlined" onPress={() => navigation.navigate('RegisterStep1')} style={styles.button}>
                Register
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginBottom: 16,
    },
    space: {
        height: 16,
    },
});
