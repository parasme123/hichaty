import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import Header from '../components/headergroupchat';
import Card from '../components/creategroupchatcard';
import { SvgXml } from 'react-native-svg';
import { bluecircel } from '../assets/tabicons';
import { activegroup, group } from '../assets/tabicons';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import CameraController from '../lib/CameraController';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const roomsCollection = firestore().collection('rooms');

const Images = [
  { image: require('../assets/appicon.png') },
  { image: require('../assets/bg.jpg') },
];

const Updatedgroup = (props) => {
  const { navigation } = props;
  const { roomRef, groupData } = props.route.params;
  const { user, users } = useContext(AppContext);
  const [groupMember, setGroupMember] = useState([])
  const [select, setSelect] = useState({});

  const [groupName, setGroupName] = useState(groupData.name);
  const [groupAvatar, setGroupAvatar] = useState(groupData.avatar);
  const [groupParticipants, setGroupParticipants] = useState(groupData.participants);

  // useEffect(() => {
  //   let oldSelect = {}
  //   for (let index = 0; index < groupData.participants.length; index++) {
  //     oldSelect = { ...oldSelect, [groupData.participants[index]]: true }
  //   }
  //   setSelect(oldSelect);
  //   console.log("roomRef : ", roomRef)
  // }, [groupData])

  useEffect(() => {
    const groupMemberfilter = users.filter(data => groupParticipants.includes(data.id))
    setGroupMember(groupMemberfilter);
  }, [])

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
          setGroupAvatar(url);
        })
      }
    );
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMember = () => {
    props.navigation.navigate("addmember", { groupParticipants, roomRef })
  }

  const updateGroupDetail = async () => {
    await roomsCollection.doc(roomRef).update({
      name: groupName,
      avatar: groupAvatar
    })
    navigation.navigate('Group')
  }

  return (
    <View style={styles.container}>
      <Header
        comment="Group Details"
        back={() => navigation.goBack()}
        addmember={updateGroupDetail}
        add="1"
      />
      <View style={styles.sethead}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            onChangeText={(val) => {
              setGroupName(val);
            }}
            value={groupName}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginLeft: 15 }} onPress={addGroupIcon}>
            {
              groupAvatar ?
                <Image source={{ uri: groupAvatar }} style={{ height: 40, width: 40, borderRadius: 25 }} /> :
                <SvgXml xml={bluecircel} style={styles.icon} />
            }
          </TouchableOpacity>
        </View>
        <View style={styles.users}>
          <SvgXml xml={activegroup} style={styles.userdata} />
          <Text style={styles.text}>{groupParticipants.length}</Text>
        </View>
        <TouchableOpacity onPress={handleAddMember}>
          <SvgXml xml={group} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[
              {
                data: groupMember,
              },
            ]}
            style={styles.gridView}
            renderItem={({ item, section, index }) => (
              <Card
                number={item.key}
                name={item.name}
                select={select}
                setSelect={() => void 0}
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
