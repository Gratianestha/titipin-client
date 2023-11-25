import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getHelperById, statusStyle } from "./History";
import { faSortNumericUpAlt } from "@fortawesome/free-solid-svg-icons";
import { context } from "../App";

export default function Home({userData}) {
    const [loggedInUser, setLoggedInUser] = useContext(context)
    const [helpers, setHelpers] = useState({});
    // const [client, setClient] = useState('client1');
    const [data, setData] = useState([]);
    const [clientData, setClientData] = useState({balance:0});

    const navigate = useNavigate()

    const fetchJobs2 = async() => {
        let clientRef = getClientRef(loggedInUser)
        const excludedStatus = ["done", "finished", "canceled"];


        const querySnapshot = await getDocs(query(collection(db, "jobs"), 
        where("postedBy", "==", clientRef),
        where("status", "not-in", excludedStatus)

        ));
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        // console.log(newData);
        setData(newData);
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
        getClientById(loggedInUser)
    }, [])
    // console.log(userData);

    useEffect(() => {
        data.forEach(job => {
            fetchHelperData(job);
        });
    }, [data]);

    useEffect(() => {
        document.title = "Titipin - Home";
        if (loggedInUser === "") {
            navigate('/login');
        }
    }, [loggedInUser, navigate]);

    const getClientRef = (clientId) => {
        const clubSnapshot = doc(db, 'clients', clientId)
        console.log(clubSnapshot);
        return clubSnapshot
    }

    const getClientById = async (clientId) => {
        const clientSnapshot = doc(db, 'clients', clientId)
        try {
            const clientData = await getDoc(clientSnapshot);
            console.log(clientData.data());
            setClientData(clientData.data())
            // return ;clientSnapshot.data()
        } catch (error) {
            console.error('Error fetching helper details:', error);
            return null;
        }
    };

    const increaseBalance = async (clientId) => {
        try {
          const clientRef = doc(db, 'clients', clientId)
      
          // Get the current balance from Firestore
          const clientDoc = await getDoc(clientRef)
          const currentBalance = clientDoc.data().balance;
      
          // Update the balance by adding 10000
          await updateDoc(clientRef, {
            balance: currentBalance + 10000,
          });
      
          console.log('Balance updated successfully!');
        } catch (error) {
          console.error('Error updating balance:', error);
        }
      };
      
      const handleSignOut = () => {
        auth.signOut()
          .then(() => {
            // Sign-out berhasil.
            localStorage.removeItem('loggedIn');
            setLoggedInUser(""); // Setelah sign-out berhasil, set state loggedInUser menjadi kosong
            console.log('Sign-out berhasil');
            // navigate('/login');
            navigate("/")
            // Redirect ke halaman sign-in atau halaman lain jika diperlukan
          })
          .catch((error) => {
            // Terjadi error saat sign-out.
            console.error('Error pada proses sign-out:', error);
          });
      };

    if(clientData !== undefined && userData !== null)

    return(
        <div className="flex flex-col items-center bg-white min-w-screen mb-12 pb-8 p-4 gap-5 ">


                <div className = "flex w-full h-full flex-col ">
                    <div className = "flex flex-row w-full mb-4 px-4">
                        <p className = "text-lg font-medium mr-1.5 text-neutral-600">Welcome</p>
                        <p  onClick={handleSignOut} className = "text-lg font-medium text-sky-600">{userData.name}</p>
                    </div>
                    <div className = "flex items-center justify-between px-4 w-full h-24 bg-sky-500 rounded-md  text-white">
                        <div className="">
                            <p className = "text-lg">Your Balance</p>
                            {/* <p className = "text-2xl font-bold">Rp {userData.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p> */}
                            <p  className = "text-xl font-bold">Rp {userData.balance.toString()}</p>
                        </div>

                      <div className="flex flex-col items-center" onClick={() =>increaseBalance(loggedInUser)}>
                        <div className = "bg-sky-200 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  strokeWidth="1" stroke="blue" fill="blue" class="w-4 h-4">
                                <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                            </svg>
                        </div>                        
                        <p className="text-xs">TopUp</p>
                      </div>
                    </div>
                   
                </div>

            <div className="flex flex-col gap-2 w-full">

            <p className = "text-xl font-bold text-neutral-600 ">Your Current Jobs</p>
           
            {
                data.length >0 ?
                data.map(job =>{ 
                    console.log(job.id);
                    return(

                        <div className="flex gap-2 rounded-md shadow-md border-2 w-full h-full p-3">
                            <Link to={`/job/${job.id}`} className="flex w-full">
                                <div className="flex flex-col items-start gap-1 w-3/4">
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

                :

                (
                    <div>
                        You have no ongoing job
                    </div>
                )
                
                
            }
            </div>

            
        </div>
    )
}