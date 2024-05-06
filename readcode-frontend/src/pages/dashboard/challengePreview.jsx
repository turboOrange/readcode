import { Box, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material"

const ChallengePreview = ({challenge}) => {
    //

    return (
        <Card sx={{":hover":{color:"orange"}, minHeight:"30vh", width:"30vh", boxShadow:"0 3px 5px"}} variant="outlined">
            <CardContent>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography align="center" fontSize={"3vh"} marginBottom={"6vh"} fontWeight={"bold"}>
                        Challenge #{challenge?.id}
                    </Typography>
                    <Typography fontSize={"2vh"}>
                        Langage : {challenge?.langage}
                    </Typography>
                    <Typography fontSize={"2vh"}>
                        Niveau : {challenge?.difficulte}
                    </Typography>
                    <Typography fontSize={"2vh"}>
                        {challenge?.preview}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default ChallengePreview;