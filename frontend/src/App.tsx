import { useState } from 'react'
import axios from 'axios'
import { LoginScreen } from './pages/LoginScreen' // import login screen component



const API = "http://localhost:4000"; // conect server backend

function App(){ // main app function
  const [token, setToken] = useState<string | null>(null); // state to store auth token
  async function login(email: string, password: string){
    try{ 
      const res = await axios.post(`${API}/login`, {email, password});
      console.log("Token:", res.data.token); // browser log test
      setToken(res.data.token);
    } catch(error){ // error handling
      console.error('Login failed', error);
      alert("Falha no Login. Verifique o console")
    }
  }

  if(!token){ // if no token, show login screen
    return <LoginScreen onLogin={login} />
  }
  return ( // if token exists, show token
      <div style={{padding:20}}>
        <h2>Login bem-sucedido!</h2>
        <p>Token de autenticação é: </p>
        <p style ={{wordBreak: "break-all"}}>{token}</p> // display token with word break for long strings
      </div>
    );
}
export default App;
