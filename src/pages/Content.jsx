import { useContext, useEffect, useState } from "react"
import { context } from "../App"
import { useNavigate } from "react-router-dom"
import Home from "./Home"
import History from "./History"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"


export default function Content({currentPage}) {

    const [loggedInUser, setLoggedInUser] = useContext(context)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()

    useEffect(() =>{
        document.title = "Titipin - " + currentPage
        if(loggedInUser === ""){
            navigate('/')
        }else{
            onSnapshot(doc(db, "clients", loggedInUser),(x)=>{
                setUserData(x.data())
            })
        }

    }, [loggedInUser])

    return(
        <div className = "flex flex-col w-screen min-h-screen ">
             
                {currentPage === "home" &&
                    <Home userData={userData}/>
                }
                {currentPage === "history" &&
                    <History/>
                }
            
        </div>

    )


}