import { CssBaseline } from '@mui/material';
import { Routes, Route } from "react-router-dom"
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Challenge from './pages/challenge';
import Profile from './pages/profile';
import LoadingPage from './components/loadingpage';
import Admin from './pages/admin';
import axios from 'axios';
import NavBar from './components/navbar';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Il faudrait pouvoir catch un 401 de n'importe quel composant pour rediriger l'utilisateur a l'accueil
  useEffect(() => {
    console.log(`Loaded App.js component`)
    
    const getUser = () => {axios.get("http://localhost:8080/user/authentication/success",{withCredentials:true}
      ).then(res => {
        console.log(`inside App.js /user/authentication/success`)
        console.log(res);
        if (res.status === 200) setUser(res.data.user)
        else {setUser(null); console.log(`DID NOT SET A USER!!`);}
      }).catch(err => {
        console.log(`error checking authentication status user/authentication/success: ${err}`)
        setUser(undefined) // null !== undefined
      })
    }

    getUser();
  }, []);

  const disconnectUser = () => {
      axios.delete("http://localhost:8080/user/logout", {withCredentials:true})
          .then( res => {
              console.log(`Disconnecting user....`)
              console.log(res)
              if (res.status === 204) {
                  setUser(undefined)
                  navigate('/');
              } 
          })
          .catch( err => console.log(`disconnection error : ${err}`))
  };

  const containerStyle = {
    //backgroundImage: 'url(/cool-background.png)',
    backgroundColor: '#373737',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflow: 'hidden'
  };

  return (
    <CssBaseline>
      <div className="app" style={containerStyle}>
        <NavBar className="navbar" user={user} disconnectUser={disconnectUser}/>
        <main className="content" style={{paddingTop:70}}>
          {/* fragile*/}
          {user === null ? (
            <LoadingPage/>
          ) :
          (
            <Routes>
              <Route path="/" element={ <Home/> } />
              <Route path="/login" element={user ? <Navigate to='/dashboard'/> : <Login setUser={setUser}/>} />
              <Route path="/challenge/:id" element={user ? <Challenge user={user}/> : <Navigate to='/login'/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to='/login'/>} />
              <Route path="/profile" element={user ? <Profile user={user} setUser={setUser}/> : <Navigate to='/login'/>}/>
              <Route path="/admin" element={user?.isAdmin ? <Admin/> : <Navigate to='/dashboard'/> }/>
            </Routes>
          )}
        </main>
      </div>
    </CssBaseline>
  );
}


export default App;