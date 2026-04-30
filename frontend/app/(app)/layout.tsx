import { ReactNode } from "react";
import { Navbar } from "../components/Sidebar";

export default function AppLayout( { children }: {children:ReactNode} ){
    return(
        <div className="flex w-full h-screen bg-background">
            <Navbar/>
            <main className="bg-[#FFFFFF] flex-1 overflow-auto">
                <div>
                    {children}
                </div>
            </main>
        </div>
    )
}