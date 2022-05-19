import React, { useCallback, useContext } from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import Header from '../components/header';
import AppContext from '../context/AppContext';
import { SvgXml } from 'react-native-svg';
import { backblue } from '../assets/changethemeicons';

const Accounts = (props) => {
  const { navigation } = props;
  const { user } = useContext(AppContext);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>


    <Container style={styles.container}>
      {/* <Header comment="Accounts" back={() => navigation.goBack()} /> */}
      <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>Accounts</Text>

      </View>

      <View style={styles.content}>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Mobile Number</Text>
          <TextInput
            style={styles.inputfield}
            placeholder="Mobile Number"
            placeholderTextColor="white"
            value={user.mobile}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Change Name</Text>
          <TextInput
            style={styles.inputfield}
            placeholder="Name"
            placeholderTextColor="white"
            value={user.name}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Contacts</Text>
          <Icon name="caret-down" style={styles.icon} />
        </View>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Sync Contacts</Text>
          <Icon name="caret-down" style={styles.icon} />
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('updateaccount', { backbtn: true })}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Profile</Text>
            <Icon name="caret-forward" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
    </Container>
    </SafeAreaView>

  );
};

export default Accounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  content: {
    width: '94%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  inputfield: {
    fontSize: 15,
    color: "black",
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 48,
    borderRadius: 5,
    marginTop: 3,
    paddingHorizontal: 5,
  },
  icon: {
    fontSize: 15,
  },
});
