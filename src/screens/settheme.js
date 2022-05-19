import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-elements';
import {SvgXml} from 'react-native-svg';
import {whiteuser, whitemobile, successwhite} from '../assets/loginsignupIcons';
import {settings, block, del,backwhite} from '../assets/changethemeicons';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import { clear } from '../assets/cardicons';
import log_message from '../lib/log';
import { TouchableOpacity } from 'react-native-gesture-handler';

const usersCollection = firestore().collection('users');
const clearedMessagesCollection = firestore().collection('clearedMessages');
const messagesCollection = firestore().collection('messages');
const roomsCollection = firestore().collection('rooms');


const setTheme = (props) => {
  const { navigation, route }=props;
  const { name, mobile, status, picture, targetId } = route.params;
  const { user, colour, setColour }  = useContext(AppContext);
  const [ roomRef, setRoomRef ] = useState(null);
  const [ blockLoading, setBlockLoading ] = useState(false);
  const [ clearLoading, setClearLoading ] = useState(false);
  
  const blockUser = async () => {
    setBlockLoading(true);
    const userRef = usersCollection.doc(user.id);
    await userRef.update({ blockedUsers: firestore.FieldValue.arrayUnion(targetId) });
    setBlockLoading(false);
  }

  const clearChat = async () => {
    setClearLoading(true);
    const ref = messagesCollection.doc(roomRef);
    const documentSnapshot = await ref.get();
    await clearedMessagesCollection.doc(documentSnapshot.id).set(documentSnapshot.data(), {merge: true});
    await ref.set({});
    setClearLoading(false);
  }

  useEffect( () => {
    roomsCollection
      .where("participants", "in", [[user.id, targetId],[targetId, user.id]] ).get()
      .then( querySnapshot => {
        querySnapshot.forEach( documentSnapshot => {
          log_message(user.id, 'roomRef', documentSnapshot.id);
          setRoomRef(documentSnapshot.id);
        })
    });
  },[]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={colour} style={styles.avatar}>
        <View style={styles.icons}>
          <SvgXml
            xml={backwhite}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Avatar
          rounded
          containerStyle={styles.avatar1}
          source={{uri: picture ? picture : 'https://i.stack.imgur.com/uoVWQ.png'}}
          size={120}
        />
        <View style={styles.input}>
          <View style={{...styles.sectionStyle }}>
            <TextInput
              style={styles.inputfield}
              placeholder="Mobile Number"
              placeholderTextColor="white"
              value={mobile}
              editable={false}
              underlineColorAndroid="transparent"
              
            />
            <SvgXml xml={whitemobile} />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputfield}
              placeholder="Username"
              placeholderTextColor="white"
              underlineColorAndroid="transparent"
              value={name}
              editable={false}
            />
            <SvgXml xml={whiteuser} />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputfield}
              placeholder="Life is Hell"
              placeholderTextColor="white"
              underlineColorAndroid="transparent"
              value={status}
              editable={false}
            />
            <SvgXml xml={successwhite} />
          </View>
        </View>
      </LinearGradient>
      { roomRef ? 
        <View style={styles.profileicons}>
          <TouchableOpacity style={styles.textandicon} onPress={ () => blockUser() }>
            { !blockLoading ?
                <SvgXml xml={block} />
                :
                <ActivityIndicator color="#ff0000" size="large" style={{ height: 60}} />
            }
            <Text style={styles.texticon}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.textandicon} onPress={ () => clearChat() }>
            { !clearLoading ?
                <SvgXml xml={del} />
                :
                <ActivityIndicator color="#ff0000" size="large" style={{ height: 60}} />
            }
            <Text style={styles.texticon}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
        :
        null
      }
      
    </View>
  );
};

export default setTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 50,
  },
  avatar: {
    backgroundColor: '#2F91C9',
    padding: 10,
    // height: '55%',
    alignItems: 'center',
    paddingBottom: '4%',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    top: 32,
  },
  avatar1: {
    marginTop: '10%',
  },
  inputfield: {
    fontSize: 15,
    color: 'white',
    flex: 1,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 45,
    borderRadius: 5,
    marginTop: 10,
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  profileicons: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 35,
  },
  texticon: {
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  textandicon: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'space-between'
  },
});
