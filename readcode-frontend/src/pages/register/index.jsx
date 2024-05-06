import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Button, Card, CardActions, CardContent } from "@mui/material"
import { Link } from "react-router-dom";
import axios from "axios";
import RegisterForm from "./registerForm";
import  { useNavigate } from 'react-router-dom';

const Register = () => {
    const [registrationError, setRegistrationError] = useState();    
    const [registrationLoading, setRegistrationLoading] = useState();    
    const navigate = useNavigate();

    const handleUserRegistration = (formValues) => {
        console.log(formValues);
        setRegistrationLoading(true);
        axios.post("http://localhost:8080/user", 
            formValues
        ).then(res => {
            console.log(res);
            console.log(res.status);
            setRegistrationLoading(false);
            (res.status === 201 || res.status === 203) ? navigate('/login') : console.log("mauvais mot de passe")
            setRegistrationError("");
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
        height="75vh">
            <Card sx={{width:"80vh", boxShadow:"0 3px 5px"}} variant="outlined">
                <CardContent>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Typography align="center" fontFamily={"arial"} fontSize={"4vh"} marginBottom={"6vh"} fontWeight={"bold"}>
                            ReadCode
                        </Typography>
                        <RegisterForm handleUserRegistration={handleUserRegistration} loading={registrationLoading}/>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                            {registrationError && <span style={{fontWeight:"bold", color:"red"}}>Erreur d'enregistrement de profil</span>}
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Link to="/login">
                        <Button size="small">
                            <Typography sx={{fontSize:11}}>
                                Déjà enregistré? Se connecter
                            </Typography>
                        </Button>
                    </Link>
                </CardActions>
            </Card>
        </Box>
    )
}

export default Register