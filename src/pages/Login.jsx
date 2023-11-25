import { useEffect, useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import {auth, db} from '../firebase.js'
import { setDoc, doc, collection, query, where, getDocs } from "firebase/firestore"; 
import {signInWithEmailAndPassword} from 'firebase/auth'
import {context} from '../App.js'

const Login = () =>{

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [loggedInUser, setLoggedInUser] = useContext(context)


    useEffect(() => {
        document.title = "Titipin - Sign In"
        if(loggedInUser !== ""){
            navigate('/home')
        }
    }, [loggedInUser])

    const signIn = (e) =>{
        e.preventDefault()
        setLoading(true)
        const email = e.target.email.value
        const password = e.target.password.value

        if(email === ""){
            setErrorMessage("Email cannot be empty")
        }else if(password === ""){
            setErrorMessage("Password cannot be empty")
        }else{
            signInWithEmailAndPassword(auth, email, password).then((x)=>{
                setErrorMessage('')
                const clientQuery = query(collection(db, "clients"), where("email", "==", email));
                getDocs(clientQuery).then((docs)=>{
                    // if(docs.docs.length > 0){
                        console.log(x.user.uid);
                        setLoggedInUser(x.user.uid)
                        localStorage.setItem('loggedIn', x.user.uid)
                        navigate('/home')
                        setLoading(false)
                    // }else{
                    //     navigate('/home')
                    // }
                })
            }).catch((err)=>{
                console.log(err)
                setErrorMessage("Invalid Credentials")
                setLoading(false)
            })
        }
    }

    return(
        <>
            <div className="flex flex-col h-screen w-screen bg-blue-100 justify-center items-center">
                <form onSubmit = {signIn}>
                    <h1 className = "font-bold text-3xl mb-8">TITIPIN</h1>
                    <div className ="flex flex-col h-fit w-80 p-4 bg-white rounded-md space-y-4">
                        {/* <p className="font-bold text-lg">Login</p> */}
                        <div className="flex flex-col items-start my-2 space-y-2">
                            <p>Email</p>
                            <input className="w-full border rounded-md border-black px-1 py-0.5" type="text" id="email"/>
                            <p>Password</p>
                            <input className="w-full border rounded-md border-black px-1 py-0.5" type="password" id="password"/>
                        </div>
                        {!loading && 
                            <button type = "submit" className="btn bg-blue-500 rounded-md text-white hover:bg-blue-400 active:bg-blue-600 p-2">Sign in</button>
                        }
                        {loading && 
                            <button className="btn bg-blue-500 rounded-md text-white hover:bg-blue-400 active:bg-blue-600 p-2">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </button>
                        }
                        <div className="flex flex-row space-x-1 justify-center">
                            <p className="text-xs">Don't have a Titipin account yet? </p>
                            <p onClick={()=>{
                                navigate('/register')
                            }} className="text-xs text-blue-600">Sign up</p>
                        </div>
                    </div>
                </form>
                { errorMessage !=="" &&
                    <div className = "flex flex-row w-80 p-2 bg-red-700 my-5 items-center justify-start rounded-md text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p className = "text-xs">{errorMessage}</p>
                    </div>
                }
            </div>
        </>
    )
}

export default Login