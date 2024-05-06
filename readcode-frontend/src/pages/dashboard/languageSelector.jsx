import { Autocomplete, TextField, Box } from "@mui/material";

const LanguageSelector = ({languages, handleLanguageChange, selectedLanguage}) => {
    
    const unique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    return (
        <Box sx={{width:"30%", backgroundColor:"white"}}>
            <Autocomplete
                value={selectedLanguage}
                options={languages ? languages : ['']}
                filterOptions={(options,state) => {
                    return options.filter(unique).filter(option => option.toLowerCase().includes(state.inputValue.toLowerCase()))
                }}
                renderInput={(params) => <TextField {...params} label="Rechercher un langage..."/>}
                onChange={handleLanguageChange}
                /*disableClearable={true}*/
                fullWidth={true}
                // si l'utilisateur met "java" au lieu de "Java" dans l'url, on veut que ca match
                // avec "Java" quand meme :
                //      isOptionEqualToValue={}
            />
        </Box>
    )
}

export default LanguageSelector;