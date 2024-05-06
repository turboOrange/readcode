import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { TextField, Card, CardContent, Paper, CircularProgress } from "@mui/material"
import { LoadingButton } from "@mui/lab";
import AnswerForm from "./answerForm";
import Resultat from "./resultat";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Challenge = ({user}) => {
    const [challenge, setChallenge] = useState(null);
    const [challengeLoading, setChallengeLoading] = useState(false);
    const [challengeRequestError, setChallengeRequestError] = useState("");

    const [challengeDeletion, setChallengeDeletion] = useState("");
    const [challengeDeletionLoading, setChallengeDeletionLoading] = useState(false);
    const [challengeDeletionError, setChallengeDeletionError] = useState("");

    const [answerEvaluation, setAnswerEvaluation] = useState();
    const [answerEvaluationLoading, setAnswerEvaluationLoading] = useState();
    const [evaluationRequestError, setEvaluationRequestError] = useState("");

    // id correspondant au challenge selectionne dans le dashboard
    const {id} = useParams();
    const navigate = useNavigate();

    // on appelle le backend pour obtenir le challenge lors du chargement de la page
    useEffect(() => {        
        setChallengeLoading(true);
        axios.get(`http://localhost:8080/challenge/${id}`, {withCredentials: true})
        .then(res => {setChallenge(res.data?.challenge); setAnswerEvaluation(res.data?.userChallenge); setChallengeLoading(false)})
        .catch(err => {setChallengeRequestError(err.message); setChallengeLoading(false); console.log(err);});
    }, []);

    const handleEnvoieReponse = (userAnswer) => {
        console.log(`userAnswer : ${JSON.stringify(userAnswer.answer, 2, null)}`)
        setAnswerEvaluationLoading(true);
        axios.post(`http://localhost:8080/challenge/${id}/evaluation`,  
            {answer : userAnswer.answer},
            {withCredentials: true})
            .then(res => {setAnswerEvaluation(res.data); setAnswerEvaluationLoading(false); setEvaluationRequestError(null);})
            .catch(err => {console.log(err); setEvaluationRequestError(err.response.data.message); setAnswerEvaluationLoading(false);});
    };

    const handleChallengeDeletion = () => {
        console.log(`deleting challenge`);
        setChallengeDeletionLoading(true);
        axios.delete(`http://localhost:8080/challenge/${id}`, {withCredentials: true})
        .then(res => {
            setChallengeDeletionLoading(false);
            setChallengeDeletion(res.data);
            console.log(`status : ${res.status}`);
            if (res.status === 200) {
                navigate('/dashboard'); //rediriger vers le dashboard si challenge efface avec succes
            } 
        })
        .catch(err => {setChallengeDeletionError(err.message); setChallengeDeletionLoading(false); console.log(err);});  
    };

    return (
        <Box display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%">
            <Card variant="outlined" sx={{width:"90%", height:"95%", overflow:"auto", boxShadow:"0 3px 5px"}}>
                <CardContent>
                    <Paper elevation={3} sx={{width:"100%", height:"100%", mb:3, overflow:"auto"}}>
                        {challenge && 
                            <Box display="flex" justifyContent={"space-between"} alignItems={"center"}>
                                <h1 style={{marginLeft:"3vh", color:"black"}}>Problème {challenge?.langage} ({challenge?.difficulte}): </h1>
                                { user?.isAdmin ? (
                                        <LoadingButton variant="contained" onClick={handleChallengeDeletion} loading={challengeDeletionLoading} sx={{color:"white",backgroundColor:"red", ":hover":{backgroundColor:"#8B0000"}}}>
                                            DELETE
                                        </LoadingButton>
                                    ) :
                                        null
                                }
                            </Box>
                        }
                        {challengeLoading && <Box display="flex" justifyContent="center" alignItems="center"><CircularProgress/></Box>}
                        {challengeRequestError && <span>{challengeRequestError}</span>}
                        {challengeDeletionError && <span color="red" fontWeight="bold">Erreur d'effacage du challenge : {challengeDeletionError}</span>}
                        <Box margin={3}>
                            {challenge?.enonce &&
                                <SyntaxHighlighter language="Java" style={a11yDark}>
                                    {challenge?.enonce}
                                </SyntaxHighlighter>
                            }
                        </Box>
                    </Paper>
                    <AnswerForm handleEnvoieReponse={handleEnvoieReponse} loading={answerEvaluationLoading}/>
                    {/*<LoadingButton loading={answerEvaluationLoading} onClick={handleEnvoieReponse} variant="contained" sx={{width:"30vh", mt:"1vh"}}>Envoyer</LoadingButton>*/}
                    <Box>
                        {/* Le component Resultat formatte la reponse correctement : Resultat(answerEvaluation)*/}
                        {answerEvaluation && <Resultat answerEvaluation={answerEvaluation}/>}
                        {evaluationRequestError && JSON.stringify(evaluationRequestError, 2, null)}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Challenge