import { useLocation, useNavigate } from "react-router-dom";


export default function TopBar(){
    const location = useLocation();
    const navigate = useNavigate()


    //show only in detail page (path => /job/jobid)
    if(location.pathname.startsWith('/job/') || location.pathname === '/addjob')
    return (
        <div className="flex justify-center items-center relative h-12">
            
                <button onClick={() => navigate(-1)} className="absolute left-3">           
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                </button>

                {location.pathname.startsWith('/job/') ? (
                    <p className="text-xl font-semibold">Job Summary</p>
                ) : location.pathname === '/addjob' ? (
                    <p className="text-xl font-semibold">Add Job</p>
                ) : null}
        </div>
    )
    else return null
}