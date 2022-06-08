import ImageCropPicker from 'react-native-image-crop-picker';
import { Platform, PermissionsAndroid } from "react-native";
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';
import Helper from './Helper';
import DocumentPicker, { types } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
export default class CameraController {
    static async open(cb, iscrop) {
        Helper.cameraAlert("Select image from...", "Camera", "Gallery", "Cancel", (statusCamera) => {
            if (statusCamera) {
                CameraController.checkPremission(PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA, cb, "Camera", iscrop);
            }
        }, (statusGallery) => {
            if (statusGallery) {
                CameraController.checkPremission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.IOS.PHOTO_LIBRARY, cb, "Gallery", iscrop);
            }
        })
    }
    static async attachmentFile(cb, iscrop) {
        Helper.attachmentFileAlert("Select attachment file from...", "Camera", "Gallery", "Cancel", (statusCamera) => {
            if (statusCamera) {
                CameraController.checkPremission(PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA, cb, "Camera", iscrop);
            }
        }, (statusGallery) => {
            if (statusGallery) {
                CameraController.checkPremission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.IOS.PHOTO_LIBRARY, cb, "Gallery", iscrop);
            }
        })
    }
    static checkPremission = async (androidType, iosType, cb, launchType, iscrop) => {
        await check(Platform.select({
            android: androidType,
            ios: iosType
        })).then(result => {
            // console.log(result,"result>>>>>>>>>>");
            if (result === "granted") {
                // console.log('already allow the location');
                this.selecteImage(cb, launchType, iscrop);
                return;
            }
            if (result === "blocked" || result === "unavailable") {
                Helper.permissionConfirm("Access to the camera has been prohibited; please enable it in the Settings app to continue.", ((status) => {
                    // console.log(status, "sssssss")
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
                // console.log(status,"status");
                if (status === "granted") {
                    // console.log('You can use the location');
                    this.selecteImage(cb, launchType, iscrop);
                } else {
                    // console.log('location permission denied');
                    openSettings().catch(() => {
                        console.warn('cannot open settings')
                    });
                }
            });
        });
    }

    static async requestStoragePermission() {

        if (Platform.OS !== "android") return true

        const pm1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        const pm2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

        if (pm1 && pm2) return true

        const userResponse = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);

        if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
            userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            return true
        } else {
            return false
        }
    }

    static async selecteImage(cb, launchType, iscrop) {
        const permissionGranted = this.requestStoragePermission();
        if (!permissionGranted) {
            console.log("not granted");
            return
        }
        if (launchType == 'Camera') {
            if (iscrop) {
                ImageCropPicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: true,
                    mediaType: "any"
                }).then(image => {
                    console.log("file upload response : ", image);
                    cb(image);
                });
            } else {
                ImageCropPicker.openCamera({
                    cropping: true,
                    mediaType: "any"
                }).then(image => {
                    console.log("file upload response : ", image);
                    cb(image);
                });
            }
        } else {
            if (iscrop) {
                try {
                    const response = await DocumentPicker.pickSingle({
                        presentationStyle: 'fullScreen',
                        type: [types.allFiles],
                        allowMultiSelection: false
                    });
                    console.log("response.uri : ", response.uri);
                    if (Platform.OS === "android") {
                        RNFetchBlob.fs.stat(response.uri)
                            .then((stats) => {
                                cb({
                                    ...response,
                                    path: `file://${stats.path}`,
                                    mime: response.type
                                });
                            })
                            .catch((err) => { console.log("stats error", err) })
                    } else {
                        cb({
                            ...response,
                            path: response.uri,
                            mime: response.type
                        });
                    }

                } catch (err) {
                    console.log(err);
                }
                // ImageCropPicker.openPicker({
                //     width: 400,
                //     height: 400,
                //     cropping: true,
                //     mediaType: "any"
                // }).then(image => {
                //     console.log("file upload response : ", image);
                //     cb(image);
                // });
            } else {
                try {
                    const response = await DocumentPicker.pickSingle({
                        presentationStyle: 'fullScreen',
                        type: [types.allFiles],
                    });
                    console.log("response.uri : ", response.uri);
                    if (Platform.OS === "android") {
                        RNFetchBlob.fs.stat(response.uri)
                            .then((stats) => {
                                cb({
                                    ...response,
                                    path: `file://${stats.path}`,
                                    mime: response.type
                                });
                            })
                            .catch((err) => { console.log("stats error", err) })
                    } else {
                        cb({
                            ...response,
                            path: response.uri,
                            mime: response.type
                        });
                    }

                } catch (err) {
                    console.log(err);
                }
                // ImageCropPicker.openPicker({
                //     cropping: true,
                //     mediaType: "any"
                // }).then(image => {
                //     console.log("file upload response : ", image);
                //     cb(image);
                // });
            }
        }
    }
}