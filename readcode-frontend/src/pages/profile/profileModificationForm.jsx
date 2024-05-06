import { useFormik } from 'formik';
import { TextField, Box } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import * as yup from "yup";

const ProfileModificationForm = ({handleUserProfileModification, user, loading}) => {
    const validationSchema = yup.object({
        name: yup
            .string()
            .required(),
        email: yup
            .string()
            .email('Votre email est invalide')
            .required('Email requis'),
        username: yup
            .string()
            .min(4, `Nom d'utilisateur doit avoir 4 caracteres au minimum`)
            .required(),
        password: yup
            .string()
            .min(3, 'Mot de passe doit avoir 3 caracteres au minimum')
            .required('Mot de passe requis'),
        confirmPassword: yup
            .string()
            .min(3, 'Mot de passe doit avoir 3 caracteres au minimum')
            .required('Confirmation de mot de passe requise'),
    });

    const formik = useFormik({
        initialValues: {
            ...user,
            password:'',
            confirmPassword:'',
        },
        onSubmit: handleUserProfileModification,
        validationSchema: validationSchema
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}> 
                <TextField
                    id="outlined"
                    label="Nom"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{
                        mb:1
                    }}
                />
                <TextField
                    id="outlined"
                    label="Courriel"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{
                        mb:1
                    }}
                />
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
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx = {{
                        mb:1
                    }}
                />
                <TextField
                    id="outlined-password-input"
                    label="Confirmer mot de passe"
                    name="confirmPassword"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    sx = {{
                        mb:1
                    }}
                />
                {/*Redirect to /login when response is OK from the backend*/}
                <LoadingButton loading={loading} type="submit" variant="contained" sx={{width:"30vh"}}>ENREGISTRER</LoadingButton>
            </Box>
        </form>
    )
}

export default ProfileModificationForm