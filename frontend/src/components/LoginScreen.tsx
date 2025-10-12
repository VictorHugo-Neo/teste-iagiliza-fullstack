import {useState} from 'react'; // react state hook

interface LoginScreenProps { // props interface for login screen
    onLogin: (email: string, password: string) => void;
}
export function LoginScreen({onLogin}: LoginScreenProps){ // login screen component
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleLoginClick = () => { // handle login button click
        onLogin(email, password);
    }
    return ( // simple login form
        <div style={{ padding: 20}}>
            <h2>Login</h2>
            <input
                placeholder='Email'
                value ={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                placeholder='Senha'
                type = 'password'
                value = {password}
                onChange ={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLoginClick}>Entrar</button>
        </div>
    )
}