import { useFormik } from 'formik';
import { TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as yup from "yup"

const LoginForm = ({handleUserLogin, loading}) => {
    const validationSchema = yup.object({
        username: yup
          .string()
          .required('Username requis'),
        password: yup
          .string()
          .required('Mot de passe requis'),
    });

    const formik = useFormik({
        initialValues: {
            username:'',
            password:''
        },
        onSubmit: handleUserLogin,
        validationSchema: validationSchema
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}> 
                <TextField
                    id="outlined"
                    label="Utilisateur"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    sx={{
                        mb:1
                    }}
                />
                <TextField
                    id="outlined-password-input"
                    label="Mot de passe"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx = {{
                        mb:1
                    }}
                />
                <LoadingButton loading={loading} type="submit" variant="contained" sx={{width:"30vh"}}>Connexion</LoadingButton>
            </Box>
        </form>
    )
}

export default LoginForm