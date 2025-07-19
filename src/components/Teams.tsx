import TeamCard from "./TeamCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type Equipo from "../Types/Equipo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TeamsProps = {
  jornada?: number;
  deporte?: number;
};

function Teams({ jornada, deporte }: TeamsProps) {
  const [teams, setTeams] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const colRef = collection(db, "equipos");
      let q;

      // Aplica filtros si están definidos
      if (jornada !== undefined && deporte !== undefined) {
        q = query(colRef, where("jornada_equipo", "==", jornada), where("deporte_equipo", "==", deporte));
      } else if (jornada !== undefined) {
        q = query(colRef, where("jornada_equipo", "==", jornada));
      } else if (deporte !== undefined) {
        q = query(colRef, where("deporte_equipo", "==", deporte));
      } else {
        q = colRef;
      }

      const querySnapshot = await getDocs(q);
      const equipos: Equipo[] = [];
      querySnapshot.forEach((doc) => {
        equipos.push({ ...doc.data() } as Equipo);
      });
      setTeams(equipos);
      setLoading(false);
    }
    fetchTeams();
  }, [jornada, deporte]);

  if (loading) return <div className="text-center py-8">Cargando equipos...</div>;

  return (
  <div className="flex flex-wrap justify-center gap-6">
    {teams.map((team) => (
      <Link
          key={team.id_equipo}
          to={`/team/${team.id_equipo}`}
          className="flex-[1_1_200px] max-w-xs transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-blanco-puro rounded-2xl no-underline"
        >
          <TeamCard {...team} />
        </Link>
      ))}
  </div>
);
}

export default Teams;