import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import image from '../assets/bg.jpg';
import {
  phonecall,
  videocall,
  more,
  chat,
  block,
  del1,
  clear,
  lockicon,
  chatactive,

} from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';


const Cardset = (props) => {

  const { colour, } = useContext(AppContext);
  const [isOnline, setIsOnline] = useState(false);
  var _menu = null;

  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const showMenu = () => {
    _menu.show();
  };

  useEffect(() => {
    firestore().collection('status')
      .where('state', '==', 'online')
      .onSnapshot(
        (snapShot) => {
          let online = snapShot.docChanges().findIndex((data) => (data.type === 'added' && data.doc.id == props.id));
          let offline = snapShot.docChanges().findIndex((data) => (data.type === 'removed' && data.doc.id == props.id));

          if(online != -1)setIsOnline(true);
          if(offline != -1)setIsOnline(false);
          // snapShot.docChanges().forEach(
          //   (change) => {
          //     if (change.type === 'added' && change.doc.id === props.id) {
          //       var msg = "User " + change.doc.id + " isOnline";
          //       // console.log(msg);
          //       setIsOnline(true);
          //     }
          //     if (change.type === 'removed' && change.doc.id === props.id) {
          //       var msg = "User " + change.doc.id + " isOffline";
          //       // console.log(msg);
          //       setIsOnline(false);
          //     }
          //   }
          // )
        }
      )
  }, [])

  // console.warn("Card props : ", props)

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={props.block ? props.showmodal : null}>
        <Card>
          <CardItem
            cardBody
          >
            <Image source={props.picture ? { uri: props.picture } : require("../assets/appicon.png")}
              // source={props.picture ? { uri: props.picture } : image}
              style={styles.imagse} />
            {/* </View> */}
            {props.block ? (
              <View style={styles.shadow}>
                <View style={styles.locktext}>
                  <SvgXml xml={lockicon} style={styles.lock} />
                  <Text style={styles.text}>Lock</Text>
                </View>
              </View>
            ) : null}
            <View style={styles.opacity}>
              {/* <View></View> */}
              {props.id &&
                <View style={isOnline ? styles.isOnline : styles.isOffline} />}
              {!props.UserNameContact ?
                <Text numberOfLines={1} style={styles.heading} onPress={props.block ? null : props.blockuser}>{props.name}</Text>
                : <Text numberOfLines={1} style={[styles.heading,{marginBottom:-8,marginTop:12}]}>{props.UserNameContact}</Text>
              }
              <Text numberOfLines={1} style={styles.subtext}>{props.status}</Text>
            </View>
            {/* </TouchableOpacity> */}
          </CardItem>

          <CardItem cardBody>
            {props.id ?
              <View style={styles.icons}>
                <TouchableOpacity onPress={props.chat} underlayColor={colour[0]} style={styles.icon} >
                  {props.unreadmsgs > 0 ?
                    // <View style={{ ...styles.unreadchat, backgroundColor: colour[0] }}>
                    <SvgXml xml={chatactive} />
                    /* <Text >{ props.unreadmsgs}</Text>  */
                    // </View>
                    :
                    <SvgXml xml={chat} />
                  }
                </TouchableOpacity>
                <TouchableOpacity onPress={props.phone} underlayColor={colour[0]} style={styles.icon}>
                  <SvgXml xml={phonecall} />
                </TouchableOpacity>
                <TouchableOpacity onPress={props.video} underlayColor={colour[0]} style={styles.icon}>
                  <SvgXml xml={videocall} />
                </TouchableOpacity>
                <Menu
                  ref={setMenuRef}
                  button={<SvgXml xml={more} style={styles.icon} onPress={props.block ? null : showMenu} />}>
                  <MenuItem onPress={hideMenu}>
                    <View style={styles.ictext}>
                      <SvgXml xml={block} />
                      <Text style={styles.textred}>Block</Text>
                    </View>
                  </MenuItem>
                  <View style={{ borderBottomWidth: 1 }} />
                  <MenuItem onPress={hideMenu}>
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
              :
              <TouchableOpacity onPress={props.Invited}
                style={[styles.icons, { alignItems: 'center', justifyContent: 'center', }]}>

                <Image style={{ height: 15, width: 15, marginRight: 20, resizeMode: "contain" }}
                  source={require("../assets/invite.png")} />

                <Text style={[styles.heading, { color: '#000', marginBottom: 5 }]} >Invite</Text>
              </TouchableOpacity>
            }
          </CardItem>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export default Cardset;

const styles = StyleSheet.create({
  card: {
    marginVertical: 0,
  },
  isOnline: {
    width: 15,
    height: 15,
    zIndex: 1,
    backgroundColor: 'green',
    position: 'absolute',
    top: 7,
    left: '5%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  isOffline: {
    width: 15,
    height: 15,
    zIndex: 1,
    backgroundColor: 'gray',
    position: 'absolute',
    top: 7,
    left: '5%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  unreadchat: {
    width: '90%',
    height: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  overlay: {
    backgroundColor: 'black',
    position: 'absolute',
  },
  shadow: {
    backgroundColor: '#61615Faa',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: '100%',
  },
  imagse: {
    height: 180,
    width: null,
    flex: 1,
  },
  locktext: {
    position: 'absolute',
    left: '42%',
    top: '30%',
    alignContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  opacity: {
    backgroundColor: '#000000aa',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    opacity: 0.8,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    width: '100%'
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 12,
    color: 'white',
    paddingBottom: 6,
    lineHeight: 14,
    width: '97%',
    textAlign: 'center'
  },
  textred: {
    color: 'red',
  },
  ictext: {
    flexDirection: 'row',
    borderBottomColor: 'black',
  },
});
