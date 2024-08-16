import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRegisterUserMutation } from '../../redux/apis/authApi';

export default function RegisterStep2({ navigation }) {
    const route = useRoute();
    const initialFormData = route.params?.formData || {};
    const [formData, setFormData] = useState({
        ...initialFormData,
        mealTimes: initialFormData.mealTimes || { lunch: '', dinner: '' },
        startDate: initialFormData.startDate || '',
        monthlyFee: '',
        messOwnerPh: '',
        paidInAdvance: '',
    });

    const [registerUser, { isLoading, error, isSuccess }] = useRegisterUserMutation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLunchTimePicker, setShowLunchTimePicker] = useState(false);
    const [showDinnerTimePicker, setShowDinnerTimePicker] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [lunchTime, setLunchTime] = useState(new Date());
    const [dinnerTime, setDinnerTime] = useState(new Date());
    const theme = useTheme();

    useEffect(() => {
        if (isSuccess) {
            Alert.alert('Registration Successful', 'You can now log in.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        }
    }, [isSuccess, navigation]);

    const handleChangeText = (field, value) => {
        const keys = field.split('.');
        if (keys.length === 2) {
            setFormData({ ...formData, [keys[0]]: { ...formData[keys[0]], [keys[1]]: value } });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowDatePicker(false);
        setStartDate(currentDate);
        const formattedDate = formatDate(currentDate);
        handleChangeText('startDate', formattedDate);
    };

    const handleTimeChange = (field, event, selectedTime) => {
        const time = selectedTime || new Date();
        if (field === 'lunch') {
            setShowLunchTimePicker(false);
            setLunchTime(time);
        } else if (field === 'dinner') {
            setShowDinnerTimePicker(false);
            setDinnerTime(time);
        }
        const formattedTime = formatTime(time);
        handleChangeText(`mealTimes.${field}`, formattedTime);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showLunchTimePickerModal = () => {
        setShowLunchTimePicker(true);
    };

    const showDinnerTimePickerModal = () => {
        setShowDinnerTimePicker(true);
    };

    const handleRegister = async () => {
        try {
            console.log('Registering user with data:', formData); // Log the form data
            await registerUser(formData).unwrap();
        } catch (error) {
            console.error('Failed to register user:', error);
            Alert.alert('Registration Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>Registration - Step 2</Text>

            <Button onPress={showDatepicker} mode="outlined" style={styles.button}>
                {formData.startDate ? formData.startDate : 'Select Start Date'}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TextInput
                label="Monthly Fee"
                value={formData.monthlyFee}
                onChangeText={(text) => handleChangeText('monthlyFee', text)}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Mess Owner Phone"
                value={formData.messOwnerPh}
                onChangeText={(text) => handleChangeText('messOwnerPh', text)}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Paid in Advance"
                value={formData.paidInAdvance}
                onChangeText={(text) => handleChangeText('paidInAdvance', text)}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            <Button onPress={showLunchTimePickerModal} mode="outlined" style={styles.button}>
                {formData.mealTimes.lunch ? formData.mealTimes.lunch : 'Select Lunch Time'}
            </Button>
            {showLunchTimePicker && (
                <DateTimePicker
                    value={lunchTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => handleTimeChange('lunch', event, selectedTime)}
                />
            )}

            <Button onPress={showDinnerTimePickerModal} mode="outlined" style={styles.button}>
                {formData.mealTimes.dinner ? formData.mealTimes.dinner : 'Select Dinner Time'}
            </Button>
            {showDinnerTimePicker && (
                <DateTimePicker
                    value={dinnerTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => handleTimeChange('dinner', event, selectedTime)}
                />
            )}

            {error && <Text style={styles.error}>Failed to register: {error.message}</Text>}
            <Button onPress={handleRegister} mode="contained" style={styles.button} disabled={isLoading}>
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
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginBottom: 16,
    },
    error: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
});
