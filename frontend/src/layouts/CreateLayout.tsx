import { Outlet } from "react-router-dom";

export default function CreateLayout(){
    return (
        <div className="create-layout">
            <div className="App">
                <main>
                    <Outlet/>
                </main>
            </div>  
        </div>
    )
}