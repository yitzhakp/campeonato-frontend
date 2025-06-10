import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;

};

function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/adminlogin" replace />;
  return children;
}

export default ProtectedRoute;