import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Searchbox from './searchbox';
import Avatar from './avatar';
import { sync } from '../assets/loginsignupIcons';
import { groupicon } from '../assets/tabicons';
import { SvgXml } from 'react-native-svg';
import AppContext from '../context/AppContext';

function Headerset(props) {
  // console.log(props, 'propsprops');
  return (
    <View style={styles.container} >
      <TouchableOpacity >
        <Avatar setting={props.gosetting} />
      </TouchableOpacity>
      {/* <Avatar setting={props.gosetting} />  */}
      <Searchbox />
      <TouchableOpacity onPress={props.creategroup}>
        <SvgXml
          xml={props.group == '1' ? groupicon : sync}
          style={props.group == '1' ? styles.icon : styles.icon1}
        />
      </TouchableOpacity>

    </View>
  );
}

export default Headerset;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems:'center',
    justifyContent:'center'
  },
  icon: {
    marginRight: 11,
  },
  icon1: {
    marginRight: 12,
  }
});
