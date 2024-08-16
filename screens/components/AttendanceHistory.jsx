import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { DataTable, Button, ActivityIndicator } from 'react-native-paper';
import { useGetAttendanceQuery, useUpdateAttendanceMutation } from '../../redux/apis/attendanceApi';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AttendanceHistory = () => {
    const { data, error, isLoading, refetch } = useGetAttendanceQuery();
    console.log('Attendance data:', data); // Log the attendance data
    const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceMutation();
    const navigation = useNavigation();

    const handleEdit = async (mealType, _id, currentStatus) => {
        const updatedAttendanceData = {
            mealType,
            present: currentStatus === "Present" ? false : true,
        };

        console.log('Data sent to backend:', { _id, attendanceData: updatedAttendanceData });

        try {
            const response = await updateAttendance({ _id, attendanceData: updatedAttendanceData }).unwrap();
            console.log('Attendance updated successfully:', response);
            refetch();
        } catch (err) {
            console.error('Failed to update attendance:', err);
        }
    };

    const isWithinPast7Days = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return date >= sevenDaysAgo && date <= today;
    };

    if (isLoading) return <ActivityIndicator animating={true} />;
    if (error) return <Text>Error fetching attendance data: {error.message}</Text>;

    const attendanceArray = data
        ? Object.entries(data)
            .filter(([date]) => isWithinPast7Days(date))
            .map(([date, { _id, lunch, dinner }]) => ({ date, _id, lunch, dinner }))
        : [];

    return (
        <ScrollView style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.dateColumn}>Date</DataTable.Title>
                    <DataTable.Title style={styles.mealColumn}>Lunch</DataTable.Title>
                    <DataTable.Title style={styles.mealColumn}>Dinner</DataTable.Title>
                </DataTable.Header>
                {attendanceArray.length > 0 ? (
                    attendanceArray.map((entry) => (
                        <DataTable.Row key={entry._id}>
                            <DataTable.Cell style={styles.dateColumn}>{entry.date}</DataTable.Cell>
                            <DataTable.Cell style={styles.mealColumn}>
                                <View style={styles.mealCell}>
                                    <Text style={styles.mealText}>{entry.lunch}</Text>
                                    <Button
                                        icon="pencil"
                                        mode="text"
                                        compact
                                        onPress={() => handleEdit('lunch', entry._id, entry.lunch)}
                                        style={styles.editButton}
                                        labelStyle={styles.editButtonLabel}
                                    />
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.mealColumn}>
                                <View style={styles.mealCell}>
                                    <Text style={styles.mealText}>{entry.dinner}</Text>
                                    <Button
                                        icon="pencil"
                                        mode="text"
                                        compact
                                        onPress={() => handleEdit('dinner', entry._id, entry.dinner)}
                                        style={styles.editButton}
                                        labelStyle={styles.editButtonLabel}
                                    />
                                </View>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))
                ) : (
                    <DataTable.Row>
                        <DataTable.Cell colSpan={3} style={styles.noRecordsCell}>
                            <Text>No attendance records found</Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}
            </DataTable>
            {isUpdating && <ActivityIndicator animating={true} />}
            <Button
                mode="contained"
                onPress={() => navigation.navigate('Report')}
                style={styles.reportButton}
            >
                Get Report
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
    },
    dateColumn: {
        flex: 2,
    },
    mealColumn: {
        flex: 3,
    },
    mealCell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mealText: {
        marginLeft: width * 0.05,
    },
    editButton: {
        marginLeft: width * 0.02,
    },
    editButtonLabel: {
        color: 'blue',
    },
    noRecordsCell: {
        justifyContent: 'center',
    },
    reportButton: {
        marginTop: height * 0.02,
    },
});

export default AttendanceHistory;
