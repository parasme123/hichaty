import React, { Component } from "react";
import { Text,Share, View, StyleSheet, FlatList, Image, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from "react-native";
import Contacts from 'react-native-contacts';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';

export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ContactData: [],
            showcontact: false
        }
    }

    componentDidMount() {
        this.getContactList();
    }
    getContactList = async () => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.',
                'buttonPositive': 'Please accept bare mortal'
            }
        )
            .then(() => Contacts.getAll())
            .then(contacts => {
                this.setState({ showcontact: true })
                this.setState({ ContactData: contacts })
                // console.log(contacts, "contacts>>>>>>");

            })

    }

    getContactListItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { this.gotoShareApp(item) }}
                style={[styles.mainviewlist, { alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }]}>
                <Text style={[styles.heading]} >{item.displayName}</Text>
                <Image style={{ height: 15, width: 15, resizeMode: "contain" }}
                    source={require("../assets/invite.png")} />
            </TouchableOpacity>
        )
    }
    gotoShareApp = async (item) => {
        try {
            const result = await Share.share({
                title: 'Hichaty',
                message: 'We request you to all Hichaty users,share with your friends and family.https://hichaty.com/',
                url: 'https://hichaty.com/'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("result.activityType", result.activityType);
                    // shared with activity type of result.activityType
                } else {
                    console.log("result");

                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log("dismissed>>>>>>>>>>>>.");

            }
        } catch (error) {
            alert(error.message);
        }
    };

    gotoBack = () => {
        this.props.navigation.goBack()
    }
    render() {
        console.log(this.state.ContactData, "this.state.ContactData");
        return (
            <View style={{ flex: 1, backgroundColor: '#F8F8F8', }}>
                <View style={styles.icons}>
                    <TouchableOpacity style={{ padding: 8, }} onPress={() => { this.gotoBack() }}>
                        <SvgXml xml={backblue} />
                    </TouchableOpacity>
                    <Text style={[styles.inputfield, { marginLeft: 5 }]}>Contact</Text>
                </View>
                {this.state.ContactData.length > 0 ?
                    <FlatList
                        data={this.state.ContactData}
                        // extraData={this.state}
                        renderItem={this.getContactListItem}
                    />
                    : !this.state.showcontact ?
                        <View style={{ flex: 1, position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%" }}>
                            <ActivityIndicator size="large" color="blue" />
                        </View>
                        : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icons: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: '#ffffff',
    },
    inputfield: {
        color: "black",
        fontSize: 15,
        flex: 1,
    },
    mainviewlist: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 55,
        marginHorizontal: 16, backgroundColor: '#ffffff',
        paddingHorizontal: 8, elevation: 5, borderRadius: 5
    },
    heading: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
});