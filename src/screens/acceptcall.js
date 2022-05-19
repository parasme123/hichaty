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
import {SvgXml} from 'react-native-svg';
import {volume, silent, mute, keypad, phonewhite} from '../assets/chaticons';
const Acceptcall = (props) => {
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
          <Text style={styles.callername}>Joi lee</Text>
          <Text style={styles.callertext}>00:34</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity>
            <SvgXml xml={silent} />
          </TouchableOpacity>

          <TouchableOpacity>
            <SvgXml xml={mute} />
          </TouchableOpacity>

          <TouchableOpacity>
            <SvgXml xml={volume} />
          </TouchableOpacity>

          <TouchableOpacity>
            <SvgXml xml={keypad} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buttonaccept}
          onPress={() => navigation.navigate('chat')}>
          <Text style={styles.accepttext}>End Call</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default Acceptcall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  callertext: {
    color: 'white',
    fontSize: 32,
    marginTop: 10,
    // lineHeight:20
  },
  callername: {
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
    marginTop: '18%',
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  buttonaccept: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: 'white',
    borderWidth: 2,
    width: '76%',
    marginTop: 35,
    borderRadius: 5,
  },
  accepttext: {
    color: 'white',
    fontSize: 17,
  },
  icon: {
    marginTop: '29%',
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'space-between',
  },
});
