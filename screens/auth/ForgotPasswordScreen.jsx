import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForgotPasswordMutation } from '../../redux/apis/authApi';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

    const handleForgotPassword = async () => {
        try {
            const response = await forgotPassword(email);
            Alert.alert('Success', response.data.message);
            navigation.navigate('ResetPassword')
        } catch (error) {
            Alert.alert('Error', error.response.data.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Send OTP" onPress={handleForgotPassword} disabled={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
});

export default ForgotPasswordScreen;
