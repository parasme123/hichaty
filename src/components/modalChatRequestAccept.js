import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import AppContext from '../context/AppContext';
import { firebase } from '@react-native-firebase/functions';
const usersCollection = firestore().collection('users');
import firestore from '@react-native-firebase/firestore';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const ModalChatRequestAccept = (props) => {
    const { target, visible, notificationcode, setSubmitCode, submitCode, loadingSubmit } = props;
    const { user} = useContext(AppContext)
    
    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}>
            <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
                <View style={styles.modal}>
                    <Text style={styles.modaltext2}>Hello</Text>
                    <Text style={styles.modaltext2}>{user && user.name}</Text>
                    <Text style={styles.modaltext2}>
                        Please enter pin as shared by {target && target.name} for Tem. Chat. Enjoy
                        Messenger services on HiChaty
                    </Text>
                    <Text style={styles.codeText}>{notificationcode}</Text>

                    <OTPInputView
                        style={{ width: '90%', height: 50, marginTop: 10 }}
                        pinCount={4}
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) => {
                            setSubmitCode(code);
                            console.log(`Code is ${code}, you are good to go!`);
                        }}
                    />

                    <TouchableOpacity
                        style={styles.buttondone}
                        onPress={() => submitCode()}>
                        {!loadingSubmit ? <Text style={styles.buttontext}>Submit</Text> : <ActivityIndicator size="small" color="white" />}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
      style={[styles.buttondone, { backgroundColor: 'white' }]}
      onPress={() => setModalVisible2(false)}>
      {!loadingSubmit ? <Text style={[styles.buttontext, { color: 'black' }]}>Cancel</Text> : <ActivityIndicator size="small" color="white" />}
    </TouchableOpacity> */}
                </View>
            </View>
        </Modal>

    );
};

export default ModalChatRequestAccept;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      backgroundColor: '#F8F8F8',
    },
    content: {
      flex: 1,
      width: '100%',
      height: "100%"
    },
    setcard: {
      display: 'flex',
      marginVertical: 1,
    },
    modal: {
      display: 'flex',
      position: 'absolute',
      flex: 1,
      padding: 15,
      paddingVertical: 10,
      backgroundColor: 'white',
      width: '70%',
      alignContent: 'center',
      marginVertical: 200,
      borderRadius: 15,
      paddingTop: 10,
      alignSelf: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    modaltext: {
      textAlign: 'center',
      width: '70%',
      marginBottom: 15,
    },
    modaltext1: {
      textAlign: 'center',
      width: '82%',
      marginBottom: 18,
      fontSize: 16,
      lineHeight: 20,
      // fontWeight: 'bold',
    },
    modaltext2: {
      textAlign: 'center',
      width: '83%',
      // marginBottom: 18,
      fontSize: 15,
      lineHeight: 20,
      // fontWeight: 'bold',
    },
    modalheading: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    sectionStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      height: 45,
      borderRadius: 5,
      marginTop: 3,
      paddingLeft: 5,
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#53A8CB',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderColor: '#53A8CB',
      borderWidth: 2,
      width: '100%',
      marginTop: 15,
      borderRadius: 5,
    },
    button1: {
      alignItems: 'center',
      backgroundColor: 'red',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderColor: 'red',
      borderWidth: 2,
      width: '100%',
      marginTop: 15,
      borderRadius: 5,
    },
    buttondone: {
      alignItems: 'center',
      backgroundColor: '#38D744',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderColor: '#38D744',
      borderWidth: 2,
      width: '100%',
      marginTop: 15,
      borderRadius: 5,
    },
    buttontext: {
      color: 'white',
      fontSize: 16,
    },
    borderStyleBase: {
      width: 40,
      height: 45,
    },
  
    borderStyleHighLighted: {
      borderColor: 'black',
    },
  
    underlineStyleBase: {
      width: 40,
      height: 45,
      borderWidth: 1,
      borderColor: 'black',
    },
  
    underlineStyleHighLighted: {
      borderColor: 'black',
    },
    headerContainer: {
      flexDirection: 'row',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginRight: 11,
    },
    icon1: {
      marginRight: 12,
    },
    searchSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderColor: 'black',
      borderWidth: 0.5,
      borderRadius: 4,
      marginHorizontal: 10,
      paddingHorizontal: 2,
    },
    searchIcon: {
      padding: 10,
    },
    input: {
      flex: 1,
      paddingTop: 5,
      paddingRight: 10,
      paddingBottom: 5,
      paddingLeft: 0,
      backgroundColor: '#fff',
      color: '#424242',
    },
    codeText: {
      textAlign: 'center',
      width: '90%',
      marginVertical: 10,
      fontSize: 15,
      fontWeight: 'bold',
    },
  });
  