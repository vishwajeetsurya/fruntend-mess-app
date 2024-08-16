import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Card, Title, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useGetAttendanceReportMutation } from '../../redux/apis/attendanceApi';
import AttendanceTable from './AttendanceTable';
import AttendanceBarChart from './AttendanceBarChart';

const { width, height } = Dimensions.get('window');

const Report = () => {
    const theme = useTheme();
    const [isTable, setIsTable] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
    const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
    const [getAttendanceReport, { data = [], isLoading, isError }] = useGetAttendanceReportMutation();
    const [toggle, setToggle] = useState(true);

    const handleToggle = () => setIsTable(prevState => !prevState);

    const handleFetchData = () => {
        console.log('Fetching data with:', { startDate, endDate });
        getAttendanceReport({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    };

    const showStartDatePicker = () => {
        setStartPickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartPickerVisibility(false);
    };

    const handleConfirmStartDate = (date) => {
        setStartDate(date);
        hideStartDatePicker();
    };

    const showEndDatePicker = () => {
        setEndPickerVisibility(true);
    };

    const hideEndDatePicker = () => {
        setEndPickerVisibility(false);
    };

    const handleConfirmEndDate = (date) => {
        setEndDate(date);
        hideEndDatePicker();
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Attendance Report</Title>
                    <View style={styles.datePickersContainer}>
                        <Button
                            mode="contained"
                            onPress={showStartDatePicker}
                            style={styles.button}
                        >
                            Select Start Date
                        </Button>
                        <DateTimePickerModal
                            isVisible={isStartPickerVisible}
                            mode="date"
                            onConfirm={handleConfirmStartDate}
                            onCancel={hideStartDatePicker}
                            maximumDate={new Date()}
                            minimumDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
                        />
                        <Button
                            mode="contained"
                            onPress={showEndDatePicker}
                            style={styles.button}
                        >
                            Select End Date
                        </Button>
                        <DateTimePickerModal
                            isVisible={isEndPickerVisible}
                            mode="date"
                            onConfirm={handleConfirmEndDate}
                            onCancel={hideEndDatePicker}
                            maximumDate={new Date()}
                            minimumDate={startDate}
                        />
                    </View>
                    <View style={styles.fetchButtonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleFetchData}
                            style={styles.button}
                        >
                            Fetch Data
                        </Button>
                    </View>
                    <View style={styles.toggleContainer}>
                        <Button
                            mode={toggle ? 'contained' : 'outlined'}
                            onPress={() => setToggle(true)}
                            style={{ flex: 1, margin: 5 }}
                        >
                            Table View
                        </Button>
                        <Button
                            mode={!toggle ? 'contained' : 'outlined'}
                            onPress={() => setToggle(false)}
                            style={{ flex: 1, margin: 5 }}
                        >
                            Chart View
                        </Button>
                    </View>
                    {toggle ? <AttendanceTable data={data} /> : <AttendanceBarChart data={data} />}
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.02,
    },
    card: {
        margin: 5,
        marginLeft: -2,
        flex: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: height * 0.02,
    },
    datePickersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.02,
    },
    button: {
        margin: width * 0.01,
    },
    fetchButtonContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
});

export default Report;
