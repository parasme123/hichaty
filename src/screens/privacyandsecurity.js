import React, { useContext, useState } from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, Text, Dimensions, Picker, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import Header from '../components/header';
import AppContext from '../context/AppContext';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
import RNPickerSelect from 'react-native-picker-select';
const { width, height } = Dimensions.get('window');

const Privacy = (props) => {
  const [selectedValue1, setSelectedValue1] = useState('everyone');
  const [selectedValue2, setSelectedValue2] = useState('everyone');
  const [selectedValue3, setSelectedValue3] = useState('everyone');
  const [selectedValuechat, setSelectedValuechat] = useState('yes');
  const [selectedValuechat1, setSelectedValuechat1] = useState('yes');

  const { navigation } = props;
  const { blockedUsers } = useContext(AppContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container style={styles.container}>
        <View style={styles.icons}>
          <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
            <SvgXml
              xml={backblue}
            />
          </TouchableOpacity>

          <Text style={[styles.inputfield, { marginLeft: 5 }]}>Privacy & Security</Text>

        </View>
        {/* <Header gosetting={() => navigation.navigate('changetheme', {id:user && user.id})} /> */}
        <View style={styles.content}>
          <Text style={styles.heading}>Privacy</Text>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Last Status</Text>

            <RNPickerSelect
              placeholder={{ label: "Everyone", value: "everyone" }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue1(itemValue)
              }
              value={selectedValue1}
              style={pickerSelectStyles}
              items={[
                // { label: 'Everyone', value: 'everyone' },
                { label: 'Nobody', value: 'nobody' },
                { label: 'Friends', value: 'friends' },

              ]}
            />

            {/* <Picker
              selectedValue={selectedValue1}
              style={{ height: 50, width: 130, border: 'none' }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue1(itemValue)
              }
              mode="dropdown">
              <Picker.Item label="Everyone" value="everyone" />
              <Picker.Item label="Nobody" value="nobody" />
              <Picker.Item label="Friends" value="friends" />
            </Picker> */}
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Profile Picture</Text>

            <RNPickerSelect
              placeholder={{ label: "Everyone", value: "everyone" }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue2(itemValue)
              }
              value={selectedValue2}
              style={pickerSelectStyles}
              items={[
                // { label: 'Everyone', value: 'everyone' },
                { label: 'Nobody', value: 'nobody' },
                { label: 'Friends', value: 'friends' },

              ]}
            />
            {/* <Picker
              selectedValue={selectedValue2}
              style={{ height: 50, width: 130, border: 'none' }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue2(itemValue)
              }
              mode="dropdown">
              <Picker.Item label="Everyone" value="everyone" />
              <Picker.Item label="Nobody" value="nobody" />
              <Picker.Item label="Friends" value="friends" />
            </Picker> */}
          </View>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Online Status</Text>
            <RNPickerSelect
              placeholder={{ label: "Everyone", value: "everyone" }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue3(itemValue)
              }
              value={selectedValue3}
              style={pickerSelectStyles}
              items={[
                // { label: 'Everyone', value: 'everyone' },
                { label: 'Nobody', value: 'nobody' },
                { label: 'Friends', value: 'friends' },

              ]}
            />
            {/* <Picker
              selectedValue={selectedValue3}
              style={{ height: 50, width: 130, border: 'none' }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue3(itemValue)
              }
              mode="dropdown">
              <Picker.Item label="Everyone" value="everyone" />
              <Picker.Item label="Nobody" value="nobody" />
              <Picker.Item label="Friends" value="friends" />
            </Picker> */}
          </View>
          <TouchableOpacity style={styles.sectionStyle1} onPress={() => navigation.navigate('blockedcontacts')}>
            <Text style={styles.inputfield}>Block Contacts</Text>
            <Text style={styles.inputfield}>{blockedUsers.length}</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Security</Text>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Private Chat</Text>

            <RNPickerSelect
              placeholder={{ label: "Yes", value: "yes" }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValuechat(itemValue)
              }
              value={selectedValuechat}
              style={pickerSelectStyles}
              items={[
                // { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },

              ]}
            />

            {/* <Picker
              selectedValue={selectedValuechat}
              style={{ height: 50, width: 90, border: 'none' }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValuechat(itemValue)
              }
              mode="dropdown">
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker> */}
          </View>

          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Profile View</Text>
            <RNPickerSelect
              placeholder={{ label: "Yes", value: "yes" }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValuechat1(itemValue)
              }
              value={selectedValuechat1}
              style={pickerSelectStyles}
              items={[
                // { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },

              ]}
            />
            {/* <Picker
              selectedValue={selectedValuechat}
              style={{ height: 50, width: 90, border: 'none' }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValuechat(itemValue)
              }
              mode="dropdown">
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker> */}
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
};

export default Privacy;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    paddingLeft: 10,
    borderColor: 'black',
  },
  inputAndroid: {
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
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },


  content: {
    width: '94%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  inputfield: {
    color: "black",
    fontSize: 15,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 50,

  },
  sectionStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 50,
    borderRadius: 5,
    marginTop: 3,
    paddingLeft: 5,
    paddingRight: 5,
  },
  icon: {
    fontSize: 15,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 4,
  },
});
