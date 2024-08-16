import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AttendanceTable = ({ data }) => {
    return (
        <View style={styles.table}>
            <View style={styles.headerRow}>
                <Text style={styles.cell}>Date</Text>
                <Text style={styles.cell}>Lunch</Text>
                <Text style={styles.cell}>Dinner</Text>
            </View>
            {data.map((item) => (
                <View key={item._id} style={styles.row}>
                    <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.cell}>{item.meals.lunch.present ? 'Present' : 'Absent'}</Text>
                    <Text style={styles.cell}>{item.meals.dinner.present ? 'Present' : 'Absent'}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        marginTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default AttendanceTable;
