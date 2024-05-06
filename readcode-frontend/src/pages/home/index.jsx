import { Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { Box } from "@mui/material"
import "./index.css"

const Home = () => {
    const containerStyle = {
        backgroundImage: 'url(/wallpaper.jpg)',
        backgroundAttachment: 'fixed',
    }

    return (
        <Box className="homepage" style={containerStyle}>
            <div className="homepage-blur">
                <div className="homepage-content">
                    <div className="hero">
                        <img className="logo" src="/logo/logo-no-background.png"></img>
                        <Typography variant="h1" className="h1">
                            Débloquez la Puissance de la Lecture de Code
                        </Typography>
                        <Typography variant="p" className="p">Améliorez vos compétences en programmation avec les leçons interactives et exercices de ReadCode.</Typography>
                        <Button component={Link} to="/login" id="signupButton">Commencer</Button>
                        <section>
                            <h2>Fonctionnalités Clés</h2>
                            <ul>
                                <li><Typography variant="li" className="li">Leçons interactives de lecture de code</Typography></li>
                                <li><Typography variant="li" className="li">Exercices pratiques avec des exemples du monde réel</Typography></li>
                                <li><Typography variant="li" className="li">Suivez votre progression et comparez-la au classement</Typography></li>
                                <li><Typography variant="li" className="li">Forums communautaires pour la discussion et le support</Typography></li>
                            </ul>
                        </section>
                    </div>


                    <div className="desc-container">
                        <div className="desc left">
                            <div className="desc-side-container">
                                <Typography variant="h4">Qu'est-ce que ReadCode?</Typography>
                                <Typography variant="p">
                                    Vous êtes-vous déjà retrouvé dans cette situation: vous êtes intégré sur un projet écrit
                                    dans un langage que vous ne maitrisez pas et votre équipe compte sur vous pour commencer à programmer
                                    le plus tôt possible, mais vous avez de la difficulté à vous familiariser avec le code?
                                    ReadCode vise à éliminer cet enjeu définitivement.
                                    ReadCode est la première plateforme d'apprentissage de programmation en ligne qui se concentre sur l'amélioration des compétences de lecture de code.
                                    La plateforme vise à entrainer vos compétences de lecture de code et à vous aider à suivre votre progression, le tout dans un environnement ludique!
                                </Typography>
                            </div>
                            <div className="rotated-block-desc block-left"></div>
                        </div>

                        <div id="start">
                            <h2>Commencez</h2>
                            <Typography variant="p" className="p">Inscrivez-vous dès maintenant pour commencer <br /> votre parcours vers l'expertise en lecture de code !</Typography>
                            <Button component={Link} to="/register" id="signupButton">S'inscrire</Button>
                        </div>
                        <div className="desc right">
                            <div className="desc-side-container">
                                <Typography variant="h4">Comment ça marche?</Typography>
                                <Typography variant="p">
                                    ReadCode utilise la technlogie ChatGPT développée par OpenAI pour générer des défis de lecture de code personnalisés. Nous utilisons ensuite cette même technologie pour noter votre compréhension dans le but de garder une trace de votre progression.
                                    Le progrès de tous les utilisateurs peut ensuite être consulté et comparé au votre dans le leaderboard.
                                </Typography>
                            </div>
                            <div className="rotated-block-desc block-right"></div>
                        </div>
                        <div className="desc left">
                            <div className="desc-side-container">
                                <Typography variant="h4">Notre mission</Typography>
                                <Typography variant="p">
                                    Nous croyons que la lecture de code est une compétence manquante dans tous les systèmes d'éducation conventionnels ainsi que sur toutes les plateformes d'apprentissage en ligne. C'est pourquoi nous avons notre mission d'aider les programmeurs tant junior que sénior à développer leurs compétences en matière de lecture et de compréhension de code, et ce, peu importe le langage ciblé.
                                </Typography>
                            </div>
                            <div className="rotated-block-desc block-left"></div>
                        </div>
                        <div className="desc right">
                            <div className="desc-side-container">
                                <Typography variant="h4">Notre équipe</Typography>
                                <Typography variant="p">
                                    Nous sommes une équipe d'étudiants en informatique à l'Université du Québec à Montréal (UQÀM). <br/>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Typography>
                            </div>
                            <div className="rotated-block-desc block-right"></div>
                        </div>
                    </div>
                    <footer>
                        <p>&copy; 2023 ReadCode. Tous droits réservés.</p>
                    </footer>
                </div>
                <div className="rotated-block-left"></div>
            </div>
        </Box>

    )
}

export default Home