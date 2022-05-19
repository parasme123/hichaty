import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
} from 'native-base';
import image from '../assets/bg.jpg';
import { phonecall, chat, block, clear, del1, more, videocall } from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';
import { voicecall } from '../assets/chaticons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

function Cardset(props) {

  const { number, data } = props;
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
    // console.log('props', props)
  }, [])

  return (
    <View style={styles.card}>

      <Card>
        <CardItem cardBody>
          <Image source={image} style={{ height: 180, width: null, flex: 1 }} />
          <View style={styles.opacity}>
            <View></View>
            <TouchableOpacity onPress={props?.blockuser}>
              <Text style={styles.heading} >{data.name ? data.name : 'HiChaty'}</Text>
            </TouchableOpacity>
            <Text style={styles.subtext}>Love is life and love is family</Text>
          </View>
        </CardItem>

          <View style={styles.icons}>
            {/* <View>
              <SvgXml xml={chat} onPress={props.chat} />
            </View> */}

            <TouchableOpacity onPress={props.chat} style={styles.icon} >
              <SvgXml xml={chat} />
            </TouchableOpacity>

            <TouchableOpacity onPress={props.phone} style={styles.icon}>
              <SvgXml xml={phonecall} />
            </TouchableOpacity>

            <TouchableOpacity onPress={props.video} style={styles.icon}>
              <SvgXml xml={videocall} />
            </TouchableOpacity>


            {/* <View>
              <SvgXml xml={phonecall} onPress={props.phone} />
            </View>
            <View>
              <SvgXml xml={voicecall} onPress={props.video} />
            </View> */}
            <Menu
              ref={setMenuRef}
              button={<SvgXml xml={more} style={styles.icon} onPress={showMenu} />}>
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
      </Card>
    </View>

  );
}

export default Cardset;

const styles = StyleSheet.create({
  card: {
    marginVertical: -2,
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  // icons: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  // },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    width: '100%'
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
  texticon: {
    fontSize: 9,
    textAlign: 'center',
  },
  textred: {
    color: 'red',
  },
  ictext: {
    flexDirection: 'row',
    borderBottomColor: 'black',
  },
});
