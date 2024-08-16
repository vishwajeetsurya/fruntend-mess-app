import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Badge, List, Divider, Button, Avatar, Title, Subheading } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetPresentCountQuery, useGetOutstandingQuery } from '../../redux/apis/attendanceApi';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [user, setUser] = useState(null);
    const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading, refetch: refetchAttendance } = useGetPresentCountQuery();
    const { data: outstandingData, error: outstandingError, isLoading: outstandingLoading, refetch: refetchOutstanding } = useGetOutstandingQuery();

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        setCurrentDate(today);

        AsyncStorage.getItem('user')
            .then((storedUser) => {
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            })
            .catch((error) => console.error('Error fetching user:', error));
    }, []);

    useEffect(() => {
        // Initial fetch
        refetchAttendance();
        refetchOutstanding();

        // Set up polling
        const intervalId = setInterval(() => {
            refetchAttendance();
            refetchOutstanding();
        }, 60000); // Poll every 60 seconds

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [refetchAttendance, refetchOutstanding]);

    // Refetch if attendanceData or outstandingData changes
    useEffect(() => {
        if (attendanceData || outstandingData) {
            refetchAttendance();
            refetchOutstanding();
        }
    }, [attendanceData, outstandingData, refetchAttendance, refetchOutstanding]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Avatar.Text size={64} label={user?.name.charAt(0)} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Title>{`Welcome, ${user?.name}`}</Title>
                    <Subheading>{`Today's Date: ${currentDate}`}</Subheading>
                </View>
            </View>

            <Card style={styles.card}>
                <Card.Title title="Attendance Summary" titleStyle={styles.cardTitle} />
                <Card.Content>
                    <Text style={styles.summaryTitle}>Present Days:</Text>
                    <Badge size={30} style={styles.badge}>
                        {attendanceData && attendanceData.count !== undefined ? attendanceData.count : 'N/A'} / 60
                    </Badge>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Upcoming Meals" titleStyle={styles.cardTitle} />
                <Card.Content>
                    <List.Item
                        title="Lunch"
                        description={user?.mealTimes.lunch}
                        left={(props) => <List.Icon {...props} icon="food" style={styles.listIcon} />}
                    />
                    <Divider />
                    <List.Item
                        title="Dinner"
                        description={user?.mealTimes.dinner}
                        left={(props) => <List.Icon {...props} icon="food" style={styles.listIcon} />}
                    />
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Total Outstanding" titleStyle={styles.cardTitle} />
                <Card.Content>
                    <Text style={styles.notificationText}>
                        {outstandingData ? `₹${outstandingData.dueAmount}` : 'N/A'}
                    </Text>
                    <Button mode="contained" onPress={() => navigation.navigate('Payment')} style={styles.payButton}>
                        Pay Now
                    </Button>
                </Card.Content>
            </Card>

            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                Logout
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        width: width * 0.9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        backgroundColor: '#6200ea',
    },
    headerText: {
        marginLeft: 16,
    },
    card: {
        marginBottom: 24,
        width: width * 0.9,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#333',
    },
    badge: {
        alignSelf: 'flex-start',
        marginTop: 8,
        backgroundColor: '#6200ea',
        color: '#fff',
    },
    listIcon: {
        marginRight: 16,
        color: '#6200ea',
    },
    notificationText: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
    },
    payButton: {
        backgroundColor: '#6200ea',
    },
    logoutButton: {
        marginTop: 16,
        width: width * 0.9,
        backgroundColor: '#6200ea',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red',
    },
});

export default Home;
