import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, Linking, Text } from 'react-native';
import { useGetFessQuery, useMakePaymentMutation } from '../../redux/apis/paymentApi';
import { Button, Card, ActivityIndicator } from 'react-native-paper';

const Payment = () => {
    const { data: feesData, error: feesError, refetch } = useGetFessQuery();
    const [makePayment, { isLoading: isPaymentLoading }] = useMakePaymentMutation();
    const [transactionRef, setTransactionRef] = useState('');
    console.log(feesData);

    const handleOpenURL = useCallback(
        async (event) => {
            const { url } = event;

            if (url.startsWith('upi://pay')) {
                const params = new URLSearchParams(url.split('?')[1]);

                const status = params.get('Status');
                const txnId = params.get('txnId');

                if (status === 'success') {
                    await handleSavePayment('online', txnId);
                    Alert.alert('Payment Success', `Transaction ID: ${txnId}`);
                } else {
                    Alert.alert('Payment Failed', `Reason: ${status}`);
                }
            }
        },
        [handleSavePayment]
    );

    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);

        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        };
    }, [handleOpenURL]);

    const handlePayment = async (vpa, payeeName, amount, transactionRef, note = 'Payment') => {
        const upiUrl = `upi://pay?pa=${vpa}&pn=${payeeName}&tr=${transactionRef}&tn=${note}&am=${amount}&cu=INR`;

        try {
            const supported = await Linking.canOpenURL(upiUrl);

            if (supported) {
                await Linking.openURL(upiUrl);
            } else {
                Alert.alert('Error', 'UPI app not found');
            }
        } catch (error) {
            Alert.alert('Payment Failed', `Error: ${error.message}`);
        }
    };

    const handleSavePayment = async (paymentType, txnId = null) => {
        try {
            const paymentData = {
                paymentType,
                transactionRef: txnId,
                amount: feesData?.totalFee,
            };
            await makePayment(paymentData);
            Alert.alert('Payment Recorded', 'Your payment has been recorded.');
            refetch();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to record payment.');
        }
    };

    if (feesError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error: Failed to fetch fees.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {feesData ? (
                <Card style={{ padding: 20, width: '100%' }}>
                    <Text style={{ fontSize: 20, marginBottom: 20 }}>Total Fee: {feesData.totalFee}</Text>
                    <Button
                        mode="contained"
                        onPress={() => {
                            const uniqueTransactionId = `txn_${Date.now()}`;
                            setTransactionRef(uniqueTransactionId);
                            handlePayment('example@upi', 'Payee Name', feesData.totalFee, uniqueTransactionId);
                        }}
                        loading={isPaymentLoading}
                        disabled={isPaymentLoading}
                        style={{ marginBottom: 20 }}
                    >
                        Pay Online
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => handleSavePayment('offline')}
                        loading={isPaymentLoading}
                        disabled={isPaymentLoading}
                    >
                        Pay Offline
                    </Button>
                </Card>
            ) : (
                <ActivityIndicator animating={true} size="large" />
            )}
        </View>
    );
};

export default Payment;
