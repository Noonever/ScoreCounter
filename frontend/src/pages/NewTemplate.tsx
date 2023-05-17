import { useNavigate } from "react-router-dom"
import { useState } from "react"

import DynamicForm from "../components/DymanicForm"

import { setSessionCategories, getSessionCategories, getLocalTemplates, setLocalTemplates } from "../utils/storageFuncs"

import "./modal.css"

const defaultFormData = {
    body: ""
}

export default function NewTemplate() {
    const [currentCategories, setCurrentCategories] = useState<string[]>([])

    const [modal, setModal] = useState(false)
    const [templateSaved, setTemplateSaved] = useState(false)
    const [formData, setFormdata] = useState(defaultFormData);
    const { body } = formData;

    const navigate = useNavigate()

    const itemsCallback = (items: {[char: string]: string}) => {
        const newCategories = Object.keys(items)
        console.log(items)
        setCurrentCategories(newCategories)
    }


    const nextClickAction = () => {
        setSessionCategories(currentCategories)
        navigate("/create/settings")
    }


    function toggleModal() {
        setModal(!modal)
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function saveTemplate(templateName: string) {
        if (templateName) {
            console.log(templateName)
            const newTemplate = currentCategories
            const newTemplates = getLocalTemplates()
            newTemplates[templateName] = newTemplate
            setLocalTemplates(newTemplates)
            setTemplateSaved(true)
            await sleep(1500)
            setModal(false)
            setTemplateSaved(false)
        }
    }

    const handleTemplateSave = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const data = formData["body"]
        if (data) {
            console.log(`from handle ${data}`)
            saveTemplate(data);
        }

    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const getCategoriesString = () => {
       return currentCategories.join(", ")
    }

    const currentCategoriesItem = <p className="ask-text-mini">Categories: {getCategoriesString()}</p>

    const modalWindow = 
    <div className="modal">
        <div className="overlay" onClick={toggleModal}></div>
        <div className="modal-content">
            <div>{currentCategoriesItem}</div>
            <form onSubmit={handleTemplateSave}>
                {templateSaved? <p>Template saved!</p>: <a className="ask-text-mini">Enter template name:</a>}
                <input onChange={onChange} id="body"/>
                <div>
                    <button type="submit">save</button>
                    <button type="button" onClick={toggleModal}>cancel</button>
                </div>
            </form>
        </div>
    </div>

    return (
        <div className="column-container">
            <a className="ask-text">Enter categories:</a>
            <DynamicForm  itemsCallback={itemsCallback} defaultColor='#000000' onNextClick={()=>nextClickAction()} useColors={false}/>
            <div>
            {currentCategories.length? <button onClick={()=>toggleModal()}>save template</button>: <></>}
            {modal? modalWindow: <></>}
            </div>
        </div>
    )
}