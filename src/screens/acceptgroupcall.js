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
import {volume, silent, mute, keypad} from '../assets/chaticons';
const Acceptgroupcall = (props) => {
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
        <View style={styles.bottom}>
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
            onPress={() => navigation.navigate('bottom')}>
            <Text style={styles.accepttext}>End Call</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Acceptgroupcall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  callertext: {
    color: 'white',
    fontSize: 32,
    fontWeight: '100',
    marginTop: 10,
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
    borderRadius: 5,
    marginTop: 35,
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
  bottom: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    bottom: '8%',
    position: 'absolute',
  },
});
