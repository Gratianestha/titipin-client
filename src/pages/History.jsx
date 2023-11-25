import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DocumentReference, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"; 
import { context } from "../App";
import { db } from "../firebase";

export const statusStyle = (status) =>{

    let classNames = "border-solid border-red-400 border-2 w-fit py-1 px-3 rounded-full";
    
    switch (status) {
        case "on progress":
            classNames += " px-1 text-sm w-24 items-center justify-center bg-blue-200 border-blue-400";
            break;
        case "waiting":
            classNames += " bg-neutral-200 border-neutral-400";
            break;
        case "done":
            classNames += " bg-green-200 border-green-400";
            break;
        case "finisihed":
            classNames += " bg-orange-200 border-orange-400";
            break;
        case "canceled":
            classNames += " bg-red-200 border-red-400";
            break;
            
        default:
            break;
        }
                
    return classNames      
                
}

export const getHelperById = async (helperDocRef) => {
    try {
        const helperSnapshot = await getDoc(helperDocRef);
        return helperSnapshot.data().name;
    } catch (error) {
        console.error('Error fetching helper details:', error);
        return null;
    }
};

export default function History({userData}) {
    const [loggedInUser, setLoggedInUser] = useContext(context)

    // const [client, setClient] = useState('client1');
    const [data, setData] = useState([]);
    const [helpers, setHelpers] = useState({});

    const fetchJobs2 = async() => {
        let clientRef = getClientRef(loggedInUser)
        const querySnapshot = await getDocs(query(collection(db, "jobs"), where("postedBy", "==", clientRef)));
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        
        console.log(newData);
        setData(newData)
    }

    const fetchHelperData = async (job) => {
        if (job.helper && !helpers[job.id]) {
            try {
                const helperName = await getHelperById(job.helper);
                setHelpers(prevHelpers => ({
                    ...prevHelpers,
                    [job.id]: helperName,
                }));
            } catch (error) {
                console.error('Error fetching helper details:', error);
            }
        }
    };


    useEffect(()=>{
        fetchJobs2();

        
    }, [])
    useEffect(() => {
        data.forEach(job => {
            fetchHelperData(job);
        });
    }, [data]);

    const getClientRef = (clientId) => {
        const clubSnapshot = doc(db, 'clients', clientId)
        // console.log(clubSnapshot);
        return clubSnapshot
    }

   
    
    return(
        <div className="flex flex-col items-center bg-white min-w-screen min-h-screen h-fit mb-12 pb-8 p-4 gap-5">

            <p className="font-bold text-xl">My Job List</p>


            {
                data.map(job =>{ 
                    console.log(job.id);
                    return(

                        <div className="flex gap-2 rounded-md shadow-md border-2 w-full h-full p-3">
                            <Link to={`/job/${job.id}`} className="flex w-full">
                                <div className="flex flex-col justify-start items-start gap-1 w-3/4">
                                    <p className="text-lg font-semibold">{job.title}</p>
                                    <p>{job.description}</p>
                                    {
                                        job.helper !== null ?
                                        <p>Helper : {helpers[job.id] || '-'}</p>
                                        :
                                        <p>Helper : -</p>

                                    }
                            
                                </div>
                                <div className="flex flex-col items-center justify-around">
                                    <p>Rp.{job.price}</p>
                                    
                                    <p className= {statusStyle(job.status)}
                                    >
                                        {job.status}
                                    </p>
                                    
                                </div>
                    
                        </Link>
                        </div>
                        )
                })
            }
        </div>
    )
}