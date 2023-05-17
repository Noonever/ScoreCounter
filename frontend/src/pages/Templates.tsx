import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react";

import ClickableItem from "../components/ClickableItem";

import { getLocalTemplates, setLocalTemplates, getTemplateCategories, setSessionCategories } from "../utils/storageFuncs";
import { text } from "stream/consumers";

export default function Templates() {

    const [templates, setTemplates] = useState(()=> getLocalTemplates())
    useEffect(()=> setLocalTemplates(templates), [templates]);

    const navigate = useNavigate()

    function chooseTemplate(templateKey: string): void {
        const categories = getTemplateCategories(templateKey)
        setSessionCategories(categories)
        navigate("/create/settings")
    }

    const removeItem = (templateKey: string) => {
        const nextTemplates: {[char: string]: string[]} = {}
        Object.assign(nextTemplates, templates)
        delete nextTemplates[templateKey]
        setTemplates(nextTemplates)
    }

    let templateItems = Object.entries(templates).map((item) =>
    <ClickableItem
    key={item[0]}
    itemName={item[0]}
    onButtonClickAction={()=>removeItem(item[0])}
    onDivClickAction={()=>chooseTemplate(item[0])}
    textColor={null}
    ></ClickableItem>
    )

    return (
        <div className="column-container">
            {Object.keys(templates).length? <a className="ask-text">Choose template!</a>: <a className="ask-text-mini">No saved templates, create one!</a> }
            <div className="templates">
                {templateItems}
                <button onClick={()=>navigate("/create/new-template")}>New template</button>
            </div>
        </div>
    )
}