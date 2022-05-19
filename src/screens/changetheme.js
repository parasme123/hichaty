import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';
import { SvgXml } from 'react-native-svg';
import { whiteuser, whitemobile, successwhite } from '../assets/loginsignupIcons';
import { settings, backwhite } from '../assets/changethemeicons';
import AppContext from '../context/AppContext';

const changeTheme = (props) => {

  const { navigation } = props;
  const { user, colour, setColour } = useContext(AppContext);
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [status, setStatus] = useState();
  const [picture, setPicture] = useState();

  useEffect(() => {
    if (user) {
      const { name, mobile, status, picture } = user
      setName(name);
      setMobile(mobile);
      setStatus(status);
      setPicture(picture);
    }
  }, [user])
  return (
    <SafeAreaView style={{
      flex: 1,
      alignContent: 'center',
      backgroundColor: colour[1] ,
            overflow: 'scroll'
    }}>


      <ScrollView style={styles.container}>
        <LinearGradient colors={colour} style={styles.avatar}>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <SvgXml
                xml={backwhite} />
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 5 }} onPress={() => navigation.navigate('settings')}>
              <SvgXml
                xml={settings} />
            </TouchableOpacity>

          </View>
          <Avatar
            rounded
            containerStyle={styles.avatar1}
            source={picture ? { uri: picture } : require("../assets/appicon.png")}
            // source={{ uri: picture ? picture : 'https://i.stack.imgur.com/uoVWQ.png' }}
            size={120}
          />
          <View style={styles.input}>
            <View style={{ ...styles.sectionStyle, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <TextInput
                style={styles.inputfield}
                placeholder="Mobile Number"
                placeholderTextColor="white"
                value={mobile}
                editable={false}
                underlineColorAndroid="transparent"
              />
              <SvgXml xml={whitemobile} />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                style={styles.inputfield}
                placeholder="Username"
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={name}
              />
              <SvgXml xml={whiteuser} />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                style={styles.inputfield}
                placeholder="Life is Hell"
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={status}
              />
              <SvgXml xml={successwhite} />
            </View>
          </View>
        </LinearGradient>
        <View style={styles.profilebackground}>
          <Text style={styles.profiletext}>Profile Background</Text>
          <View style={styles.showcolor}>
            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#3C95CA', '#54A6E2', '#70B9FD'])}>
              <LinearGradient
                colors={['#3C95CA', '#54A6E2', '#70B9FD']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#F2853E', '#F77E52', '#FD7668'])}>
              <LinearGradient
                colors={['#F2853E', '#F77E52', '#FD7668']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#C74CF1', '#E15ED9', '#FB6FC1'])}>
              <LinearGradient
                colors={['#C74CF1', '#E15ED9', '#FB6FC1']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.showcolor}>
            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#327FFA', '#4396FB', '#5FBFFD'])}>
              <LinearGradient
                colors={['#327FFA', '#4396FB', '#5FBFFD']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#2EF980', '#41FB9A', '#66FECD'])}>
              <LinearGradient
                colors={['#2EF980', '#41FB9A', '#66FECD']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#EBAB2D', '#E9BD35', '#E6D03E'])}>
              <LinearGradient
                colors={['#EBAB2D', '#E9BD35', '#E6D03E']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.showcolor}>
            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#F74F52', '#FA5C69', '#FE6B82'])}>
              <LinearGradient
                colors={['#F74F52', '#FA5C69', '#FE6B82']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#3B59EE', '#3148D2', '#161F8C'])}>
              <LinearGradient
                onPress={() => setColour(['#3B59EE', '#3148D2', '#161F8C'])}
                colors={['#3B59EE', '#3148D2', '#161F8C']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.colormain}
              onPress={() => setColour(['#767676', '#969696', '#BCBCBC'])}>
              <LinearGradient
                colors={['#767676', '#969696', '#BCBCBC']}
                style={styles.color}></LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

export default changeTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
    overflow: 'scroll'
  },
  text: {
    marginTop: 50,
  },
  avatar: {
    backgroundColor: '#2F91C9',
    padding: 10,
    alignItems: 'center',
    paddingBottom: '4%',
  },
  avatar1: {
    marginTop: '10%',
  },
  inputfield: {
    fontSize: 15,
    color: 'white',
    flex: 1,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 45,
    borderRadius: 5,
    marginTop: 10,
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  profilebackground: {
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignContent: 'center',
    marginTop: '2%',
    justifyContent: 'center'
  },
  profiletext: {
    fontSize: 16,
    color: 'black',
    marginTop: 7,
    marginBottom: 6,
    marginLeft: 14,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    top: 10,
  },
  showcolor: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  color: {
    width: '100%',
    height: 60,
    marginHorizontal: 3,
    marginVertical: 1,
  },
  colormain: {
    width: '27%',
    height: 60,
    marginHorizontal: 11,
    marginVertical: 5,
    position: "relative",
    flex: 1
  },
});
