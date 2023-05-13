import ClickableItem from "./ClickableItem";

import { useState, useEffect } from "react";
import { Circle } from "@uiw/react-color";

const defaultFormData = {
    body: ""
}

type DymanicFormProps = {
    itemsCallback: (items: {[char: string]: string}) =>  void
    onNextClick: Function
    useColors: boolean
    defaultColor: string
}

export default function DynamicForm({itemsCallback, onNextClick, useColors, defaultColor}: DymanicFormProps) {

    const [formData, setFormdata] = useState(defaultFormData);
    const { body } = formData;
    const [currentColor, setCurrentColor] = useState(defaultColor)
    const [itemsDict, setItemsDict] = useState<{[char: string]: string}>({})

    let elementItems = Object.entries(itemsDict).map((item) =>
    <ClickableItem
    key={item[0]}
    itemName={item[0]}
    onButtonClickAction={()=>removeItem(item[0])}
    onDivClickAction={null}
    textColor={item[1]}
    ></ClickableItem>
    )

    useEffect(()=>{
        itemsCallback(itemsDict)
    }, [itemsDict])

    const addItem = (itemKey: string, itemValue: string) => {
        const nextItemsDict: {[char: string]: string} = {}
        Object.assign(nextItemsDict, itemsDict)
        nextItemsDict[itemKey] = itemValue
        setItemsDict(nextItemsDict)
    }

    const removeItem = (itemKey: string) => {
        const nextItemsDict: {[char: string]: string} = {}
        Object.assign(nextItemsDict, itemsDict)
        delete nextItemsDict[itemKey]
        setItemsDict(nextItemsDict)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const data = formData["body"]
        if (data) {
            addItem(data, currentColor)
            setFormdata(defaultFormData)
        }
    }

    console.log(itemsDict)
    return (
        <form onSubmit={(e)=>onSubmit(e)}>
            <input style={{color: currentColor}} type="text" id="body" value={body} onChange={(e)=>onChange(e)}></input>
            <div className="btn-row">
                <button type="submit" className="form-btn">add</button>
                {Object.keys(itemsDict).length? <button type="button" className="form-btn" onClick={()=>onNextClick()}>next</button>: <></> }
            </div>
            {useColors?
            <Circle colors={["#000000","#FF0000"]}
            color={currentColor}
            onChange={(color)=>{setCurrentColor(color.hex)}}
            />: null}
            {elementItems}
        </form>
    )
}