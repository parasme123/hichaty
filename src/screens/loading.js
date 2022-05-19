import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, TextInput, Image} from 'react-native';
import {SvgXml} from 'react-native-svg';
import { logo } from '../assets/loginsignupIcons';

function Loading(props) {
  
    return  (
      <View style={styles.container}>
        <SvgXml xml={logo}  styles={styles.icon}/>
      </View>
    )
  
}

export default Loading;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  icon: {
      flex:1, 
      height: '50%'
  },
  indicator:{
      flex:1
  }

});
