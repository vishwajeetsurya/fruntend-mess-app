import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useResetPasswordMutation } from '../../redux/apis/authApi';

const ResetPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

    const handleResetPassword = async () => {
        try {
            const response = await resetPassword({ email, otp, newPassword });
            Alert.alert('Success', response.data.message);
            navigation.navigate('Login')
        } catch (error) {
            Alert.alert('Error', error.response.data.message)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Password Reset</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <Button title="Reset Password" onPress={handleResetPassword} disabled={isLoading} />
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

export default ResetPassword;
