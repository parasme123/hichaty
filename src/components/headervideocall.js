import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {back} from '../assets/changethemeicons';

function Headermain(props) {
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        <SvgXml
          xml={back}
          onPress={props.back}
          style={styles.icon}
          color="#53A8CB"
        />
        <Text style={styles.hi}>{props.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 8,
  },
  innercontainer: {
    flexDirection: 'row',
  },
  hi: {
    fontSize: 17,
    marginLeft: 4,
  },
  icon: {
    marginTop: 2,
  },
  button: {
    backgroundColor: '#53A8CB',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 5,
    borderRadius: 4,
  },
  buttontext: {
    color: 'white',
    fontSize: 14,
  },
  textupdate: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default Headermain;
