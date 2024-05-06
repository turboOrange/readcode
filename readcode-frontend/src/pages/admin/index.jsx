import RegisterForm from "./registerForm";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material"
import axios from "axios";

const Admin = () => {
    const [registrationMessage, setRegistrationMessage] = useState("");    
    const [registrationError, setRegistrationError] = useState();    
    const [registrationLoading, setRegistrationLoading] = useState();    

    const handleUserRegistration = (formValues) => {
        console.log(formValues);
        setRegistrationLoading(true);
        axios.post("http://localhost:8080/user", 
            formValues
        ).then(res => {
            console.log(res);
            console.log(res.status);
            setRegistrationLoading(false);
            if (res.status === 201) {
                setRegistrationMessage("Utilisateur ajouté avec succès!");
            }
        })
         .catch(err => {
            console.log("inside API error");
            console.error(err.message);
            setRegistrationLoading(false);
            setRegistrationError("Erreur lors de l'enregistrement de l'utilisateur");
        });
    }
    
    return (
        <Box display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={"column"}
        minHeight={"100vh"}
        overflow={"auto"}>
            <Card sx={{width:"80vh", boxShadow:"0 3px 5px"}} variant="outlined">
                <CardContent>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Typography align="center" fontFamily={"arial"} fontSize={"4vh"} marginBottom={"3vh"} fontWeight={"bold"}>
                            Add user
                        </Typography>
                        <RegisterForm handleUserRegistration={handleUserRegistration} loading={registrationLoading}/>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                            {registrationMessage && <span style={{fontWeight:"bold", color:"green"}}>{registrationMessage}</span> }
                            {registrationError && <span style={{fontWeight:"bold", color:"red"}}>Erreur d'enregistrement de profil</span>}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{margin:"20px", width:"80vh", boxShadow:"0 3px 5px"}} variant="outlined">
                <CardContent>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Typography align="center" fontFamily={"arial"} fontSize={"4vh"} marginBottom={"6vh"} fontWeight={"bold"}>
                            Delete user
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Admin;