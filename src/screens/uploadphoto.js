import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, PermissionsAndroid, ScrollView, DeviceEventEmitter, SafeAreaView, Platform } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {
  hands as hands_,
  fb as fb_,
  whatsapp as whatsapp_,
  linkedin as linkedin_,
  insta as insta_,
  contact as contact_,
  user as user_
} from '../assets/loginsignupIcons';
import androidPermissions from '../lib/androidPermissions';
import { add, camera, gallery } from '../assets/chaticons';
import { Avatar } from 'react-native-elements';
import Svg, { SvgXml } from 'react-native-svg';
import { whiteuser, whitemobile, successwhite } from '../assets/loginsignupIcons';
import { settings, backwhite } from '../assets/changethemeicons';
import AppContext from '../context/AppContext';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Share from 'react-native-share';
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';
import CameraController from '../lib/CameraController';

const usersCollection = firestore().collection('users');



const Uploadphoto = (props) => {

  const { navigation } = props;
  const { user, uri } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [colour, setColour] = useState(['#3C95CA', '#54A6E2', '#70B9FD']);
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [status, setStatus] = useState();
  const [picture, setPicture] = useState();
  const [avatar, setavatar] = useState();
  const [photo, setPhoto] = useState(null);
  const [transferred, setTransferred] = useState(0);
  const [error, setError] = useState(null);

  const changemodel0 = () => {
    setModalVisible(false);
    setModalVisible0(true);
  }

  const changemodel2 = () => {
    setModalVisible1(false);
    setModalVisible2(true)
  }

  useEffect(() => {
    if (user) {
      const { name, mobile, status, picture } = user
      setName(name);
      setMobile(mobile);
      setStatus(status);
      setPicture(picture);
      setavatar(picture)
    }
  }, [user])
  const CameraControllerClass = async () => {
    CameraController.open((response) => {
      console.log(response.path, "response");
      if (response.path) {
        setPhoto(response)
        setPicture(response.path), setavatar(response.path)
      }
    });

  }
  const launchCam = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(androidPermissions.camera.permission);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     const options = { noData: true, maxWidth: 500, maxHeight: 500, quality: 0.5 };
    //     launchCamera(options, response => {
    //       if (response.uri) {
    //         setPhoto(response)
    //       }
    //     })
    //   }
    //   else {
    //     setError({ message: ' something went wrong, please try again ' })
    //   }
    // } catch (error) {
    //   console.log('error', error)
    //   setError({ message: ' something went wrong, please try again ' })
    // }

  }

  const launchImgLibrary = async () => {
    // try {
    //   const granted = await PermissionsAndroid.request(androidPermissions.gallery.permission);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     const options = { noData: true, maxWidth: 500, maxHeight: 500, quality: 0.5 };
    //     launchImageLibrary(options, response => {
    //       if (response.uri) {
    //         setPhoto(response)
    //         console.log(response)
    //       }
    //     })
    //   }
    //   else {
    //     setError({ message: ' something went wrong, please try again ' })
    //   }
    // } catch (error) {
    //   setError({ message: ' something went wrong, please try again ' })
    // }

  }

  const uploadImage = async (photo) => {
    setTransferred(0);
    changemodel0();
    let photoUri = photo.path;
    const filename = photoUri.substring(photoUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri;
    // console.log('uploadUri', uploadUri)
    const task = storage()
      .ref(`Profile-Images/${filename}`)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed',
      snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes)
        );
      },
      error => {
        setError({ message: 'Something went wrong, please try again ' })
      },
      () => {
        console.log('ref', task.snapshot.ref.path);
        task.snapshot.ref.getDownloadURL().then(url => {
          setPicture(url);
          setavatar(url);
        })
      }
    );
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    // setPicture(`Profile-Images/${filename}`);
    // setavatar(`Profile-Images/${filename}`);
    setPhoto(null);
    setModalVisible0(false)
  };

  useEffect(() => {

    if (photo && photo != null) {
      (async () => await uploadImage(photo))();
    }
    if (error) {
      changemodel0();
    }
  }, [photo, error])

  const onClickDone = () => {
    if (picture) {
      usersCollection.doc(user.id).update({ name, avatar, picture, status })
      setModalVisible1(true);
    } else {
      setError({ message: 'Please add an image' })
      setModalVisible0(true)
    }
  }


  const onShare = async (type) => {
    const shareOptions = {
      title: "Hichaty",
      message: "We request you to all Hichaty users,share with your friends and family",
      url: "https://hichaty.com/",
      subject: "Hichaty App",
      social: type == 'FACEBOOK' ? Share.Social.FACEBOOK : type == 'WHATSAPP' ? Share.Social.WHATSAPP : type == 'LINKEDIN' ? Share.Social.LINKEDIN : type == 'INSTAGRAM' ? Share.Social.INSTAGRAM : Share.Social.SMS,
    };

    try {
      Share.shareSingle(shareOptions).then((res) => {
        console.log(JSON.stringify(res), "res>>>>>>>>>>>>>>>>");
      }).catch((err) => {
        console.log(JSON.stringify(err), "err>>>>>>>>>>>>>>>>");

      });
    } catch (error) {
      console.log(JSON.stringify(error), "rerror>>>>>>>>>>>>>>>>");
    }
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colour[1] }]}>
      <ScrollView style={styles.container1}>
        <LinearGradient colors={colour} style={styles.avatar}>
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {picture ?
              <Avatar
                rounded
                containerStyle={styles.avatar1}
                source={{ uri: picture }}
                size={120}
              />
              :
              <View style={{ width: 130, height: 130, borderRadius: 130 / 2, marginTop: 20, backgroundColor: '#fff' }}>
                <SvgXml xml={user_} width={130} height={130} style={{ borderRadius: 130 / 2, }} />
              </View>

            }
            <TouchableOpacity style={{ height: 40, width: 40, borderRadius: 40 / 2, position: 'absolute', bottom: 0, right: 0, zIndex: 1, backgroundColor: colour[0], }}
              onPress={() => CameraControllerClass()}>
              <SvgXml xml={add} width={40} height={40} style={{ borderRadius: 40 / 2 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.input}>
            <View style={{ ...styles.sectionStyle, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <TextInput
                style={styles.inputfield}
                placeholder="Mobile Number"
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={mobile}
                editable={false}
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
                onChange={e => setName(e.nativeEvent.text)}
              />
              <SvgXml xml={whiteuser} />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                style={styles.inputfield}
                placeholder="Update your Status"
                placeholderTextColor="white"
                value={status}
                onChange={e => setStatus(e.nativeEvent.text)}
                underlineColorAndroid="transparent"
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
        <View style={{ width: '80%', alignSelf: 'center', backgroundColor: colour[1], marginTop: '10%', borderRadius: 10, }}>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 40 }} onPress={() => onClickDone()}>
            <Text style={{ color: 'white', fontSize: 15 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal1}>
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 20 }} onPress={() => launchCam()}>
                <SvgXml width={"20%"} xml={camera} />
                <Text style={{ ...styles.modaltext2, width: '70%', alignSelf: 'center' }}>Take photo</Text>
              </TouchableOpacity>
              <View style={{ borderBottomWidth: 1, borderBottomColor: colour[0], width: '100%', marginBottom: 20 }} />
              <TouchableOpacity style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }} onPress={() => launchImgLibrary()}>
                <SvgXml width={"20%"} xml={gallery} />
                <Text style={styles.modaltext2}>{"Upload from library ..."}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible0}
        >
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={{ ...styles.modal1, width: '90%' }}>
              {!error ?
                <ProgressBar
                  styleAttr="Horizontal"
                  progress={transferred}
                  width={300}
                />

                :
                <View>
                  <Text>{error && error.message}</Text>
                  <Text
                    style={styles.cancel}
                    onPress={() => {
                      setModalVisible0(false);
                    }
                    }>Cancel</Text>
                </View>
              }
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible1}>
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal1}>
              <SvgXml xml={hands_} />
              <Text style={styles.modaltext}>
                We request you to all HiChaty users,share with your friends and
                family and make successfull of HiChaty
              </Text>
              <Text style={styles.modaltext2}>Welcome to HiChaty family</Text>

              <TouchableOpacity
                style={styles.buttondone}
                onPress={() => changemodel2()}>
                <Text style={styles.buttontext}>Share</Text>
              </TouchableOpacity>
              <Text
                style={styles.cancel}
                onPress={() => {
                  setModalVisible1(false);
                  navigation.navigate('bottom');

                }
                }>
                Cancel
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible2}>
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal2}>
              <SvgXml xml={hands_} />
              <Text style={styles.modaltext}>
                We request you to all HiChaty users,share with your friends and
                family
              </Text>
              <View style={styles.icons1}>
                <TouchableOpacity onPress={() => { onShare("FACEBOOK") }} >
                  <SvgXml xml={fb_} width={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onShare("WHATSAPP") }} >
                  <SvgXml xml={whatsapp_} width={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { onShare("LINKEDIN") }} >
                  <SvgXml xml={linkedin_} width={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { onShare("INSTAGRAM") }} >
                  <SvgXml xml={insta_} width={30} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { onShare("SMS") }} >
                  <SvgXml xml={contact_} width={30} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modaltext2}>Welcome to HiChaty family</Text>

              <TouchableOpacity
                style={styles.buttonfinaldone}
                onPress={() => {
                  setModalVisible2(false);
                  navigation.navigate('bottom');

                }
                }>
                <Text style={styles.buttontext}>Done</Text>
              </TouchableOpacity>
              <Text
                style={styles.cancel}
                onPress={() => {
                  setModalVisible2(false);
                  navigation.navigate('bottom');

                }
                }>
                Cancel
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>



  );
};

export default Uploadphoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',

  },
  container1: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  avatar: {
    backgroundColor: '#2F91C9',
    alignItems: 'center',
  },
  avatar1: {
    marginTop: '5%',
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
    marginTop: 5,
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
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
    top: 15,
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
  buttontext: {
    color: 'white',
    fontSize: 15,
  },
  buttondone: {
    alignItems: 'center',
    backgroundColor: '#53A8CB',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderColor: '#53A8CB',
    borderWidth: 2,
    width: '100%',
    marginTop: 25,
    borderRadius: 5,
  },
  modal1: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 25,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 140,
    borderRadius: 15,
    paddingTop: 25,
    alignSelf: 'center',
    alignItems: 'center',
  },
  modaltext: {
    fontSize: 18,
    marginVertical: 7,
    paddingHorizontal: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  modaltext2: {
    fontSize: 16,
    marginVertical: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  cancel: {
    fontSize: 16,
    marginVertical: 12,
    color: 'red',
    textAlign: 'center',
  },
  modal2: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 25,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 140,
    borderRadius: 15,
    paddingTop: 25,
    alignSelf: 'center',
    alignItems: 'center',
  },
  icons1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '103%',
    marginVertical: 14,
  },
  buttonfinaldone: {
    // alignContent:'center',
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '100%',
    marginTop: 25,
    borderRadius: 5,
  },
});