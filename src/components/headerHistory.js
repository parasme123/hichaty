import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { back } from '../assets/changethemeicons';

function Header(props) {
  const { navigation } = props;
  const checkTimeIsDefined = () => {
    return minutes !== null && hours !== null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 5 }} onPress={props.back}>
        <SvgXml xml={back} color="#53A8CB" />
      </TouchableOpacity>
      <Text style={styles.hi}>History</Text>
      {/* <View>
          {props.typetime === 'timer' ? (
            <View style={styles.time}>
              { !!timeLeft && checkTimeIsDefined && <Text style={styles.timer}> </Text> }
            </View>
          ) : null}
        </View> */}
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

export default Header;
