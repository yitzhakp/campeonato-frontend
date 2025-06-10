import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebaseConfig";
import React, { useState } from "react";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/Admin')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Credenciales incorrectas!")
        }

    }

    return (
        <div>
            <h2>Inicio Sesión</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />

                <button type='submit'>Iniciar sesión</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default AdminLogin;