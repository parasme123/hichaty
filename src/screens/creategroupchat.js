import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import Header from '../components/headergroupchat';
import Card from '../components/creategroupchatcard';
import { SvgXml } from 'react-native-svg';
import { addimage, addimagecicel } from '../assets/chaticons';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import CameraController from '../lib/CameraController';
import storage from '@react-native-firebase/storage';

const roomsCollection = firestore().collection('rooms');
const usersCollection = firestore().collection('users');

const Images = [
  { image: require('../assets/appicon.png') },
  { image: require('../assets/bg.jpg') },
];


const Creategroupchat = (props) => {

  const { navigation } = props;
  const { user, users } = useContext(AppContext);
  const [select, setSelect] = useState({});
  const [selectedItems, setSelectedItems] = useState([])
  const [groupName, setGroupName] = useState('');
  const [doneProcess, setDoneProcess] = useState(false);
  const [avatar, setAvatar] = useState();
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
    setDoneProcess(true)
    if (selectedItems.length == 0) {
      alert("Please select users.")
      setDoneProcess(false)
      return false
    } if (groupName == '' || groupName.length == 0) {
      alert("Enter your group name.")
      setDoneProcess(false)
      return false

    } if (selectedItems.length > 0) {
      const data = { admin: user.id, avatar, name: groupName, participants: [user.id], audio: { answer: "", type: "", from: "", offer: "" }, video: { answer: "", type: "", from: "", offer: "" }, }
      const roomRef = await roomsCollection.add(data);
      const userRef = await usersCollection.doc(user.id).update({ groups: firestore.FieldValue.arrayUnion(`/rooms/${roomRef.id}`) })
      selectedItems.forEach(async element => {
        await usersCollection.doc(element).update({
          teamChatNotification: firestore.FieldValue.arrayUnion({ type: "groupChat", id: user.id, name: user.name, roomRef: `/rooms/${roomRef.id}` })
        })

        firebase.functions().httpsCallable('onNewGroupInvitation')({
          senderId: user.id,
          senderName: user.name,
          receiverId: element,
          desiredChat: "GroupChat",
        })

      });
      setDoneProcess(false)
      navigation.navigate('groupchat', { roomRef: roomRef.id, BackHandel: true })
    }
  }

  const addGroupIcon = () => {
    CameraController.open((response) => {
      if (response.path) {
        uploadImage(response);
      }
    });
  }

  const uploadImage = async (photo) => {
    let photoUri = photo.path;
    const filename = photoUri.substring(photoUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri;
    const task = storage()
      .ref(`Profile-Images/${filename}`)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed',
      snapshot => {
        // setTransferred(
        //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes)
        // );
      },
      error => {
        setError({ message: 'Something went wrong, please try again ' })
      },
      () => {
        // console.log('ref', task.snapshot.ref.path);
        task.snapshot.ref.getDownloadURL().then(url => {
          setAvatar(url);
        })
      }
    );
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Header
          comment="Create Group"
          back={() => navigation.goBack()}
          done={() => onPressDone()}
          doneProcess={doneProcess}
        />
        <View style={styles.sethead}>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent:"space-between" }}>
            <TextInput
              style={styles.input}
              placeholder="Add group name"
              onChange={(event) => setGroupName(event.nativeEvent.text)}
              underlineColorAndroid="transparent"
              value={groupName}
            />
            {
              console.log("avatar", avatar)
            }
            <TouchableOpacity style={{alignSelf:'flex-end', marginLeft:10}} onPress={addGroupIcon}>
              {
                avatar ? (
                  <Image source={{ uri: avatar }} style={{ height: 50, borderRadius:25, width: 50, flex: 1 }} />
                ) : <SvgXml xml={addimagecicel} style={styles.icon} />
              }

            </TouchableOpacity>
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
                  avatar={item.avatar}
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
