import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { back } from '../assets/changethemeicons';

function Headermain(props) {
  const { navigation, doneProcess } = props;
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={props.back} style={styles.innercontainer}>
        <SvgXml
          xml={back}
          style={styles.icon}
          color="#53A8CB"
        />
        <Text style={styles.hi}>{props.comment}</Text>
      </TouchableOpacity>
      <View>
        {props.add === '1' ? (
          <Text style={styles.textupdate} onPress={props.addmember}>
            Update
          </Text>
        ) : (
          <TouchableOpacity style={styles.button} onPress={doneProcess ? null : props.done}>
            {doneProcess ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttontext}>Done</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
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
