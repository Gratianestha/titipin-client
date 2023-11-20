import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DocumentReference, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"; 
import { context } from "../App";
import { db } from "../firebase";

export default function History() {

    const [client, setClient] = useState('client1');
    const [data, setData] = useState([]);

    const fetchJobs2 = async() => {
        let clientRef = getClientRef(client)
        const querySnapshot = await getDocs(query(collection(db, "jobs"), where("postedBy", "==", clientRef)));
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        setData(newData)
    }


    useEffect(()=>{
        fetchJobs2();
    }, [])

    const getClientRef = (clientId) => {
        const clubSnapshot = doc(db, 'clients', clientId)
        // console.log(clubSnapshot);
        return clubSnapshot
    }

    return(
        <div className="flex flex-col items-center bg-white min-w-screen min-h-screen p-4 gap-5">

            <p className="font-bold text-xl">Activity History</p>


            {
                data.map(job =>{
                    console.log(job);
                    return(

                        <div className="flex gap-2 rounded-md shadow-md border-2 w-full p-3">
                            <div className="flex flex-col gap-1 w-3/4">
                                <p className="text-lg font-semibold">{job.title}</p>
                                <p>{job.description}</p>
                                <p>Helper : helper</p>
                        
                            </div>
                            <div className="flex flex-col items-center justify-around">
                                <p>Rp.{job.price}</p>
                                <p className="bg-red-200 border-solid border-red-400 border-2 w-fit py-1 px-3 rounded-full">{job.status}</p>
                            </div>
                    
                        </div>
                        )
                })
            }
        </div>
    )
}