import ChallengePreview from "./challengePreview"
import { Link } from "react-router-dom"
import { Box, CircularProgress, Typography } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import LanguageSelector from "./languageSelector";
import { useNavigate, useLocation } from "react-router-dom"

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [challengePreview, setChallengePreview] = useState(null);
    const [challengePreviewLoading, setChallengePreviewLoading] = useState(false);
    const [challengePreviewError, setChallengePreviewError] = useState("");

    const [languages, setLanguages] = useState(null);
    const [languagesLoading, setLanguagesLoading] = useState(false);
    const [languagesError, setLanguagesError] = useState("");

    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [languageSelected, setLanguageSelected] = useState(false); // language selected from language selector? True/False 

    /**
     * URL methods : 
     * 
     * - get all query params : const searchParams = new URLSearchParams(location.search);
     * - get sepecific query param value : const paramValue = searchParams.get('language');
     * - set url query params : searchParams.set('language', language)
     * - actually navigate to currently set query params : navigate(`${location.pathname}?${searchParams.toString()}`, { replace:true });
     * 
     */
    const getPreviews = (language) => {
        console.log(`LANGUAGE CHOSEN : ${language}`);
        setChallengePreviewLoading(true);
        axios.get(`http://localhost:8080/challenge/previews?language=${encodeURIComponent(language ?? null)}`, {withCredentials: true})
            .then(res => {setChallengePreview(Object.keys(res.data).length === 0 ? null : res.data); setChallengePreviewLoading(false);})
            .catch(err => {setChallengePreviewError(err); setChallengePreviewLoading(false); console.log(err)});
    };

    const getLanguages = () => {
        setLanguagesLoading(true);
        axios.get(`http://localhost:8080/challenge/languages`, {withCredentials: true})
        .then(res => {setLanguages(Object.keys(res.data).length === 0 ? null : res.data); setLanguagesLoading(false);})
        .catch(err => {setLanguagesError(err.message); console.log(err);});
    };

    // only the LanguageSelector runs this function
    const handleLanguageChange = (event, language) => {
        const searchParams = new URLSearchParams(location.search);
        if (language) {
            searchParams.set('language', language);
        }
        else {
            searchParams.delete('language');
        }

        navigate(`${location.pathname}?${searchParams.toString()}`, { replace:true });
        setSelectedLanguage(language);
        setLanguageSelected(true);
    }
    
    // Get previews when : selectedLanguage OR languageSelected state changes
    useEffect(() => {
        console.log(`Getting Previews from language change...`);
        if (languageSelected) {
            console.log(`Detected languageSelected change`)
            getPreviews(selectedLanguage);
        }
    }, [selectedLanguage, languageSelected]);

    // Get previews when : page loads (with or without query params in the url)
    useEffect(() => {
        console.log(`Getting Previews from url...`);
        const urlLanguage = new URLSearchParams(location.search).get('language');
        setSelectedLanguage(urlLanguage); // triggers above useEffect
        setLanguageSelected(true); // also triggers above useEffect
    }, []);

    // Get languages when : page loads
    useEffect(() => {
        console.log(`Getting Languages...`);
        getLanguages();
    }, []);

    return (
        <Box marginTop={5} padding={"2vh"}>
            <Box display="flex">
                <LanguageSelector selectedLanguage={selectedLanguage} handleLanguageChange={handleLanguageChange} languages={languages}/>
                {
                    challengePreviewLoading && <Box ml={"2rem"}><CircularProgress/></Box>
                }
            </Box>

            <Box style={{display:"inline-flex", flexDirection:"row", gap:"2vh"}} flexWrap={"wrap"} marginTop={3}>
                {
                    challengePreview ?
                        challengePreview.map((challenge) => (
                            <Link style={{textDecoration:'none'}} key={challenge.id} to={`/challenge/${challenge.id}`}>
                                <ChallengePreview challenge={challenge}></ChallengePreview>
                            </Link>
                        ))
                            : 
                        (challengePreviewError ? 
                            <Box>
                                <h1>Aucun challenge trouvé...</h1> 
                                <Typography variant="h6" color="#8B0000">{challengePreviewError.message} : {challengePreviewError?.response?.data?.message} </Typography>
                            </Box> 
                                : 
                            null
                        )
                }
            </Box>
        </Box>
    )
}

export default Dashboard