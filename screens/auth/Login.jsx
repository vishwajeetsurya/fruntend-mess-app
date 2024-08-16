import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useLoginUserMutation } from '../../redux/apis/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loginUser, { isSuccess, isLoading, error, isError, data }] = useLoginUserMutation();
    const navigation = useNavigation();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                navigation.navigate('HomeTabs');
            }
        };

        checkUserLoggedIn();
    }, [navigation]);

    const handleLogin = async () => {
        try {
            await loginUser({ email, password }).unwrap();
            navigation.navigate('HomeTabs');
        } catch (err) {
            console.error('Failed to login:', err);
            Alert.alert('Login failed', err.message || 'An error occurred during login');
        }
    };

    useEffect(() => {
        if (isSuccess && data) {
            AsyncStorage.setItem('user', JSON.stringify(data.result))
                .then(() => navigation.navigate('HomeTabs'))
                .catch(() => console.warn('Unable to set asyncStorage'));
        }
    }, [isSuccess, data, navigation]);

    useEffect(() => {
        if (isError) {
            setShow(true);
            const id = setTimeout(() => {
                setShow(false);
            }, 1000);
            return () => clearTimeout(id);
        }
    }, [isError]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
            />
            {isError && (
                <Text style={styles.errorText}>Login failed: {error.data.message}</Text>
            )}
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
            >
                Login
            </Button>
            <Button
                onPress={() => navigation.navigate('RegisterStep1')}
                style={styles.link}
            >
                Register
            </Button>
            <Button
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                style={styles.link}
            >
                Forgot Password
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
    },
    link: {
        marginTop: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8,
    },
});
