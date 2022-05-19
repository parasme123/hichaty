import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';
import AppContext from '../context/AppContext';

function avatar(props) {
  const { user } = useContext(AppContext);

  return (

    <TouchableOpacity onPress={props.setting}>
      <LinearGradient
        colors={['#3C95CA', '#54A6E2', '#70B9FD']} style={styles.avatar}>
        <Avatar
          rounded
          source={user && user.picture ? { uri: user.picture } : require("../assets/appicon.png")}
          size={28}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default avatar;

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#2F91C9',
    marginLeft: -4,
    marginTop: -3,
    padding: 8.8,
    borderRadius: 8
  },
});
