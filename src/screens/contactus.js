import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, View, Text, TextInput,TouchableOpacity, SafeAreaView} from 'react-native';
import {Icon} from 'native-base';
import Header from '../components/header';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
const Contact = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>


    <Container style={styles.container}>
      {/* <Header comment="Contact us" back={() => navigation.goBack()} /> */}

      <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>Contact us</Text>

      </View>
      <View style={styles.content}>
        <View style={styles.sectionStyle}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="black"
            style={styles.inputfield}
          />
        </View>
        <View style={styles.sectionStyle}>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="black"
            style={styles.inputfield}
          />
        </View>
        <View style={styles.sectionStyle}>
          <TextInput
            placeholder="Contact Number"
            placeholderTextColor="black"
            style={styles.inputfield}
          />
        </View>
        <View style={styles.sectionStyle1}>
          <TextInput
            placeholder="Write your query"
            placeholderTextColor="black"
            style={styles.inputfield}
          />
        </View>
        <TouchableOpacity style={styles.buttonsend}>
          <Text style={styles.buttontext}>Send</Text>
        </TouchableOpacity>
      </View>
    </Container>
    </SafeAreaView>

  );
};

export default Contact;

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
  buttonsend: {
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '99%',
    marginTop: 10,
    alignSelf: 'center',
    
    borderRadius:5
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    width: '94%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  inputfield: {
    fontSize: 15,
    flex: 1,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 48,
    borderRadius: 5,
    marginTop: 3,
    paddingHorizontal: 5,
  },
  sectionStyle1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 49,
    borderRadius: 5,
    marginTop: 35,
    paddingHorizontal: 5,
  },
  icon: {
    fontSize: 15,
  },
});
