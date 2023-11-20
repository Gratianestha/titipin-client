import { useEffect, useState } from "react";
import Select from 'react-select'
import {db} from './../firebase.js'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import {useNavigate } from "react-router-dom";


export default function AddJob() {

    const navigate = useNavigate()

    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [title, setTitle] = useState();
    const [description, setDesc] = useState();
    const [address, setAddr] = useState();
    const [client, setClient] = useState("client1");
    const [price, setPrice] = useState();
    const [status, setStatus] = useState("waiting");
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [date, setDate] = useState();

  

    const handleLabelSelect = (selectedOptions) => {
        // console.log(selectedOptions[0].value);
        // console.log(selectedOptions.value);
        setSelectedLabels(selectedOptions);
        if(selectedOptions[0]){
            setLabels(selectedOptions[0].label);
        }

    };

    const handleSelection = (selection) => {
        setSelectedLabels(selection);
        const labels = selection.map(item => item.label);
        setLabels(labels);
      };


    const opt = [
        {value:"MASAK", label: "Masak"},
        {value:"AC", label: "AC"},
        {value:"TECH", label: "Tech"},
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = {
            title: title,
            description: description,
            helper:null,
            label: labels,
            postedBy: `/clients/${client}`,
            price: price,
            status: status,
            time:date,
            address: address

        }

        console.log(data);


        try {
          await addDoc(collection(db, 'jobs'), {
            data
          }).then(
            console.log("send to back"),
            navigate('/home')
          );
          
        } catch (err) {
          alert(err)
        }


      }

      const handleTimeChange = (event) => {
        const inputTime = event.target.value;
        
        console.log('Nilai asli input time:', inputTime);
        console.log(inputTime.replace("T", " "));
        const dateTime = inputTime.replace("T", " ")
        setDate(dateTime)
        console.log(typeof(inputTime));
      };
    

    return(
        <div className="flex flex-col justify-center items-center bg-white min-w-screen min-h-screen  p-4 gap-5">

                <div>
                    <p className="font-bold text-xl">Post Your Job!</p>
                </div>

                <div className="flex flex-col justify-center items-center p-4 w-full  gap-3">

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

                    {/* <div className="flex flex-col items-start w-full">
                        <p>Start Date</p>
                        <input type="date" placeholder="Date" onChange={(e) => {setDate(e.target.value)}} className="bg-neutral-50 rounded-md w-full h-8 p-1"/>
                    </div> */}

                    <div className="flex flex-col items-start w-full">
                        <p>Start Date / Time</p>
                        <input type="datetime-local" placeholder="Date" onChange={(e) => {handleTimeChange(e)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    {/* <div className="flex gap-2  w-full">
                        <div className="flex flex-col items-start w-1/2">
                            <p>Start Time</p>
                            <input type="time" placeholder="Time" onChange={(e) => {setStartTime(e.target.value)}} className="bg-rose-100 rounded-md w-full h-8 p-1"/>
                        </div>
                        <div className="flex flex-col items-start w-1/2">
                            <p>End Time</p>
                            <input type="time" placeholder="Time" onChange={(e) => {setEndTime(e.target.value)}} className="bg-rose-100 rounded-md w-full h-8 p-1"/>
                        </div>
                    </div> */}

                    <div className="flex flex-col items-start w-full">
                        <p>Address</p>
                        <input type="text" placeholder="Address" onChange={(e) => {setAddr(e.target.value)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Price</p>
                        <input type="number" inputMode="numeric" placeholder="Price" onChange={(e) => {setPrice(e.target.value)}} className="bg-neutral-50 border-solid border-2 rounded-md w-full h-8 p-1"/>
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <p>Description</p>
                        <textarea name="Desc" id="Desc" rows="3" onChange={(e) => {setDesc(e.target.value)}} placeholder="Description" className="bg-neutral-50 border-solid border-2 rounded-md w-full p-1"/>
                    </div>

                </div>

                    <button type="submit" onClick={(e) => handleSubmit(e)} className="bg-sky-100 w-1/2 py-1.5 rounded-md">Post</button>
                
           
        </div>
    )
}