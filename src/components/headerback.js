import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { back } from '../assets/changethemeicons';

function Headermain(props) {
  const { navigation, timeLeft } = props;
  const { secondes, minutes, hours } = timeLeft ? timeLeft : null;

  const checkTimeIsDefined = () => {
    return minutes !== null && hours !== null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.back} >
      <SvgXml xml={back} color="#53A8CB" />
      </TouchableOpacity>
    
      <Text style={styles.hi}>{props.comment}</Text>
      <View>
        {props.typetime === 'timer' ? (
          <View style={styles.time}>
            { !!timeLeft && checkTimeIsDefined && <Text style={styles.timer}>Timer : {hours ? hours : "00"}: {minutes ? minutes : "00"}: {secondes ? secondes : "00"} </Text>}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 3,
    paddingLeft: 5
  },
  hi: {
    fontSize: 17,
    color: '#424242',
    marginHorizontal: 5
  },
  time: {
    flexDirection: 'row',
  },
  timer: {
    fontSize: 18,
    marginRight: 3,
  },
  minutes: {
    fontSize: 12,
    marginTop: 7
  },
});

export default Headermain;
