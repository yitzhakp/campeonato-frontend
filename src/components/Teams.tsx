import TeamCard from "./TeamCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type Equipo from "../Types/Equipo";
import { useEffect, useState } from "react";

function Teams() {
  const [teams, setTeams] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const querySnapshot = await getDocs(collection(db, "equipos"));
      const equipos: Equipo[] = [];
      querySnapshot.forEach((doc) => {
        equipos.push({ id_equipo: doc.id, ...doc.data() } as Equipo);
      });
      setTeams(equipos);
      setLoading(false);
    }
    fetchTeams();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando equipos...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id_equipo} {...team} />
      ))}
    </div>
  );
}

export default Teams;