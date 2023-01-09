import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Avatar from './avatarchatsingle';
import { back } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
import {
  bluechat, bluechat1,
  del1,
  clear,
  block,
  more,
  videocall,
  phonecall,
} from '../assets/cardicons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import firestore from '@react-native-firebase/firestore';
const messagesRef = firestore().collection('messages');
const ClearedMessagesRef = firestore().collection('clearedMessages');

function Headerset(props) {
  var _menu = null;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const clearAllMessage = async () => {
    let roomData = props.roomRef;
    // console.log("roomData : ", roomData)
    // return;
    await messagesRef
    .doc(roomData)
    .get()
    .then((querySnapshot) => {
      const entries = Object.entries(querySnapshot.data());
      entries.forEach(async (message) => {
        await ClearedMessagesRef.doc(roomData).set(
          {
            [message[0]]: {
              text: message[1].text,
              room: message[1].room,
              createdAt: message[1].createdAt,
              userId: message[1].userId,
              read: message[1].read,
            },
          },
          { 
            merge: true 
          }
        );
      });
    })
    .then(async () => {
      await messagesRef.doc(roomData).delete();
      _menu.hide();
      props.setMessages([]);
    });
  }

  const showMenu = () => {
    _menu.show();
  };
  // console.log(props.remotePic, "props.remotePic");
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.back}>
        <SvgXml xml={back} style={{ marginRight: -5 }} />

      </TouchableOpacity>

      <Avatar remotePic={props.remotePic} />


      <View style={styles.icons}>
        <TouchableOpacity style={styles.subtext}>
          <SvgXml xml={bluechat1} />
          <Text style={styles.texticonblue}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> props.voicecall("voicecall")} //props.voicecall
         style={styles.subtext}>
          <SvgXml xml={phonecall} />
          <Text style={styles.texticon}>Audio Call</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> props.videocall("videocall")} // props.videocall
          style={styles.subtext}>
          <SvgXml xml={videocall} />
          <Text style={styles.texticon}>Video Call</Text>
        </TouchableOpacity>
        <View>
          <Menu
            ref={setMenuRef}
            button={
              <TouchableOpacity onPress={showMenu}
                style={styles.subtext}>
                <SvgXml xml={more} />
                <Text style={styles.texticon}>More</Text>
              </TouchableOpacity>
            }>
            <MenuItem onPress={hideMenu}>
              <View style={styles.ictext}>
                <SvgXml xml={block} />
                <Text style={styles.textred}>Block</Text>
              </View>
            </MenuItem>
            <View style={{ borderBottomWidth: 1 }} />
            <MenuItem onPress={clearAllMessage}>
              <View style={styles.ictext}>
                <SvgXml xml={clear} />
                <Text style={styles.textred}>Clear</Text>
              </View>
            </MenuItem>
            <View style={{ borderBottomWidth: 1 }} />
            <MenuItem onPress={hideMenu}>
              <View style={styles.ictext}>
                <SvgXml xml={del1} />
                <Text style={styles.textred}>Delete</Text>
              </View>
            </MenuItem>
          </Menu>
        </View>
      </View>
    </View>
  );
}

export default Headerset;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 10
  },
  subtext: {
    alignContent: 'center',
    alignItems: 'center'
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginRight: 8
  },
  texticon: {
    fontSize: 11,
    textAlign: 'center',
    color: 'black'
  },
  texticonblue: {
    textAlign: 'center',
    color: '#53A8CB',
    fontSize: 11,
  },
  textred: {
    color: 'red',
  },
  ictext: {
    flexDirection: 'row',
    borderBottomColor: 'black',
  },
});
