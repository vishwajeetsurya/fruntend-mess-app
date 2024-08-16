import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { registerForPushNotificationsAsync } from '../../services/NotificationService'; // Ensure this path is correct

export default function RegisterStep1({ navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        pushToken: '',
    });
    const theme = useTheme();

    useEffect(() => {
        const getPushToken = async () => {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                console.log('Push token:', token); // Verify token is obtained
                setFormData((prevState) => ({ ...prevState, pushToken: token }));
            }
        };
        getPushToken();
    }, []);

    const handleChangeText = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleNext = () => {
        if (!formData.pushToken) {
            Alert.alert('Error', 'Failed to get push token. Please try again.');
            return;
        }
        navigation.navigate('RegisterStep2', { formData });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Register - Step 1</Text>
            <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(text) => handleChangeText('name', text)}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChangeText('email', text)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => handleChangeText('password', text)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />
            <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 24,
        paddingVertical: 8,
    },
});
