import React, {useState, useRef} from 'react';
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
import {bluecircel} from '../assets/tabicons';
import {activegroup, group} from '../assets/tabicons';
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

const Updatedgroup = (props) => {
  const {navigation} = props;

  return (
    <View style={styles.container}>
      <Header
        comment="Group Details"
        back={() => navigation.goBack()}
        addmember={() => navigation.navigate('addmember')}
        add="1"
      />
      <View style={styles.sethead}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            placeholder="dnwe.com"
            onChangeText={(searchString) => {
              this.setState({searchString});
            }}
            underlineColorAndroid="transparent"
          />
          <SvgXml xml={bluecircel} style={styles.icon} />
        </View>
        <View style={styles.users}>
          <SvgXml xml={activegroup} style={styles.userdata} />
          <Text style={styles.text}>22</Text>
        </View>
        <SvgXml xml={group} />
      </View>
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
                select={item.selected}
                block={item.key}
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

export default Updatedgroup;

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
    width: '92%',
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
    width: 120,
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
  },
  users: {
    alignItems: 'center',
    backgroundColor: '#47525D',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
    marginLeft: 10,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
  userdata: {
    marginRight: 17,
  },
});
