import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, View, Text, TextInput,TouchableOpacity, SafeAreaView} from 'react-native';
import Header from '../components/header';
import {logo} from '../assets/loginsignupIcons';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
const About = (props) => {
  const {navigation} = props;
  const currentYear = new Date().getFullYear();
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>


    <Container style={styles.container}>
      {/* <Header comment="About" back={() => navigation.goBack()} type="1" /> */}
      <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>About</Text>

      </View>
      <View style={styles.content}>
        <SvgXml xml={logo} style={styles.logo} />
        <View style={styles.chattext}>
          <Text style={styles.chattext1}>HiChaty</Text>
          <Text style={styles.chattext1}>Version 1.0</Text>
        </View>
      </View>
      <View style={styles.textbottom}>
        <Text style={styles.textbottom1}>@ {currentYear} hichatymsg.com</Text>
      </View>
    </Container>
    </SafeAreaView>

  );
};

export default About;

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
    // alignItems:'center',
    marginTop: '35%',
  },
  chattext: {
    alignItems: 'center',
    marginTop: 15,
  },
  chattext1: {
    fontSize: 20,
  },
  logo: {
    left: '23%',
  },
  textbottom: {
    position:'absolute',
    bottom: "2%",
    alignSelf:'center'
  },
  textbottom1: {
    fontSize: 16,
  },
});
