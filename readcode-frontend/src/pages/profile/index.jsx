import ProfileModificationForm from "./profileModificationForm";
import Stats from "./stats";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent } from "@mui/material"

const Profile = ({user, setUser}) => {
    const [activeComponent, setActiveComponent] = useState("ProfileModificationForm");

    const [profileModificationSuccess, setProfileModificationSuccess] = useState(false);
    const [profileModificationLoading, setProfileModificationLoading] = useState(false);
    const [profileModificationError, setProfileModificationError] = useState();
    console.log(user);
    
    const handleUserProfileModification = (formValues) => {
        console.log(`Modifying user's profile information...`);
        setProfileModificationLoading(true);
        console.log(formValues);
        axios.put("http://localhost:8080/user/modification", 
            formValues,
            {withCredentials:true}
        ).then(res => {
            setProfileModificationLoading(false);
            console.log(`inside handleUserProfileModification`)
            if (res.status === 200) {
                console.log(`Profile Modified`)
                console.log(res.data.user);
                // mettre a jour le user state
                setUser(res.data.user);
                setProfileModificationSuccess(true);
            }
            setProfileModificationError("");
        })
            .catch(err => {
            setProfileModificationLoading(false);
            console.log("inside API error");
            console.error(err?.response?.status);
            setProfileModificationError(err.message);
        });
    }

    return (
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            height="75vh"
            minHeight="75vh"
        >
            <Card sx={{minHeight:"50vh", width:"80vh", boxShadow:"0 3px 5px"}} variant="outlined">
                <Box sx={{display:'flex', justifyContent:'space-around', mt:"1rem"}}>
                    <Button variant="outlined" onClick={()=>setActiveComponent("ProfileModificationForm")}> Editer Profile</Button>
                    <Button variant="outlined" onClick={()=>setActiveComponent("Stats")}> Statistiques </Button>
                </Box>
                <CardContent sx={{position:'relative', justifyContent:"center", mt:"2vh"}}>
                    {
                        activeComponent === "ProfileModificationForm" ?
                            <Box>
                                <ProfileModificationForm handleUserProfileModification={handleUserProfileModification} user={user} loading={profileModificationLoading}/>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                    {profileModificationSuccess && <span style={{fontWeight:"bold", color:"green"}}>Succès</span>}
                                    {profileModificationError && <span style={{fontWeight:"bold", color:"red"}}>Erreur de modification de profil</span>}
                                </Box>
                            </Box>
                                :
                            <>
                                <Stats/>
                            </>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}

export default Profile