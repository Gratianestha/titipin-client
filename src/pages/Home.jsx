import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { useEffect, useState } from "react";

export default function Home() {

    const [client, setClient] = useState('client1');
    const [data, setData] = useState([]);

    const fetchJobs2 = async() => {
        let clientRef = getClientRef(client)
        const querySnapshot = await getDocs(query(collection(db, "jobs"), 
        where("postedBy", "==", clientRef),
        // where("status", "!=", "done")

        ));
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        console.log(newData);
        setData(newData);
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


                <div className = "flex w-full h-full flex-col p-6">
                    <div className = "flex flex-row w-full mb-4 px-4">
                        <p className = "text-xl mr-1.5 text-neutral-600">Welcome</p>
                        <p className = "text-xl text-blue-800">Name</p>
                    </div>
                    <div className = "flex flex-col items-start justify-center w-full h-28 bg-blue-800 rounded-md p-4 text-white">
                        <p className = "text-lg">Your Balance</p>
                        {/* <p className = "text-2xl font-bold">Rp {userData.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p> */}
                        <p className = "text-2xl font-bold">Rp 20000</p>
                    </div>
                    <div className = "w-full flex flex-row justify-start mt-6 space-x-6">
                        <div className = "flex flex-col items-center justify-center space-y-2">
                            <div className = "bg-blue-200 rounded-full p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E40AF" className="w-7 h-7">
                                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                </svg>
                            </div>
                            <p className="text-sm">Withdraw</p>
                        </div>
                        <div className = "flex flex-col items-center justify-center space-y-2">
                            <div className = "bg-blue-200 rounded-full p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E40AF" className="w-7 h-7">
                                    <path fillRule="evenodd" d="M6.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.25 4.81V16.5a.75.75 0 01-1.5 0V4.81L3.53 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zm9.53 4.28a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V7.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm">Transfer</p>
                        </div>
                    </div>
                </div>

            <div className="flex flex-col gap-2">

            <p className = "text-xl font-bold text-neutral-600">Your Jobs</p>
           
            {
                
                data.map(job =>{
                    console.log(job);
                    return(
                        
                        <div className="flex gap-2 rounded-md shadow-md border-2 w-full p-3">
                            <div className="flex flex-col gap-1 w-3/4">
                                <p className="text-lg font-semibold text-neutral-600">{job.title}</p>
                                <p className="text-neutral-600">{job.description}</p>
                                <p className="text-neutral-600">Helper : helper</p>
                        
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

            
        </div>
    )
}