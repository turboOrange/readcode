import {AppBar, Toolbar, Button, Typography} from "@mui/material"
import { Link } from "react-router-dom"

const NavBar = ({user, disconnectUser}) => {

    return (
        <AppBar style={{backgroundColor: "#517982"}}>
            <Toolbar style={{justifyContent:"space-between"}}>
                <Button variant="h6" component={Link} to="/" style={{textDecoration:'none', color:'white', hover: 'none'}}>
                    <img src="/logo/logo-no-background.png" style={{height: '30px', hover: 'none'}}></img>
                </Button>

                <Typography variant="h6" style={{textDecoration:'none', color:'white'}}>
                    Bienvenue {user && user?.name}
                </Typography>
                <Button component={Link} to="/" color="inherit">
                    Accueil
                </Button>
                
                {user ?
                    (<>
                        <Button component={Link} to="/dashboard"  color="inherit">
                            Dashboard
                        </Button>
                        <Button component={Link} to="/profile"  color="inherit">
                            Profile
                        </Button>
                        {
                            user?.isAdmin ?
                            (<Button component={Link} to="/admin" color="inherit">
                                Admin
                            </Button>) 
                                :
                            null
                        }
                        <Button onClick={disconnectUser} color="inherit">
                            Se Déconnecter
                        </Button>
                    </>
                    ) :
                    (<>
                        <Button component={Link} to="/login"  color="inherit">
                            Se Connecter
                        </Button>
                    </>
                    )
                }
            </Toolbar>
        </AppBar>
    ) 
}

export default NavBar