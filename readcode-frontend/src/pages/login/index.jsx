import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardActions, CardContent } from "@mui/material"
import axios from "axios";
import  { useNavigate, Link } from 'react-router-dom';
import LoginForm from "./loginForm";

const Login = ({setUser}) => {
    const [authenticationLoading, setAuthenticationLoading] = useState(false);
    const [authenticationError, setAuthenticationError] = useState();
    const navigate = useNavigate();

    useEffect(() => {console.log(`Loaded Login Component`)}, []);

    const handleUserLogin = async (formValues) => {
        setAuthenticationLoading(true);
        console.log(formValues);
        axios.post("http://localhost:8080/user/authentication", 
            formValues,
            {withCredentials:true}
        ).then(res => {
            setAuthenticationLoading(false);
            console.log(`inside Login page handleUserLogin`)
            console.log(res.data);
            if (res.status === 200 || res.status === 203) {
                // mettre a jour le user state
                setUser(res.data.user)
                navigate('/dashboard');
            }
            else console.log("mauvais mot de passe")
            setAuthenticationError("");
        })
         .catch(err => {
            setAuthenticationLoading(false);
            console.log("inside API error");
            console.error(err?.response?.status);
            if (err?.response?.status === 401) {
                console.log("Details de connection errones")
                setAuthenticationError("Details de connection errones");
            }
            else {
                setAuthenticationError(err.message);
            }
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
                        { authenticationError && <span>{authenticationError}</span>}
                        <LoginForm handleUserLogin={handleUserLogin} loading={authenticationLoading}/>
                    </Box>
                </CardContent>
                <CardActions>
                    <Link to="/register">
                        <Button size="small">
                                <Typography sx={{fontSize:11}}>
                                    Pas enregistré? S'enregistrer
                                </Typography>
                        </Button>
                    </Link>
                </CardActions>
            </Card>
        </Box>
    )
}

export default Login;