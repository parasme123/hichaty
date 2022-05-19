import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, View, Text, ScrollView,TouchableOpacity, SafeAreaView} from 'react-native';
import Header from '../components/header';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
const Terms = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>


    <Container style={styles.container}>
       <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>Terms & Conditions</Text>

      </View>
      {/* <Header comment="Terms & Conditions" back={() => navigation.goBack()} /> */}
      {/* <ScrollView showsVerticalScrollIndicator="false"> */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>1. Introduction</Text>
          <Text style={styles.text}>
            1.1 These terms and conditions shall govern your use of our
            Messanger Application. 1.2 By using our website, you accept these
            terms and conditions in full; accordingly, if you disagree with
            these terms and conditions or any part of these terms and
            conditions, you must not use our website. 1.3 If you [register with
            our website, submit any material to our website or use any of our
            website services], we will ask you to expressly agree to these terms
            and conditions. 1.4 You must be at least [18] years of age to use
            our website; and by using our website or agreeing to these terms and
            conditions, you warrant and represent to us that you are at least
            [18] years of age. 1.5 Our website uses cookies; by using our
            website or agreeing to these terms and conditions, you consent to
            our use of cookies in accordance with the terms of our [privacy and
            cookies policy]. 2. Credit 2.1 This document was created using a
            template from SEQ Legal (http://www.seqlegal.com). You must retain
            the above credit, unless you purchase a licence to use this document
            without the credit. You can purchase a licence at:
            http://www.website-contracts.co.uk/seqlegal-licences.html. Warning:
            use of this document without the credit, or without purchasing a
            licence, is an infringement of copyright. 3. Copyright notice 3.1
            Copyright (c) [year(s) of first publication] [full name]. 3.2
            Subject to the express provisions of these terms and conditions: (a)
            we, together with our licensors, own and control all the copyright
            and other intellectual property rights in our website and the
            material on our website; and (b) all the copyright and other
            intellectual property rights in our website and the material on our
            website are reserved. 4. Licence to use website 4.1 You may: (a)
            view pages from our website in a web browser; (b) download pages
            from our website for caching in a web browser; (c) print pages from
            our Application; (d) [stream audio and video files from our
            Application; and] (e) [use [our website services] by means of a web
            browser,]
          </Text>
        </ScrollView>
      </View>
      {/* </ScrollView> */}
    </Container>
    </SafeAreaView>

  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    width: '93%',
    alignContent: 'center',
    alignSelf: 'center',
    // alignItems:'center',
    // marginTop: '35%',
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    marginTop: 5,
    marginBottom: 90,
    color: '#000000aa',
    // marginLeft:3
  },
});
