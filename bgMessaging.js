//@flow
import { NativeModules, AppState } from 'react-native';
const { Hichaty } = NativeModules;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

export default async (remoteMessage) => {
    //console.log('Push notification received', remoteMessage.data.event, 'in state', AppState.currentState);
    console.log('Message is handled in the background', remoteMessage );
    if(remoteMessage){
        //await AsyncStorage.setItem('@SM_NOTIFICATIONS', 'true' );
   
        if (AppState.currentState !== "active") {

            let msgType = remoteMessage.data.msgType;
            let roomRef = remoteMessage.data.roomRef;
            let remotePeerName = remoteMessage.data.senderName;
            let remotePeerId = remoteMessage.data.senderId;
            let remotePic = remoteMessage.data.senderPicture;
            let url;
            if (msgType === 'acceptvideocall') {
                //url = 'hichaty://acceptvideocall' + '/' + roomRef + '/' + remotePeerName + '/' + remotePeerId;
                url = `hichaty://acceptvideocall?roomRef=${roomRef}&remotePeerName=${remotePeerName}&remotePeerId=${remotePeerId}&remotePic=${remotePic}`;

            }
            if (msgType === 'acceptvoicecall') {
                //url = 'hichaty://acceptvideocall' + '/' + roomRef + '/' + remotePeerName + '/' + remotePeerId;
                url = `hichaty://acceptvoicecall?roomRef=${roomRef}&remotePeerName=${remotePeerName}&remotePeerId=${remotePeerId}&remotePic=${remotePic}`;

            }
            if(url){
                console.log('launching app...')
                Hichaty.launchMainActivity(encodeURI(url));  
            }
        }
    }

    return Promise.resolve();
}