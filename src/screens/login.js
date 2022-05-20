import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, StatusBar, TouchableOpacity, TextInput, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { SvgXml } from 'react-native-svg';
import {
  pasword,
  personal,
  corporate,
  mobile as mobile_,
  newlogo
} from '../assets/loginsignupIcons';
import auth from '@react-native-firebase/auth';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
const usersCollection = firestore().collection('users')
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const login = (props) => {

  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const [code, setCode] = useState(null);
  const [password_2, setPassword_2] = useState(null)
  const [secondes, setSecondes] = useState(30)
  const [minutes, setMinutes] = useState(1)
  const [error, setError] = useState(null)
  const { user, setUser, permissions } = useContext(AppContext)
  // const [ mobile, setMobile ] = useState('+919429000062');
  // const [ password, setPassword] = useState('Mokshasd@2528');
  // const [ mobile, setMobile ] = useState('+919782186615');
  // const [ password, setPassword] = useState('Vicky@123456');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [savedUser, setSavedUser] = useState(null);

  useEffect(() => {
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

  const onAuthStateChanged = async (user) => {
    if (user) {
      setModalVisible(false);
      setUser(savedUser);
      console.log('----onAuthStateChanged:' + savedUser);
      navigation.navigate(permissions ? 'bottom' : 'permissions');
    }
  }

  const checkUserisNew = async () => {
    let data = [];
    const querySnapshot = await usersCollection.where("mobile", "==", mobile).limit(1).get();
    if (!querySnapshot.empty) {
      querySnapshot.forEach(documentSnapshot => {
        setSavedUser({ id: documentSnapshot.id, ...documentSnapshot.data() })
        // setUser({ id: documentSnapshot.id, ...documentSnapshot.data() });

        data = { id: documentSnapshot.id, ...documentSnapshot.data() }
        console.log("doc:" + JSON.stringify({ id: documentSnapshot.id, ...documentSnapshot.data() }))
      })
    }
    return { isNew: querySnapshot.empty, data }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  const signInWithPhoneNumber = async () => {
    if (mobile == '' || mobile == null) {
      alert("Enter country code and mobile number.")
      return false;
    } else if (password == '' || password == null) {
      alert("Enter password.")
      return false;
    } else {
      setLoading(true);
      const result = await checkUserisNew();
      console.log('-----isNew', result.isNew)
      if (result.isNew === false) {
        console.log(result.data, result.data.password === password, mobile)
        if (result.data && result.data.password === password) {
          auth().signInWithPhoneNumber(mobile)
            .then(confirmation => {
              console.log('-----res>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ' + JSON.stringify(confirmation))
              setLoading(false);
              setConfirmResult(confirmation)
            })
            .catch(error => {
              setLoading(false),
                alert(`Sign In With Phone Number Error: ${error.message}`)
              console.log(error.message, "error.message>>>>>>>>>>>");
              // setError({ message: `Sign In With Phone Number Error: ${error.message}`})
            });
        }
        else {
          setLoading(false);
          alert('Wrong password !')
          // setError({ message: 'Wrong password !' })

        }
      }
      else {
        setLoading(false);
        alert('No account is associated with that phone number, please register !')
        // setError({ message: 'No account is associated with that phone number, please register !' })

      }
    }


  }

  useEffect(() => {
    if (!user && !!confirmResult) {
      setLoading(false);
      setModalVisible(true);
    }
  }, [user, confirmResult])

  // const confirmCode = async () => {
  //   try {
  //     await confirmResult.confirm(code);
  //     setModalVisible(false);
  //     console.log('----userSaved:' + savedUser);
  //     setUser(savedUser)
  //     navigation.navigate(permissions ? 'bottom' : 'permissions');
  //   } catch (error) {
  //     // setError({ message: `Invalid code: ${error.message}` })
  //     alert(`Invalid code: ${error.message}`)
  //   }
  // };



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
    await confirmResult.confirm(code);
    setModalVisible(false);
    console.log('----user: ' + savedUser)
    setUser(savedUser)
    navigation.navigate(permissions ? 'bottom' : 'permissions');
    setModalVisible(false);

  }

  const cancelCode = async () => {
    setLoading(false);
    setModalVisible(false);

  };
  // const OtpModal = () => {
  //   return (

  //   )
  // }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* {modalVisible == true && OtpModal()} */}
        <StatusBar barStyle="dark-content" backgroundColor="#54A8CC" />
        <KeyboardAwareScrollView
          enableOnAndroid={false} bounces={false} showsVerticalScrollIndicator={false}>

          <View style={styles.content}>
            <View style={styles.logo}>
              <SvgXml xml={newlogo} style={styles.setlogo} width={200} height={200} />
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button}>
                <SvgXml xml={personal} />
                <Text style={styles.buttontext}> Personal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttondisable}>
                <SvgXml xml={corporate} />
                <Text style={styles.buttondisabletext}> Corporate</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <View style={styles.sectionStyle}>
                <SvgXml xml={mobile_} />
                <TextInput
                  onChange={(event) => setMobile(event.nativeEvent.text)}
                  style={styles.inputfield}
                  placeholder="+1650551234"
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.sectionStyle}>
                <SvgXml xml={pasword} />
                <TextInput
                  onChange={(event) => setPassword(event.nativeEvent.text)}
                  style={styles.inputfield}
                  secureTextEntry={true}
                  placeholder="Password"
                  returnKeyType={'done'}
                  underlineColorAndroid="transparent"

                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonlogin}
              onPress={() => signInWithPhoneNumber()}
            >
              <Text style={styles.buttontext}>Login</Text>
            </TouchableOpacity>

            {/* <View style={styles.checkboxContainer}>
          <CheckBox style={styles.checkbox} />
          <Text style={styles.label}>Remember Password</Text>
        </View> */}
          </View>
          <View style={styles.links}>
            <View style={styles.linksbottom}>
              <Text style={styles.forgot}>Forgot Password?</Text>
              <Text style={styles.forgot}>|</Text>
              <TouchableOpacity onPress={() => navigation.navigate('register')}>
                <Text style={[styles.forgot, { color: '#53A8CB' }]}>Signup Here!</Text>
              </TouchableOpacity>
            </View>
          </View>

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
        </KeyboardAwareScrollView>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}>
          <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
            <View style={styles.modal1}>
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

export default login;

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
  setlogo: {
    width: 240,
    height: 100,
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
    paddingLeft: 10,
    color: 'grey',
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 45,
    borderRadius: 5,
    marginTop: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  buttonlogin: {
    alignItems: 'center',
    backgroundColor: '#53A8CB',
    paddingVertical: 11,
    paddingHorizontal: 25,
    borderColor: '#53A8CB',
    borderWidth: 2,
    width: '100%',
    marginTop: 25,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
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

  modal1: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '80%',
    alignContent: 'center',
    marginVertical: 160,
    borderRadius: 10,
    paddingTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },

  buttontext: {
    color: 'white',
    fontSize: 16,
  },
  buttondone: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    marginTop: 25,
    borderRadius: 5,

    // alignItems: 'center',
    // backgroundColor: '#38D744',
    // paddingVertical: 12,
    // paddingHorizontal: 25,
    // borderColor: '#38D744',
    // borderWidth: 2,
    // width: '100%',
    // marginTop: 15,
    // borderRadius: 5,
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
  modaltext1: {
    textAlign: 'center',
    width: '83%',
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 4,
    // fontWeight: 'bold',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 1,
    borderColor: 'black',

  },

  underlineStyleHighLighted: {
    borderColor: 'green',

  },
});
