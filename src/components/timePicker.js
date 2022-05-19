import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Time } from 'react-native-gifted-chat';




const TimePicker = ({ selectedUnit, selectedValue, onValueChange, startValue, endValue }) => {
    let data = [];
    while (endValue >= startValue) {
        if (endValue < 10) {
            let val = "0" + String(endValue);
            data.push(val)
        } else {
            data.push(String(endValue))
        }
        endValue -= 1;
    }

    if (data === []) {
        return <Text>{selectedUnit}</Text>
    }
    return (
        <Picker
            itemStyle={{flex:1}}
            placeholder={selectedUnit}
            selectedValue={selectedValue}
            style={{ height: 50, width: '50%', border: 'none' }}
            onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
        >
            {data.map(value => <Picker.Item key={value} label={value} value={value} />)}
        </Picker>
    )
}
export default TimePicker;