import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Platform, PermissionsAndroid ,Alert} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { useState, useEffect, useContext } from 'react';
import androidPermissions from '../lib/androidPermissions';
import { SvgXml } from 'react-native-svg';
import { camera as camera_, microphone } from '../assets/chaticons';
import { logo as logo_, } from '../assets/loginsignupIcons';
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';

const Permissions = ({ navigation }) => {
    const [toggleCheckBox, updateToggleCheckBox] = useState({ "Camera": false, "Audio": false });

    // request permissions for both : Camera and Audio
    const permissionsRequest = async (tool) => {
        console.log(tool, "llllllll");
        try {
            const granted = await PermissionsAndroid.request(tool.permission);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                updateToggleCheckBox({ ...toggleCheckBox, [tool.name]: true })
            }
            else {
                updateToggleCheckBox({ ...toggleCheckBox, [tool.name]: false })
            }
        } catch (error) {
            console.warn('something went wrong')
        }
    }


    // fire it with only the Camera and Audio are granted
    useEffect(() => {
        console.log(toggleCheckBox, "Audio")
        console.log(toggleCheckBox, "Camera")
        if (toggleCheckBox["Camera"] == false) {
            // permissionsRequest(androidPermissions.camera)
            gotoCameraPermission("Camera")
        }
        else if (toggleCheckBox["Audio"] == false) {
            // permissionsRequest(androidPermissions.audio)
            gotoAudioPermission("Audio")

        }
        else if (toggleCheckBox["Camera"] && toggleCheckBox["Audio"]) {
            console.log("hello")
            navigation.dispatch(
                CommonActions.navigate({ name: "uploadphoto" })
            )
        }
    }, [toggleCheckBox])



    const gotoAudioPermission = (tool) => {
        console.log(tool,"tool>>>>>>>>>>>>");
        checkPremissionAudio(PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.IOS.MICROPHONE,tool);

    }

    const checkPremissionAudio = async (androidType, iosType,tool) => {
        await check(Platform.select({
            android: androidType,
            ios: iosType
        })).then(result => {
            if (result === "granted") {
                console.log('already allow the location');
                updateToggleCheckBox({ ...toggleCheckBox, [tool]: true })
                return;
            }
            if (result === "blocked" || result === "unavailable") {
                permissionConfirm1("Access to the camera has been prohibited; please enable it in the Settings app to continue.", ((status) => {
                    console.log(status, "sssssss")
                    if (status) {
                        openSettings().catch(() => {
                            console.warn('cannot open settings')
                        });
                    }
                }));
                return;
            }
            request(
                Platform.select({
                    android: androidType,
                    ios: iosType
                })
            ).then((status) => {
                if (status === "granted") {
                    console.log('You can use the location');
                    updateToggleCheckBox({ ...toggleCheckBox, [tool.name]: true })
                } else {
                    console.log('location permission denied');
                }
            });
        });
    }
    const permissionConfirm1=(alertMessage, cb)=> {
        Alert.alert(
            "Hichaty",
            alertMessage,
            [
                { text: 'Continue', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
                { text: 'SETTINGS', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
            ],
            { cancelable: false }
        )
    }
    
    const gotoCameraPermission = (tool) => {
        console.log(tool,"tool<<<<<<<>>>>>>>>>>>>");
        checkPremissionCamera(PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA,tool);

    }
    const checkPremissionCamera = async (androidType, iosType,tool) => {
        await check(Platform.select({
            android: androidType,
            ios: iosType
        })).then(result => {
            if (result === "granted") {
                console.log('already allow the location');
                updateToggleCheckBox({ ...toggleCheckBox, [tool]: true })
                return;
            }
            if (result === "blocked" || result === "unavailable") {
                permissionConfirm("Access to the camera has been prohibited; please enable it in the Settings app to continue.", ((status) => {
                    console.log(status, "sssssss")
                    if (status) {
                        openSettings().catch(() => {
                            console.warn('cannot open settings')
                        });
                    }
                }));
                return;
            }
            request(
                Platform.select({
                    android: androidType,
                    ios: iosType
                })
            ).then((status) => {
                if (status === "granted") {
                    console.log('You can use the location');
                    updateToggleCheckBox({ ...toggleCheckBox, [tool.name]: true })
                } else {
                    console.log('location permission denied');
                }
            });
        });
    }
    const permissionConfirm=(alertMessage, cb)=> {
        Alert.alert(
            "Hichaty",
            alertMessage,
            [
                { text: 'Continue', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
                { text: 'SETTINGS', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
            ],
            { cancelable: false }
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.intro}>
                <SvgXml xml={logo_} width='35%' style={styles.logo} />
                <Text style={styles.textBold}>Almost done!</Text>
                <Text style={styles.text}>Enable Camera and Microphone access to get the party started </Text>
            </View>

            <View style={styles.permissionContainer} key="1">
                <View style={styles.permissionDescription}>
                    <SvgXml xml={camera_} style={styles.icon} />
                    <Text style={styles.text}> Camera</Text>
                </View>
                <CheckBox
                    tintColors={"white"}
                    style={styles.checkbox}
                    disabled={false}
                    value={toggleCheckBox["Camera"]}
                    // onValueChange={(newValue) => permissionsRequest(androidPermissions.camera)}
                    onValueChange={(newValue) =>gotoCameraPermission("Camera")}
                    />
            </View>

            <View />

            <View style={styles.permissionContainer} key="2">
                <View style={styles.permissionDescription}>
                    <SvgXml xml={microphone} style={styles.icon} />
                    <Text style={styles.text}> Microphone </Text>
                </View>
                <CheckBox
                    tintColors={"white"}
                    disabled={false}
                    style={styles.checkbox}
                    value={toggleCheckBox["Audio"]}
                    // onValueChange={(newValue) => permissionsRequest(androidPermissions.audio)}
                    onValueChange={(newValue) => gotoAudioPermission("Audio")}

                    
                    />
            </View>
            <View style={styles.view}></View>
        </SafeAreaView>
    )
}

export default Permissions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        margin: 20,
    },
    descritpion: {
        flex: 1,
        justifyContent: "center",
    },
    intro: {
        flex: 8,
        width: '90%',
        justifyContent: "center",
        height: 40
    },
    logo: {
        flex: 1,
        alignSelf: "center",
        marginRight: 20,
        marginTop: 20,
        width: '20%'
    },
    textBold: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: "bold",
    },
    text: {
        fontSize: 15,
    },
    permissionContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
    },
    permissionDescription: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
    },
    icon: {
        flex: 1,
        alignSelf: "center",
        marginRight: 20
    },

    permissionImg: {
        height: 8,
        width: 8,
        marginRight: 2
    },
    view: {
        flex: 6,
    }
})