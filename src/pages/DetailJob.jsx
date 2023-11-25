import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../firebase";

export default function DetailJob(){
    const {jobId} = useParams()
    const [data, setData] = useState()
    const [helper, setHelper] = useState()
    

    const fetchJobDetail = async() => {
        try {
            let jobRef = doc(db, 'jobs', jobId);
            const querySnapshot = await getDoc(jobRef);
            const newData = querySnapshot.data();
            const helperRef = querySnapshot.data().helper;

            setData(newData);

            if (helperRef) {
                const helperData = await getHelperById(helperRef);
                setHelper(helperData);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
        
    }
    
    useEffect(()=>{
        fetchJobDetail()
        // if(data !== undefined){
            
            //     if(data.title !== undefined)
        //     console.log(data.title);
        //     else console.log("welp");
        // }

        if(helper!== undefined){
            console.log(helper);
        }
    },[jobId])

    const getHelperById = async (helperDocRef) => {
        try {
            const helperSnapshot = await getDoc(helperDocRef);
            return helperSnapshot.data();
        } catch (error) {
            console.error('Error fetching helper details:', error);
            return null;
        }
    };
    


    if(data!== undefined && helper !== undefined)
    

    return(
        

        <div className="flex flex-col p-4 gap-3  h-screen">    

            <p className="text-lg font-semibold">{data.title}</p>
               
            <div className="flex flex-col gap-2 rounded-md shadow-md border-2 w-full p-3">
                {/* <p className="font-semibold">Helper</p> */}
                <div className="flex gap-1 items-center">
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>                   
                        <p className="font-medium">{helper.name}</p>
                        <p>Rate : {helper.rating}</p>
                    </div>
                </div>
            </div>
                

            <div>
                <p className="font-semibold text-lg">Detail Job</p>
                <div className="flex gap-1">
                    <p className="font-medium">Description</p>
                    <p>{data.description}</p>
                </div>
                <div className="flex gap-2">
                    <p className="font-medium w-20">Address</p>
                    <p>{data.address}</p>
                </div>
                <div className="flex gap-2">
                    <p className="font-medium w-20">Price</p>
                    <p>{data.price}</p>
                </div>
                <div className="flex gap-2">
                    <p className="font-medium w-20">Start Time</p>
                    <p>{data.time}</p>
                </div>
                <div className="flex gap-2">
                    <p className="font-medium w-20">Status</p>
                    <p className="font-medium">{data.status}</p>
                </div>

               
            </div>
           


        </div>
    )
    else
    return(
        <div></div>
    )

}