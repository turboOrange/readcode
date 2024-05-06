import StatsChart from "./chart/statsChart";
import { Box, Typography, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
    const [personal, setPersonal] = useState(null);
    const [personalLoading, setPersonalLoading] = useState(false);
    const [personalLoaded, setPersonalLoaded] = useState(false);
    const [personalError, setPersonalError] = useState(null);

    const [global, setGlobal] = useState(null);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [globalLoaded, setGlobalLoaded] = useState(false);
    const [globalError, setGlobalError] = useState(null);

    const getPersonalStats = () => {
        setPersonalLoading(true);
        axios.get(`http://localhost:8080/challenge/personalaverages`, {withCredentials: true})
        .then(res => {setPersonal(res.data); setPersonalLoading(false); setPersonalLoaded(true);})
        .catch(err => {setPersonalError(err.message); setPersonalLoading(false); console.log(err);});
    };

    const getGlobalStats = () => {
        setGlobal(true);
        axios.get(`http://localhost:8080/challenge/globalaverages`, {withCredentials: true})
        .then(res => {setGlobal(res.data); setGlobalLoading(false); setGlobalLoaded(true);})
        .catch(err => {setGlobalError(err.message); setGlobalLoading(false); console.log(err);});
    };

    useEffect(() => {
        getPersonalStats();
        getGlobalStats();
    }, [])

    return (
        <Box sx={{
            display:'flex',
            flexDirection:'column',
            justifyContent:"center",
            top:5
        }}
        >
            {(personalLoading || globalLoading) ? 
                <Box display="flex" justifyContent="center" alignItems="center" marginTop="10vh"><CircularProgress/></Box>
                    :
                null
            }
            <Typography>
                {personalError && JSON.stringify(personalError)}
            </Typography>

            { personalLoaded && globalLoaded && personal && global &&
                <Box maxHeight="45vh" display={"flex"} justifyContent={"center"} alignItems={"center"}> 
                    <StatsChart personal={personal} global={global}/>
                </Box>
            }
        </Box>
    )
}

export default Stats