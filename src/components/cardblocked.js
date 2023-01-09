import React, { useState, useEffect, useContext } from 'react';
import {StyleSheet, View, TextInput, Image, ActivityIndicator } from 'react-native';
import {Card, CardItem, Text} from 'native-base';
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
  chatactive
} from '../assets/cardicons';
import {SvgXml} from 'react-native-svg';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {TouchableHighlight, TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
const usersCollection = firestore().collection('users');


const Cardset = (props) => {

  const { colour, user } = useContext(AppContext);
  const [ isOnline, setIsOnline ] = useState(false);
  const [ unblockLoading, setUnblockLoading ] = useState(false);

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

  useEffect(()=>{
    firestore().collection("status")
      .where("state", "==", "online")
      .onSnapshot(
        (snapShot) => {
          snapShot.docChanges().forEach(
            (change) => {
              if(change.type === "added" && change.doc.id === props.id ){
                var msg = "User "+ change.doc.id + " isOnline";
                // console.log(msg);
                setIsOnline(true);           
              }
              if(change.type === "removed" && change.doc.id === props.id ){
                var msg = "User "+ change.doc.id + " isOffline";
                // console.log(msg);
                setIsOnline(false);           
              }
            }
          )
        }
      )
  },[])

  const unblockUser = async (id) => {
    setUnblockLoading(true);
    const userRef = usersCollection.doc(user.id);
    await userRef.update({ blockedUsers: firestore.FieldValue.arrayRemove(id) });
    setUnblockLoading(false);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1}}
        onPress={props.block ? props.showmodal : null}>
        <Card>
          <CardItem
            cardBody
            >
            <Image source={props.picture ? { uri: props.picture} : image } style={styles.imagse} />
            {/* </View> */}
            {props.block ? (
              <View style={styles.shadow}>
                <View style={styles.locktext}>
                  <SvgXml xml={block} style={styles.lock} height={50} width={50}/>
                </View>
              </View>
            ) : null}
            <View style={styles.opacity}>
              {/* <View></View> */}
              <View style={ isOnline ? styles.isOnline : styles.isOffline }/>
              <Text style={styles.heading} onPress={props.block ? null : props.blockuser}>{ props.name }</Text>
              <Text style={styles.subtext}>
                Love is life and love is family
              </Text>
            </View>
            {/* </TouchableOpacity> */}
          </CardItem>

          <CardItem cardBody>
            <View style={styles.icons}>
              <TouchableHighlight underlayColor={ 'white' }  style={styles.icon} onPress={() => unblockUser(props.id)}>
                { !unblockLoading && user ?
                    <Text style={styles.unblockuser}>Unblock</Text>
                    :
                    <ActivityIndicator color="#ff0000" size="large" style={styles.unblockloading} />
                }
              </TouchableHighlight>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export default Cardset;

const styles = StyleSheet.create({
  card:{
    marginVertical:0,
  },
  isOnline:{
    width:15,
    height:15,
    zIndex: 1,
    backgroundColor: 'green',
    position: 'absolute',
    top: 7,
    left: '5%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  isOffline:{
    width:15,
    height:15,
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
    width:'90%',
    height:'90%',
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
    left: '35%',
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
  icon:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '200%',
  },
  heading: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  unblockuser: {
    alignSelf: 'center',
    width: '100%',
    fontSize: 16,
    fontStyle: 'italic'
  },
  unblockloading: {
    marginLeft: -25,
    // backgroundColor: 'green'
  },
  subtext: {
    fontSize: 12,
    color: 'white',
    paddingBottom:6,
    lineHeight:14,
    width:'97%',
    textAlign:'center'
  },
  textred: {
    color: 'red',
  },
  ictext: {
    flexDirection: 'row',
    borderBottomColor: 'black',
  },
});
