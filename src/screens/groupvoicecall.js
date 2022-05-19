import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-elements';
import {user, mobile} from '../assets/loginsignupIcons';
import {SvgXml} from 'react-native-svg';
import {volume, silent, mute, keypad, phonewhite} from '../assets/chaticons';
import {settings} from '../assets/changethemeicons';
// import {TouchableOpacity} from 'react-native-gesture-handler';
const Groupvoicecall = (props) => {
  const [colour, setColour] = useState(['#F2853E', '#F77E52', '#FD7668']);
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <LinearGradient colors={colour} style={styles.avatar}>
        <Avatar
          rounded
          containerStyle={styles.avatar1}
          source={{uri: 'https://i.stack.imgur.com/uoVWQ.png'}}
          size={200}
        />
        <View style={styles.input}>
          <Text style={styles.callertext}>Joi Lee</Text>
          <TouchableOpacity>
            <SvgXml xml={phonewhite} style={{marginTop: 15}} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.buttonaccept}
            onPress={() => navigation.navigate('acceptgroupcall')}>
            <Text style={styles.accepttext}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonaccept}
            onPress={() => navigation.goBack()}>
            <Text style={styles.declinetext}>Decline</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Groupvoicecall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  callertext: {
    color: 'white',
    fontSize: 19,
    marginTop: 10,
  },
  avatar: {
    backgroundColor: '#2F91C9',
    padding: 10,
    height: '100%',
    alignItems: 'center',
    paddingBottom: '4%',
  },
  avatar1: {
    marginTop: '25%',
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  buttonaccept: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: 'white',
    borderWidth: 2,
    width: '70%',
    marginTop: 35,
    borderRadius: 5,
  },
  accepttext: {
    color: 'green',
    fontSize: 17,
  },
  declinetext: {
    color: 'red',
    fontSize: 17,
  },
  bottom: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    bottom: '8%',
    position: 'absolute',
  },
});
