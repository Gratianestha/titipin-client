import { useContext, useEffect, useState } from "react";
import Select from 'react-select'
import {db} from './../firebase.js'
import {collection, addDoc, Timestamp, doc, updateDoc, getDoc} from 'firebase/firestore'
import {useNavigate } from "react-router-dom";
import { context } from "../App.js";


export default function AddJob() {
    const [loggedInUser, setLoggedInUser] = useContext(context)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [title, setTitle] = useState();
    const [description, setDesc] = useState();
    const [address, setAddr] = useState();
    // const [client, setClient] = useState("client1");
    const [price, setPrice] = useState();
    const [status, setStatus] = useState("waiting");
    
    const [date, setDate] = useState();

    // console.log(loggedInUser);

    const handleSelection = (selection) => {
        setSelectedLabels(selection);
        const labels = selection.map(item => item.label);
        setLabels(labels);
      };


   const opt = [
    { "value": "MASAK", "label": "Masak" },
    { "value": "AC", "label": "AC" },
    { "value": "TECH", "label": "Tech" },
    { "value": "GARDENING", "label": "Gardening" },
    { "value": "DELIVERY", "label": "Delivery" },
    { "value": "PET_CARE", "label": "Pet Care" },
    { "value": "EVENT_PLANNING", "label": "Event Planning" },
    { "value": "TUTORING", "label": "Tutoring" },
    { "value": "CLEANING", "label": "Cleaning" },
    { "value": "HANDYWORK", "label": "Handywork" }
]

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !selectedLabels || !date || !address || !price || !description) {
            setErrorMessage("Please fill in all fields");
            return;
          }
        
          // Mendapatkan waktu saat ini
          const currentDate = new Date();
        
          // Memeriksa apakah waktu yang dipilih lebih dari waktu saat ini
          const selectedDate = new Date(date);
          if (selectedDate <= currentDate) {
            setErrorMessage("Please select a future date and time");
            return;
          }



      
        try {
          // Mendapatkan data saldo pengguna
          const userDocRef = doc(db, 'clients', loggedInUser);
          const userDoc = await getDoc(userDocRef);
          const userBalance = userDoc.data().balance;
      
          // Memeriksa apakah saldo mencukupi untuk harga yang ditawarkan
          if (userBalance >= price) {
            // Menambahkan pekerjaan ke Firestore
            await addDoc(collection(db, 'jobs'), {
              title: title,
              description: description,
              helper: null,
              label: labels,
              postedBy: userDocRef,
              price: price,
              status: status,
              time: date,
              address: address
            });
      
            // Mengurangi saldo pengguna setelah menambahkan pekerjaan
            await updateDoc(userDocRef, {
              balance: userBalance - price
            });
      
            console.log("Data added to Firestore and user balance updated");
            navigate('/home');
          } else {
            // alert("Insufficient balance!");
            setErrorMessage("Insufficient balance!")
          }
        } catch (err) {
          console.error("Error:", err);
        //   alert("Error occurred while adding job or updating balance");
          setErrorMessage("Error occurred while adding job or updating balance")
        }
      };
      

      const handleTimeChange = (event) => {
        const inputTime = event.target.value;
        
        console.log('Nilai asli input time:', inputTime);
        console.log(inputTime.replace("T", " "));
        const dateTime = inputTime.replace("T", " ")
        setDate(dateTime)
        // console.log(typeof(inputTime));
      };

    const handlePriceChange = (e) =>{
        const price = e.target.value;

        setPrice(Number(price))
    }
    

    return(
        <div className="flex flex-col  items-center bg-white min-w-screen min-h-screen p-4 pt-0 gap-5 overflow-y-auto">

                

                <div className="flex flex-col p-4 pt-0 w-full  gap-3">

                    <div className="flex flex-col items-start w-full">
                        <p>Title</p>
                        <input type="text" placeholder="Title" onChange={(e) => {setTitle(e.target.value)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Label</p>
                        <Select className="w-full items-start"
                        
                        options={opt}
                        onChange={handleSelection}
                        value={selectedLabels}
                        placeholder="Select Label"
                        isMulti
                        />
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Start Date / Time</p>
                        <input type="datetime-local" placeholder="Date" onChange={(e) => {handleTimeChange(e)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>


                    <div className="flex flex-col items-start w-full">
                        <p>Address</p>
                        <input type="text" placeholder="Address" onChange={(e) => {setAddr(e.target.value)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Price</p>
                        <input type="number" inputMode="numeric" placeholder="Price" onChange={(e) => {handlePriceChange(e)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Description</p>
                        <textarea name="Desc" id="Desc" rows="3" onChange={(e) => {setDesc(e.target.value)}} placeholder="Description" className="bg-neutral-50 border-solid border-2 rounded-md w-full p-1"/>
                    </div>

                </div>
                { errorMessage !=="" &&
                    <div className = "flex flex-row w-80 p-2 bg-red-700 my-5 items-center justify-start rounded-md text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p className = "text-xs">{errorMessage}</p>
                    </div>
                }


                <button type="submit" onClick={(e) => handleSubmit(e)} className="bg-sky-300 hover:bg-sky-500 w-1/2 py-1.5 rounded-md">Post</button>
                

           
        </div>
    )
}