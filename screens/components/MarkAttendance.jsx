import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useMarkAttendanceMutation } from '../../redux/apis/attendanceApi';

const Markattendance = () => {
    const [markAttendance] = useMarkAttendanceMutation();
    const [lunchStatus, setLunchStatus] = useState(null);
    const [dinnerStatus, setDinnerStatus] = useState(null);

    const handleMarkAttendance = async (mealType, present) => {
        try {
            await markAttendance({ mealType, present });
            if (mealType === 'lunch') {
                setLunchStatus(present ? 'Present' : 'Absent');
            } else if (mealType === 'dinner') {
                setDinnerStatus(present ? 'Present' : 'Absent');
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mark Attendance</Text>
            <View style={styles.buttonsContainer}>
                <Button
                    mode="contained"
                    onPress={() => handleMarkAttendance('lunch', true)}
                    disabled={lunchStatus === 'Present' || lunchStatus === 'Absent'}
                    style={styles.button}
                >
                    Mark Lunch Present
                </Button>
                <Button
                    mode="contained"
                    onPress={() => handleMarkAttendance('lunch', false)}
                    disabled={lunchStatus === 'Present' || lunchStatus === 'Absent'}
                    style={styles.button}
                >
                    Mark Lunch Absent
                </Button>
                <Text>{lunchStatus}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <Button
                    mode="contained"
                    onPress={() => handleMarkAttendance('dinner', true)}
                    disabled={dinnerStatus === 'Present' || dinnerStatus === 'Absent'}
                    style={styles.button}
                >
                    Mark Dinner Present
                </Button>
                <Button
                    mode="contained"
                    onPress={() => handleMarkAttendance('dinner', false)}
                    disabled={dinnerStatus === 'Present' || dinnerStatus === 'Absent'}
                    style={styles.button}
                >
                    Mark Dinner Absent
                </Button>
                <Text>{dinnerStatus}</Text>
            </View>
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
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonsContainer: {
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
});

export default Markattendance;
