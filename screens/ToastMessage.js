
import Toast from 'react-native-toast-message';

const ToastMessage = () => {
    return (
        <Toast ref={(ref) => Toast.setRef(ref)} />
    );
};

export default ToastMessage;
