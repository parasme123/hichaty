import React, { useContext, useEffect, useState } from 'react';

import { StyleSheet, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function Searchbox() {
    const [search, setSearch] = useState("");

    return (
        <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" />
            <TextInput
                style={styles.input}
                placeholder="Search"
                onChangeText={(search) => { setSearch(search) }}
                underlineColorAndroid="transparent"
            />
        </View>
    );
}

export default Searchbox;

const styles = StyleSheet.create({
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
});
