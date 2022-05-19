import React, { useState, useEffect } from 'react';
import {StyleSheet, View, TextInput, Image} from 'react-native';
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
} from '../assets/cardicons';
import {SvgXml} from 'react-native-svg';
import {pasword} from '../assets/loginsignupIcons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {TouchableOpacity} from 'react-native-gesture-handler';

function Cardset(props) {
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

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1}}
        onPress={props.block ? props.showmodal : null}>
        <Card>
          <CardItem>
            <View style={styles.icons}>
              { props.type !== "video call" ?
                <SvgXml
                  xml={phonecall}
                  onPress={props.block ? null : props.phone}
                />
                :
                <SvgXml
                  xml={videocall}
                  // onPress={props.block ? null : props.video}
                  onPress={props.video}
                />
              }
              <Text>{props.date}</Text>
              <Text>{props.duration}</Text>
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
    marginVertical:-2
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
    justifyContent: 'space-between',
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
