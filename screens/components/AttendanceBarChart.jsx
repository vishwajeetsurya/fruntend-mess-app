import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card, Title, useTheme } from 'react-native-paper';
import { Rect, G } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const AttendanceBarChart = ({ data }) => {
    const theme = useTheme();

    if (!Array.isArray(data) || data.length === 0) {
        console.log('No data available');
        return <Title style={styles.noData}>No data available</Title>;
    }

    let totalPresent = 0;
    let totalAbsent = 0;

    data.forEach(item => {
        if (item.meals && item.meals.lunch && typeof item.meals.lunch.present === 'boolean') {
            totalPresent += item.meals.lunch.present ? 1 : 0;
            totalAbsent += item.meals.lunch.present ? 0 : 1;
        }
        if (item.meals && item.meals.dinner && typeof item.meals.dinner.present === 'boolean') {
            totalPresent += item.meals.dinner.present ? 1 : 0;
            totalAbsent += item.meals.dinner.present ? 0 : 1;
        }
    });

    const chartData = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [totalPresent, totalAbsent],
            }
        ]
    };

    const chartConfig = {
        backgroundColor: theme.colors.primary,
        backgroundGradientFrom: theme.colors.background,
        backgroundGradientTo: theme.colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            strokeWidth: 1,
            stroke: theme.colors.backdrop,
        },
        fillShadowGradientOpacity: 1,
        barPercentage: 0.5,
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>Attendance Summary</Title>
                <View>
                    <BarChart
                        data={chartData}
                        width={screenWidth - 100}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        fromZero={true}
                        chartConfig={chartConfig}
                        style={styles.chart}
                        verticalLabelRotation={0}
                        decorator={() => {
                            return chartData.datasets[0].data.map((value, index) => {
                                const barWidth = 32; // Width of each bar
                                const barHeight = value * 2; // Scale height
                                const x = (index * (screenWidth - 100) / 2) + barWidth / 2;
                                const y = 220 - barHeight;

                                return (
                                    <Rect
                                        key={index}
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={index === 0 ? 'rgba(0, 128, 0, 1)' : 'rgba(255, 0, 0, 1)'}
                                        rx={5}
                                        ry={5}
                                    />
                                );
                            });
                        }}
                    />
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 8,
        backgroundColor: '#f8f9fa',
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 20,
        fontWeight: 'bold',
    },
    chart: {
        marginVertical: 8,
        marginLeft: -16,
        borderRadius: 16,
    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default AttendanceBarChart;
