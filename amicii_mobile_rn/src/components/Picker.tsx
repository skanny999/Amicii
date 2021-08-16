import React from 'react';
import { PickerType } from '../types';
import RNPickerSelect from 'react-native-picker-select'

const AGPicker = (props: { type: PickerType, value: string, isLarge: boolean, disabled: boolean, handlePickedValue: (value: string) => void }) => {
    
    const textProps = {
        paddingBottom: props.isLarge ? 15 : 10,
                color: '#363637',
                fontSize: props.isLarge ? 20 : 15
    }

    const handlerFunction = (props.disabled) ? ((value: any) => null) : props.handlePickedValue

    const ageItems = () => {
        var ageArray = new Array();
        ageArray[0] = { label: 'Select Age ', value: '0' }
        for (let i = 18; i<100; i++) {
            const iString = `${i}`
            ageArray[i - 17] = { label:iString, value: iString }
        }
        return ageArray
    }

    const genderItems = [
        { label: '  Select Gender', value: 'gender' },
        { label: 'M', value: 'M' },
        { label: 'F', value: 'F' },
        { label: ' ', value: ' ' },
    ]

    const items = (type: PickerType) => {
        switch (type) {
            case PickerType.age:
                return ageItems()
            case PickerType.gender:
                return genderItems
        }
    }

    return (
        <RNPickerSelect
            placeholder={{}}
            disabled={props.disabled}
            onValueChange={handlerFunction}
            items={items(props.type)}
            style={{
                inputIOS:textProps,
                inputAndroid:textProps
            }}
            value={props.value}
        />
    )
}

export default AGPicker