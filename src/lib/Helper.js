
import * as React from 'react';
import { Alert, Platform, Dimensions, Keyboard } from 'react-native';
export default class Helper extends React.Component {

    static cameraAlert(alertMessage, Camera, Gallery, Cancel, cbCamera, cbGallery) {
        Alert.alert(
            "Hichaty",
            alertMessage,
            [
                { text: Camera, onPress: () => { if (cbCamera) cbCamera(true); } },
                { text: Gallery, onPress: () => { if (cbGallery) cbGallery(true); } },
                { text: Cancel, onPress: () => { if (cbCamera) cbCamera(false); }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }
    
    static attachmentFileAlert(alertMessage, Camera, Gallery, Cancel, cbCamera, cbGallery) {
        Alert.alert(
            "Hichaty",
            alertMessage,
            [
                { text: Camera, onPress: () => { if (cbCamera) cbCamera(true); } },
                { text: Gallery, onPress: () => { if (cbGallery) cbGallery(true); } },
                { text: Cancel, onPress: () => { if (cbCamera) cbCamera(false); }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }
  
    static permissionConfirm(alertMessage, cb) {
        Alert.alert(
            "Hichaty",
            alertMessage,
            [
                { text: 'Continue', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
                { text: 'SETTINGS', onPress: () => { if (cb) cb(true); } },
            ],
            { cancelable: false }
        )
    }

   

}


