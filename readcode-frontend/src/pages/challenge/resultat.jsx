import { Box, Typography } from "@mui/material"


const Resultat = ({answerEvaluation}) => { 
    // Remplacer answerEvaluation par feedbackMockParsed dans le return si pas acces a chatGPT
    const feedbackMockParsed = JSON.parse(feedbackMockObject);
    
    return (
        <Box>
            <h1 style={{color:"black", marginTop:"2rem"}}>Évaluation de la réponse : </h1>
            <Typography sx={{fontWeight:"bold"}}>
                Score : {answerEvaluation?.general}
            </Typography>
            <Typography>
                Introduction : {answerEvaluation?.intro}
            </Typography>
            <Typography sx={{fontWeight:"bold"}}>
                Evaluation
            </Typography>
            <Box>
                <Typography sx={{fontWeight:"bold"}}>
                    Justesse : {answerEvaluation?.correctude}
                </Typography>
                {answerEvaluation?.correctudeTxt.map((feedback,index) => (
                    <Typography key={index}>
                        - {feedback}
                    </Typography>
                ))}
            </Box>
            <Box>
                <Typography sx={{fontWeight:"bold"}}>
                    Complétude : {answerEvaluation?.completude}
                </Typography>
                {answerEvaluation?.completudeTxt.map((feedback,index) => (
                    <Typography key={index}>
                        - {feedback}
                    </Typography>
                ))}
            </Box>
            <Box>
                <Typography sx={{fontWeight:"bold"}}>
                    Clareté : {answerEvaluation?.clarete}
                </Typography>
                {answerEvaluation?.clareteTxt.map((feedback,index) => (
                    <Typography key={index}>
                        - {feedback}
                    </Typography>
                ))}
            </Box>
            <Box> 
                <Typography sx={{fontWeight:"bold"}}>
                    Profondeur : {answerEvaluation?.profondeur}
                </Typography>

                {answerEvaluation?.profondeurTxt.map((feedback,index) => (
                    <Typography key={index}>
                        - {feedback}
                    </Typography>
                ))}
            </Box>
            <Box>
                <Typography sx={{fontWeight:"bold"}}> 
                    En général : 
                </Typography>
                <Typography>
                    {answerEvaluation?.generalTxt}
                </Typography>
            </Box>
        </Box>
    )
}

const feedbackMockObject = `{ "score": 82, "comments": { "introduction": "Bienvenue! Voici mon évaluation de votre explication du code en Rust.", "correctness": { "score": "80", "feedback": [ "Votre explication est correcte dans l'ensemble.", "Vous avez bien expliqué que la fonction 'calculate_average' calcule la moyenne des chiffres de l'array 'numbers'.", "Cependant, vous n'avez pas mentionné que la fonction renvoie un nombre à virgule flottante (f32) en tant que résultat." ] }, "completeness": { "score": "90", "feedback": [ "Votre explication est assez complète.", "Vous avez expliqué comment la fonction calcule la somme des chiffres de l'array 'numbers' en utilisant la méthode 'sum' de l'itérateur.", "Vous avez également mentionné que la fonction compte le nombre d'éléments dans 'numbers' en utilisant la méthode 'len'.", "Cependant, vous auriez pu ajouter une explication plus détaillée sur la conversion de la longueur en tant que nombre à virgule flottante (f32)." ] }, "clarity": { "score": "85", "feedback": [ "Votre explication est assez claire dans l'ensemble.", "Vous avez utilisé un langage simple et compréhensible pour expliquer le fonctionnement de la fonction 'calculate_average'.", "Cependant, vous auriez pu fournir plus de détails sur la façon dont la division est effectuée pour obtenir la moyenne." ] }, "depth": { "score": "75", "feedback": [ "Votre explication manque un peu de profondeur.", "Vous auriez pu expliquer davantage pourquoi la conversion de la somme en tant que nombre à virgule flottante est nécessaire pour obtenir une moyenne précise.", "De plus, vous auriez pu mentionner que la fonction 'calculate_average' utilise une référence ('&') pour éviter de déplacer l'array 'numbers' dans la fonction." ] }, "overall": { "score": "82", "feedback": "Dans l'ensemble, vous avez bien expliqué le fonctionnement de la fonction 'calculate_average' en Rust. Votre explication est correcte et assez complète, mais aurait pu être plus détaillée et approfondie. Continuez à approfondir votre compréhension du code et à fournir des explications plus détaillées pour améliorer votre apprentissage." } } }`

export default Resultat