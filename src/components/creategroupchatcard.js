import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { Card, CardItem, Item, Text } from 'native-base';
import image from '../assets/bg.jpg';
import {
  phonecall,
  videocall,
  more,
  chat,
  block,
  del1,
  clear,
  exitgroup
} from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';
import { pasword } from '../assets/loginsignupIcons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { add } from '../assets/chaticons';
import { success } from '../assets/cardicons'

function Cardset(props) {
  const { select, setSelect } = props;
  const number = String(props.number);
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
        style={{ flex: 1 }}
        onPress={select[number] === true ? props.showmodal : null}>
        <Card>
          <CardItem cardBody onPress={() => console.log('show')}>
            <TouchableOpacity style={select[number] === true ? styles.carddisable : styles.imagse} onPress={() => props.setSelect({ ...select, [number]: !select[number] })}>
              <Image
                source={props.avatar ? {uri : props.avatar} : props.image}
                // source={props.image ? props.image : require("../assets/appicon.png")}
                style={select[number] === true ? styles.carddisablee : styles.imagsee}
              />
            </TouchableOpacity>
            {select[number] === true ? (
              <View style={styles.shadow}>
                <View style={styles.locktext}>
                  <TouchableOpacity onPress={() => props.setSelect({ ...select, [number]: !select[number] })}>
                    <SvgXml xml={success} style={styles.lock} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <View style={styles.opacity}>
              <View></View>
              <Text style={styles.heading}>{props?.name}</Text>

              {/* <Text style={styles.heading} onPress={props.blockuser}>{props?.name}</Text> */}
              <Text style={styles.subtext}>
                Love is life and love is family
              </Text>
            </View>
            {/* </TouchableOpacity> */}
          </CardItem>

          <CardItem>
            <View style={styles.icons}>
              <SvgXml xml={chat} onPress={props.chat} />
              <SvgXml xml={phonecall} onPress={props.phone} />
              <SvgXml xml={videocall} onPress={props.coice} />
              <Menu
                ref={setMenuRef}
                button={<SvgXml xml={more} onPress={showMenu} />}>
                <MenuItem onPress={hideMenu}>
                  {props.block === 'A' ? (
                    <View style={styles.ictext}>
                      <Text style={styles.textblue}> Admin</Text>
                    </View>
                  ) : (
                    <View style={styles.ictext}>
                      <SvgXml xml={add} />
                      <Text style={styles.textadmin}> Admin</Text>
                    </View>
                  )}
                </MenuItem>
                <View style={{ borderBottomWidth: 1 }} />
                <MenuItem onPress={hideMenu}>
                  <View style={styles.ictext}>
                    <SvgXml xml={del1} />
                    <Text style={styles.textred}> Delete</Text>
                  </View>
                </MenuItem>
                <View style={{ borderBottomWidth: 1 }} />
                <MenuItem onPress={hideMenu}>
                  <View style={styles.ictext}>
                    <SvgXml xml={exitgroup} />
                    <Text style={styles.textred}> Exit Group</Text>
                  </View>
                </MenuItem>

              </Menu>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export default Cardset;

const styles = StyleSheet.create({
  card: {
    marginVertical: -2
  },
  carddisable: {
    height: 180,
    width: null,
    flex: 1,
    opacity: 0.75,
  },
  imagse: {
    height: 180,
    width: null,
    flex: 1,
  },
  carddisablee: {
    height: 180,
    width: 190,
    flex: 1,
    alignSelf: 'center',
    opacity: 0.75,
  },
  imagsee: {
    height: 180,
    width: 190,
    flex: 1,
  },
  locktext: {
    position: 'absolute',
    left: '40%',
    alignContent: 'center',
    top: '40%',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  shadow: {
    backgroundColor: '#61615Faa',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: '100%',
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
  textblue: {
    color: 'blue',
    marginLeft: 15
  },
});
