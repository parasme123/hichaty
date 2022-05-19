import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';

function avatar(props) {
  return (
    <TouchableOpacity onPress={props.setting}>

      <LinearGradient
        colors={['#3C95CA', '#54A6E2', '#70B9FD']} style={styles.avatar}>
        {/* <View style={styles.avatar}> */}
        <Avatar
          rounded
          source={props.remotePic ? { uri: props.remotePic } : require("../assets/appicon.png")}
          size={40}
        />
        {/* </View> */}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default avatar;

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#2F91C9',
    marginLeft: -10,
    marginTop: -3,
    // marginBottom:-12,
    padding: 10,
    paddingHorizontal: 25
  },
});
