import { Outlet } from "react-router-dom";

export default function RootLayout(){
    return (
        <div className="root-layout">
            <div className="App">
                <main>
                    <Outlet/>
                </main>
            </div>  
        </div>
    )
}