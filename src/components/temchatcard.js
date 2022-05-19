import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import image from '../assets/bg.jpg';
import { chat, del1, clear, block, more } from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { TouchableOpacity } from 'react-native';
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
      <Card>
        <CardItem cardBody>

          <Image source={props.picture ? { uri: props.picture } : require("../assets/appicon.png")}
            style={{ height: 180, width: null, flex: 1 }} />
          <View style={styles.opacity}>
            <View></View>
            <Text numberOfLines={1} style={styles.heading}>{props.name}</Text>
            <Text numberOfLines={1} style={styles.subtext}>{props.status}</Text>
          </View>
        </CardItem>

        <CardItem>
          <View style={styles.iconset}>
            <View style={styles.icons}>
              <TouchableOpacity onPress={props.modal}>
                <SvgXml xml={chat} />
              </TouchableOpacity>
              <View>
                <Menu
                  ref={setMenuRef}
                  button={<SvgXml xml={more} onPress={showMenu} />}>
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
            </View>
          </View>
        </CardItem>
      </Card>
    </View>
  );
}

export default Cardset;

const styles = StyleSheet.create({
  card: {
    marginVertical: -2
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
    width: '50%',
  },
  iconset: {
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
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
