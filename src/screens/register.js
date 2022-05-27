import React, { useState, useContext, useEffect, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../context/AppContext';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Image, View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  pasword as password_,
  personal as personal_,
  corporate as corporate_,
  mobile as mobile_,
  user as user_,
  gender as gender_,
  hands as hands_,
  fb as fb_,
  whatsapp as whatsapp_,
  linkedin as linkedin_,
  insta as insta_,
  contact as contact_,
  newlogo,
} from '../assets/loginsignupIcons';
import messaging from '@react-native-firebase/messaging';
const { width, height } = Dimensions.get('window');
const usersCollection = firestore().collection('users');
const register = (props) => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const changemodel1 = () => {
    setModalVisible(false);
    setModalVisible1(true);
  };
  const changemodel2 = () => {
    setModalVisible1(false);
    setModalVisible2(true);
  };
  const setlogin = () => {
    setModalVisible2(false);
    navigation.navigate('login');
  };
  const [confirmResult, setConfirmResult] = useState(null);
  const [code, setCode] = useState(null);
  const [password_2, setPassword_2] = useState(null)
  const [secondes, setSecondes] = useState(30)
  const [minutes, setMinutes] = useState(1)
  const [error, setError] = useState(null)
  const { user, setUser, permissions } = useContext(AppContext)
  const [isNew, setIsNew] = useState(false)
  const [fcmToken, setFcmToken] = useState("")
  const [userData, setUserData] = useState({
    name: null,
    gender: 'gender',
    mobile: null,
    password: null
  })


  useEffect(() => {
    checkToken();

    const Countdown = () => {
      // console.log(secondes, minutes)
      if (secondes > 0) {
        setSecondes(secondes - 1)
      }
      else if (minutes === 1 && secondes === 0) {
        setSecondes(59)
        setMinutes(0)
      }
      else if (minutes === 0 && secondes === 0) {
        clearTimeout(Countdown, 1000)
      }
    }
    if (!user && confirmResult) {
      setTimeout(Countdown, 1000)
    }
  }, [secondes, minutes, user, confirmResult])

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setFcmToken(fcmToken)
      // console.log('-------fcmToken: ' + fcmToken);
    }
  }

  const onAuthStateChanged = async (user) => {
    if (user) {
      setUser(user);
      changemodel1();
      navigation.navigate(permissions ? 'bottom' : 'permissions');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  const checkUserisNew = async () => {
    const querySnapshot = await usersCollection.where("mobile", "==", userData.mobile).limit(1).get();
    return querySnapshot.empty;
  }

  const resendOTP = () => {
    setSecondes(30);
    setMinutes(1);
    auth().signInWithPhoneNumber(userData.mobile)
      .then(confirmation => {
        console.log('-----res>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ' + JSON.stringify(confirmation))
      })
      .catch(error => {
        alert(`Sign In With Phone Number Error: ${error.message}`)
        console.log(error.message, "error.message>>>>>>>>>>>");
        // setError({ message: `Sign In With Phone Number Error: ${error.message}`})
      });
  }

  const signInWithPhoneNumber = async () => {
    if (userData.name == '' || userData.name == null) {
      alert("Enter full name.")
      return false;
    } else if (userData.mobile == '' || userData.mobile == null) {
      alert("Enter country code and mobile number.")
      return false;
    } else if (userData.gender == "gender" || userData.gender == null) {
      alert("Select your gender.")
      return false;
    } else if (userData.password == '' || userData.password == null) {
      alert("Enter password.")
      return false;
    }

    else {
      setLoading(true);
      let isNew = await checkUserisNew();
      if (isNew === true) {
        auth().signInWithPhoneNumber(userData.mobile)
          .then(async (confirmation) => {
            setLoading(false);
            console.log("register confirmation : ", confirmation)
            setConfirmResult(confirmation)
            await usersCollection.add({
              email: "abc@gmail.com",
              name: userData.name,
              gender: userData.gender,
              mobile: userData.mobile,
              password: userData.password,
              PictureView: "everybody",
              profilView: true,
              privateChat: true,
              picture: "",
              status: "Welcome to HiChaty",
              friends: [],
              blockedUsers: [],
              teamChatContact: [],
              teamChatNotification: [],
              history: [],
              audio: {
                type: "",
                from: "",
                candidate: ""
              },
              video: {
                type: "",
                from: "",
                candidate: ""
              },
              VideoRoom: {
                type: "",
                from: "",
                candidate: ""
              },
              acceptedRequest: [],
              avatar: '',
              blockedGroups: [],
              confirmationCode: [],
              groups: [],
              notification: [],
              onlineStatus: 'everybody',
              tokens: [fcmToken],
              fcbToken: fcmToken
            })
          })
          .catch(error => {
            setLoading(false),
              alert(`Sign In With Phone Number Error: ${error.message}`)
            // setError({ message: `Sign In With Phone Number Error: ${error.message}` })
          });
      }
      else {
        setLoading(false)
        alert('User already exist ...')
        // setError({ message: 'User already exist ...' })
      }

    }
  }

  useEffect(() => {
    if (!user && confirmResult) {
      setLoading(false);
      setModalVisible(true);
    }
  }, [user, confirmResult])

  const confirmCode = async () => {
    try {
      submitOtp();
    } catch (error) {
      // setError({ message: `Invalid code: ${error.message}` })
      setLoading(false);
      alert(`Invalid code: ${error.message}`)

    }
  };

  const submitOtp = async () => {
    const querySnapshot = await usersCollection.where("mobile", "==", userData.mobile).limit(1).get();
    if (!querySnapshot.empty) {
      querySnapshot.forEach(documentSnapshot => {
        setUser({ id: documentSnapshot.id, ...documentSnapshot.data() });
      })
    }
    setModalVisible(false);
    navigation.navigate(user && permissions ? 'bottom' : 'permissions');
  }

  const cancelCode = () => {
    setLoading(false);
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          enableOnAndroid={false} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.logo}>
              <SvgXml xml={newlogo} style={styles.logoset} height={200} width={200} />
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button}>
                <SvgXml xml={personal_} />
                <Text style={styles.buttontext}> Personal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttondisable}>
                <SvgXml xml={corporate_} />
                <Text style={styles.buttondisabletext}> Corporate</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <View style={styles.sectionStyle}>
                <SvgXml xml={user_} />
                <TextInput
                  style={styles.inputfield}
                  onChange={(event) => setUserData({ ...userData, name: event.nativeEvent.text })}
                  placeholder="Full Name"
                  keyboardType={'default'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.sectionStyle}>
                <SvgXml xml={mobile_} />
                <TextInput
                  style={styles.inputfield}
                  onChange={(event) => setUserData({ ...userData, mobile: event.nativeEvent.text })}
                  placeholder="+1650551234"
                  keyboardType={'default'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.sectionStyle}>
                <SvgXml xml={gender_} />
                <RNPickerSelect
                  placeholder={{ label: "Gender", value: null }}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(itemValue, itemIndex) =>
                    setUserData({ ...userData, gender: itemValue })
                  }
                  value={userData.gender}
                  style={pickerSelectStyles}
                  items={[
                    // { label: 'Gender', value: 'gender' },
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },

                  ]}
                />
                {/* <TextInput
              placeholder="Gender"
              underlineColorAndroid="transparent"
            /> */}
                {/* <Picker
              // ref={pickerRef}
              placeholder="gender"
              itemStyle={{ flex: 1,backgroundColor:'#FFF'   }}
              selectedValue={userData.gender}
              style={styles.inputfield1}
              // style={{height: 50, width: 130, border: 'none'}}
              onValueChange={(itemValue, itemIndex) =>
                setUserData({ ...userData, gender: itemValue })
              }
            >
              <Picker.Item label="Gender" value="gender" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker> */}
              </View>
              <View style={styles.sectionStyle}>
                <SvgXml xml={password_} />
                <TextInput
                  style={styles.inputfield}
                  onChange={(event) => setUserData({ ...userData, password: event.nativeEvent.text })}
                  placeholder="Password"
                  secureTextEntry={true}
                  keyboardType={'default'}
                  returnKeyType={'done'}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonregister}
              onPress={() => { signInWithPhoneNumber() }}>
              <Text style={styles.buttontext}>Register</Text>
              {!!error && error.message &&
                <Text>{!!error && error.message}</Text>
              }
            </TouchableOpacity>

            {/* <Modal
              animationType={'slide'}
              transparent={true}
              visible={loading}>
              <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
                <View style={styles.modal}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
              </View>
            </Modal> */}
            {/* <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible1}>
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
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
          <View style={{flex: 1, backgroundColor: '#000000aa'}}>
            <View style={styles.modal2}>
              <SvgXml xml={hands_} />
              <Text style={styles.modaltext}>
                We request you to all HiChaty users,share with your friends and
                family
              </Text>
              <View style={styles.icons}>
                <SvgXml xml={fb_} width={30} />
                <SvgXml xml={whatsapp_} width={30} />
                <SvgXml xml={linkedin_} width={30} />
                <SvgXml xml={insta_} width={30} />
                <SvgXml xml={contact_} width={30} />
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
                onPress={() => setModalVisible2(false)}>
                Cancel
              </Text>
            </View>
          </View>
        </Modal> */}

            <View style={styles.links}>
              <View style={styles.linksbottom}>
                <Text style={styles.forgot}>Already have an Account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                  <Text style={styles.logintext}>Login!</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}>
          <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
            <View style={[styles.modal1, { width: '80%' }]}>
              {/* <SvgXml xml={success} /> */}
              <Text style={styles.modaltext1}> Phone verification </Text>
              <Text style={styles.modaltext1}>
                Please enter the code you received in your phone!
              </Text>
              <Text style={styles.modaltext1}>
                {minutes}:{secondes}
              </Text>
              <OTPInputView
                style={{ width: "100%", height: 50 }}
                pinCount={6}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  setCode(code);
                  console.log(`Code is ${code}`);
                }}
              />
              {
                minutes === 0 && secondes === 0 ? (
                  <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <Text>Not Received ? </Text>
                    <TouchableOpacity onPress={() => resendOTP()}>
                      <Text style={{ color: '#53A8CB' }}> Resend</Text>
                    </TouchableOpacity>
                  </View>
                ) : null
              }

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={[styles.buttondone, {
                    marginRight: 5, backgroundColor: '#FB5051', borderColor: '#FB5051',

                  }]}
                  onPress={() => cancelCode()}>
                  <Text style={styles.buttontext}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttondone, {
                    marginLeft: 5, backgroundColor: '#53A8CB', borderColor: '#53A8CB',
                  }]}
                  onPress={() => confirmCode()}>
                  <Text style={styles.buttontext}>Submit</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {loading ?
        <View style={{ flex: 1, backgroundColor: '#000000aa', alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%", position: 'absolute', zIndex: 1 }}>
          <Image style={{ width: 50, height: 50, resizeMode: "contain" }}
            source={require("../assets/loadingbar.gif")} />
        </View>
        : null}


    </View>
  );
};

export default register;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: width / 1.17,
    height: 50,
    paddingLeft: 10,
    borderColor: 'black',
  },
  inputAndroid: {
    width: width / 1.17,
    height: 50,
    paddingLeft: 10,
    borderColor: 'red',
    color: '#000',
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    alignContent: 'center',
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20
  },
  logo: {
    display: 'flex',
    left: '17%',
    marginVertical: 25,
    width: '100%',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#53A8CB',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderColor: '#53A8CB',
    borderWidth: 2,
    flexDirection: 'row',
    width: '50%',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  },
  buttondisable: {
    width: '50%',
    alignItems: 'center',
    borderRightWidth: 1.2,
    borderRightColor: '#47525D',
    borderTopWidth: 1.2,
    flexDirection: 'row',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopColor: '#47525D',
    borderBottomWidth: 1.2,
    borderBottomColor: '#47525D',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  buttondisabletext: {
    color: '#47525D',
    fontSize: 15,
  },
  input: {
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  inputfield: {
    fontSize: 15,
    flex: 1,
    color: 'grey',
    paddingLeft: 10,

  },
  inputfield1: {
    fontSize: 15,
    color: 'grey',
    paddingLeft: 10,
    flex: 1,
    alignSelf: 'flex-start'
  },

  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 45,
    borderRadius: 5,
    marginTop: 9,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  buttonregister: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderColor: '#FB5051',
    justifyContent: 'center',
    width: '100%',
    marginTop: 25,
    borderRadius: 5,
  },
  links: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 80, alignItems: 'center', justifyContent: 'center'
  },
  forgot: {
    fontSize: 14,
    marginHorizontal: 2,
  },
  linksbottom: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  logintext: {
    fontSize: 15,
    marginHorizontal: 2,
    color: '#53A8CB',
  },
  modal: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 25,
    paddingVertical: 20,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 220,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  otp: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttondone: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
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
  modaltext1: {
    textAlign: 'center',
    width: '83%',
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 4,
    // fontWeight: 'bold',
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
  icons: {
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
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 1,
    borderColor: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: 'black',
  },
});
