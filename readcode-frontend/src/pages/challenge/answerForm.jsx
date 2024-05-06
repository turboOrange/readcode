import { useFormik } from 'formik';
import { TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as yup from "yup"

const MIN_ANSWER_LENGTH=20;

const AnswerForm = ({handleEnvoieReponse, loading}) => {
    const validationSchema = yup.object({
        answer: yup
          .string()
          .min(MIN_ANSWER_LENGTH, `La reponse doit avoir ${MIN_ANSWER_LENGTH} caracteres au minimum`)
          .required('Réponse requise')
    });

    const formik = useFormik({
        initialValues: {
            answer:'',
        },
        onSubmit: handleEnvoieReponse,
        validationSchema: validationSchema
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box className="textbox">
                <TextField
                    id="filled-multiline-static"
                    name='answer'
                    label="Réponse"
                    placeholder='Veuillez saisir une réponse'
                    multiline
                    rows={5}
                    variant="filled"
                    fullWidth

                    onChange={formik.handleChange}
                    value={formik.values.answer}
                    error={formik.touched.answer && Boolean(formik.errors.answer)}
                    helperText={formik.touched.answer && formik.errors.answer}
                />
            </Box>
            <LoadingButton loading={loading} type="submit" variant="contained" sx={{width:"30vh", mt:"1vh"}}>Envoyer</LoadingButton>
        </form>
    )
}

export default AnswerForm