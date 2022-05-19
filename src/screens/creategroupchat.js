import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Header from '../components/headergroupchat';
import Card from '../components/creategroupchatcard';
import { SvgXml } from 'react-native-svg';
import { addimage, addimagecicel } from '../assets/chaticons';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import { user } from '../assets/loginsignupIcons';
const roomsCollection = firestore().collection('rooms');
const usersCollection = firestore().collection('users');

const Images = [
  { image: require('../assets/user2.jpg') },
  { image: require('../assets/bg.jpg') },
];


const Creategroupchat = (props) => {

  const { navigation } = props;
  const { user, users } = useContext(AppContext);
  const [select, setSelect] = useState({});
  const [selectedItems, setSelectedItems] = useState([])
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    let array = [];
    if (select !== {}) {
      Object.entries(select).forEach(([key, value]) => {
        value ? array.push(key) : null
      })
    }
    setSelectedItems(array)
  }, [select])

  const onPressDone = async () => {
    if (selectedItems.length == 0) {
      alert("Please select users.")
      return false
    } if (groupName == '' || groupName.length == 0) {
      alert("Enter your group name.")
      return false

    } if (selectedItems.length > 0) {
      console.log(selectedItems, groupName, user.id)
      const data = { admin: user.id, name: groupName, participants: selectedItems,audio: { answer: "", type: "", from: "", offer: "" },video: { answer: "", type: "", from: "", offer: "" }, }
      const roomRef = await roomsCollection.add(data);
      console.log('roomRef', roomRef)
      const userRef = await usersCollection.doc(user.id).update({ groups: firestore.FieldValue.arrayUnion(`/rooms/${roomRef.id}`) })
      navigation.navigate('groupchat', { roomRef: roomRef.id, BackHandel: true })
    }
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
    <View style={styles.container}>
      <Header
        comment="Create Group"
        back={() => navigation.goBack()}
        done={() => onPressDone()}
      />
      <View style={styles.sethead}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            placeholder="Add group name"
            onChange={(event) => setGroupName(event.nativeEvent.text)}
            underlineColorAndroid="transparent"
            value={groupName}
          />
          <SvgXml xml={addimagecicel} style={styles.icon} />
        </View>
        <Text style={styles.input1}>{selectedItems.length}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[
              {
                data: users,
              },
            ]}
            style={styles.gridView}
            renderItem={({ item, section, index }) => (
              <Card
                number={item.key}
                name={item.name}
                select={select}
                setSelect={setSelect}
                image={Images[0].image}
                block={item.key}
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
    </SafeAreaView>
  );
};

export default Creategroupchat;

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
    width: 190,
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
