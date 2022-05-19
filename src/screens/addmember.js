import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import Header from '../components/headergroupchat';
import Card from '../components/creategroupchatcard';
import {SvgXml} from 'react-native-svg';
import {addimage} from '../assets/chaticons';
import {SectionGrid} from 'react-native-super-grid';

const Images = [
  {image: require('../assets/user2.jpg')},
  {image: require('../assets/bg.jpg')},
];
const data = [
  {key: 'A', selected: false, img: Images[0].image},
  {key: 'B', selected: true, img: Images[1].image},
  {key: 'C', selected: false, img: Images[0].image},
  {key: 'D', selected: false, img: Images[1].image},
  {key: 'E', selected: false, img: Images[0].image},
];

const Addmember = (props) => {
  const {navigation} = props;
  
  return (
    <View style={styles.container}>
      <Header comment="Add Member" back={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[
              {
                data: data,
              },
            ]}
            style={styles.gridView}
            renderItem={({item, section, index}) => (
              <Card
                number={item.key}
                image={item.img}
                video={() => navigation.navigate('videocall')}
                phone={() => navigation.navigate('voicecall')}
                chat={() => navigation.navigate('chat')}
                blockuser={() => navigation.navigate('settheme')}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Addmember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
  },
  setcard: {
    display: 'flex',
    marginVertical: 1,
  },
  sethead: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    paddingBottom: 5,
  },
  input: {
    paddingLeft: 5,
    width: 170,
    backgroundColor: '#fff',
    color: '#424242',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
  },
  input1: {
    width: 80,
    backgroundColor: '#fff',
    color: '#424242',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    textAlign: 'center',
    paddingTop: 10,
  },
  icon: {
    marginLeft: 15,
    // padding: 20,
    // borderWidth: 1,
    // borderRadius: 20,
  },
});
