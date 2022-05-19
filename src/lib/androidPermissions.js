import { PermissionsAndroid, Platform } from 'react-native';
// import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';
// Daijobu
const androidPermissions = {
    camera:
    {
        name: "Camera",
        permission: PermissionsAndroid.PERMISSIONS.CAMERA ,
        rationale: {
            title: 'Hichaty App Camera Permission',
            message: "Hichaty Video App needs access to your camera " + "so you can start enjoying",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
            buttonNeutral: "Ask Me Later"
        }
    },
    audio:
    {
        name: "Audio",
        permission:PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        rationale: {
            title: 'Hichaty App Micro Permission',
            message: "Hichaty Video App needs access to your micrphone" + "so you can start enjoying",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
            buttonNeutral: "Ask Me Later"
        }
    },
    gallery:
    {
        name: "Gallery",
        permission:PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        rationale: {
            title: 'Hichaty App gallery Permission',
            message: "Hichaty Video App needs access to photos , media and files on your device",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
            buttonNeutral: "Ask Me Later"
        }
    }
}


export default androidPermissions;