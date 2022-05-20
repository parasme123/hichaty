import ImageCropPicker from 'react-native-image-crop-picker';
import { Platform } from "react-native";
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';
import Helper from './Helper';

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

    static selecteImage(cb, launchType, iscrop) {
        if (launchType == 'Camera') {
            if (iscrop) {
                ImageCropPicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: true,
                }).then(image => {
                    cb(image);
                });
            } else {
                ImageCropPicker.openCamera({
                    cropping: true,
                }).then(image => {
                    cb(image);
                });
            }
        } else {
            if (iscrop) {
                ImageCropPicker.openPicker({
                    width: 400,
                    height: 400,
                    cropping: true,
                }).then(image => {
                    cb(image);
                });
            } else {
                ImageCropPicker.openPicker({
                    cropping: true,
                }).then(image => {
                    cb(image);
                });
            }
        }
    }
}