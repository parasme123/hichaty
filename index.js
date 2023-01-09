/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
//import DeepLinking from 'react-native-deep-linking';
import bgMessaging from './bgMessaging';

messaging().setBackgroundMessageHandler(bgMessaging);

AppRegistry.registerComponent(appName, () => App);
