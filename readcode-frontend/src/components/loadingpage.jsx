import { Box, Typography } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material"
import { useState } from "react";

const LoadingPage = () => {
    console.log('Loading Page...')

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default LoadingPage