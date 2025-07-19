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
        } catch (err) {
            setError("Credenciales incorrectas!")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-blanco-puro rounded-2xl shadow-lg p-8 w-full max-w-sm border-2 border-verde-pasto">
                <h2 className="text-2xl font-bold text-center mb-6 text-azul-noche">Inicio Sesión</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gris-claro focus:outline-none focus:border-verde-pasto bg-gris-claro text-negro-suave"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gris-claro focus:outline-none focus:border-verde-pasto bg-gris-claro text-negro-suave"
                        required
                    />
                    <button
                        type='submit'
                        className="bg-verde-pasto text-blanco-puro font-bold py-2 rounded-lg hover:bg-verde-bosque transition-colors"
                    >
                        Iniciar sesión
                    </button>
                </form>
                {error && <p className="mt-4 text-center text-rojo-alerta font-semibold">{error}</p>}
            </div>
        </div>
    );
}

export default AdminLogin;