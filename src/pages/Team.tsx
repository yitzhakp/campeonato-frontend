import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseConfig";
import MatchCard from "../components/MatchCard";

type Equipo = {
    id_equipo: number;
    nombre_equipo: string;
    color_equipo: string[];
    curso_equipo: number;
    deporte_equipo: number;
    jornada_equipo: number;
    uniforme_equipo: string;
};

type Jugador = {
    id_jugador: number;
    nombre_jugador: string;
    apellido_jugador: string;
    dorsal_jugador?: number | null;
    id_equipo: number;
};

type Partido = {
    id_partido: number;
    categoria_partido: number;
    estado_partido: number;
    fecha_partido: string;
    hora_partido: string;
    id_local: number;
    id_visitante: number;
    jornada_partido: number;
    marcador_local: number;
    marcador_visitante: number;
};

function getDeporteNombre(deporte: number) {
    return deporte === 1 ? "Balonmano" : "Fútbol";
}
function getJornadaNombre(jornada: number) {
    return jornada === 0 ? "Junior" : "Senior";
}

export default function Team() {
    const { id } = useParams();
    const [team, setTeam] = useState<Equipo | null>(null);
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [loading, setLoading] = useState(true);
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Obtener equipo actual
            const equipoSnap = await getDoc(doc(db, "equipos", id!));
            // Obtener todos los equipos
            const equiposSnap = await getDocs(collection(db, "equipos"));
            const equiposArr: Equipo[] = [];
            equiposSnap.forEach(doc => equiposArr.push(doc.data() as Equipo));
            setEquipos(equiposArr);

            if (equipoSnap.exists()) {
                setTeam(equipoSnap.data() as Equipo);
                // Jugadores
                const jugadoresSnap = await getDocs(
                    query(collection(db, "jugadores"), where("id_equipo", "==", Number(id)))
                );
                const jugadoresArr: Jugador[] = [];
                jugadoresSnap.forEach(doc => jugadoresArr.push(doc.data() as Jugador));
                setJugadores(jugadoresArr);

                // Partidos donde el equipo es local o visitante
                const partidosSnap = await getDocs(
                    query(
                        collection(db, "partidos"),
                        where("id_local", "in", [Number(id)]),
                    )
                );
                const partidosSnap2 = await getDocs(
                    query(
                        collection(db, "partidos"),
                        where("id_visitante", "in", [Number(id)]),
                    )
                );
                const partidosArr: Partido[] = [];
                partidosSnap.forEach(doc => partidosArr.push(doc.data() as Partido));
                partidosSnap2.forEach(doc => partidosArr.push(doc.data() as Partido));
                setPartidos(partidosArr);
            }
            setLoading(false);
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-8">Cargando equipo...</div>;
    if (!team) return <div className="text-center py-8">Equipo no encontrado</div>;

    // Para el círculo de colores, solo usa style si hay dos colores
    const colorStyle =
        team.color_equipo.length > 1
            ? {
                background: `repeating-linear-gradient(
                    45deg,
                    ${team.color_equipo[0]},
                    ${team.color_equipo[0]} 8px,
                    ${team.color_equipo[1]} 8px,
                    ${team.color_equipo[1]} 16px
                  )`,
            }
            : { backgroundColor: team.color_equipo[0] };

    function getEquipoInfo(idEquipo: number): { nombre: string; colores: string[] } {
        const eq = equipos.find(e => e.id_equipo === idEquipo);
        return eq
            ? { nombre: eq.nombre_equipo, colores: eq.color_equipo }
            : { nombre: "Equipo", colores: ["#ccc"] };
    }

    function getResultado(partido: Partido): "V" | "E" | "D" | null {
        const esLocal = partido.id_local === team?.id_equipo;
        const golesPropios = esLocal ? partido.marcador_local : partido.marcador_visitante;
        const golesRival = esLocal ? partido.marcador_visitante : partido.marcador_local;
        if (partido.estado_partido !== 2) return null;
        if (golesPropios > golesRival) return "V";
        if (golesPropios < golesRival) return "D";
        return "E";
    }

    function parseFecha(fecha: string) {
        // Convierte "19/07/25" a "2025-07-19" para comparar correctamente
        const [d, m, y] = fecha.split("/");
        return new Date(`20${y}-${m}-${d}`);
    }

    return (
        <div className="max-w-2xl mx-auto rounded-3xl shadow-2xl p-10 mt-10 bg-gradient-to-br from-verde-menta to-blanco-puro border-2 border-azul-noche">
            <div className="flex justify-center items-center gap-6 mb-6">
                <span
                    className="w-20 h-20 rounded-full shadow-lg flex-shrink-0 border-2 border-black"
                    style={colorStyle}
                    title="Colores del equipo"
                ></span>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-azul-noche">
                        {team.nombre_equipo}
                    </h1>
                    <div className="flex gap-2 mt-1">
                        <span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-amarillo-dorado text-negro-suave">
                            {getDeporteNombre(team.deporte_equipo)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold shadow bg-verde-pasto text-blanco-puro">
                            {getJornadaNombre(team.jornada_equipo)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mb-4 flex flex-wrap justify-around">
                <p className=" mb-1">
                    <span className="font-bold text-azul-noche">Curso: {team.curso_equipo}</span>
                </p>
                <p className=" mb-1">
                    <span className="font-bold text-azul-noche">Uniforme: {team.uniforme_equipo}</span>
                </p>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-3 border-b-2 pb-1 text-verde-bosque border-verde-bosque">
                    Jugadores
                </h2>
                <ul className="flex flex-wrap justify-center gap-5 ">
                    {jugadores.length === 0 && (
                        <li className="text-gray-500 italic">No hay jugadores registrados.</li>
                    )}
                    {jugadores.map(j => (
                        <li
                            key={j.id_jugador}
                            className=" w-60 flex items-center gap-3 bg-gris-claro rounded-lg px-4 py-2 shadow border-l-8 border-azul-noche"
                        >
                            <span className="font-bold text-lg w-8 text-center text-azul-noche">
                                {j.dorsal_jugador ?? "-"}
                            </span>
                            <span className="flex-1">
                                <span className="font-semibold text-negro-suave">
                                    {j.nombre_jugador} {j.apellido_jugador}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-3 border-b-2 pb-1 text-verde-bosque border-verde-bosque">
                    Partidos del equipo
                </h2>
                <ul className="space-y-4">
                    {partidos.length === 0 && (
                        <li className="text-gray-500 italic">No hay partidos jugados.</li>
                    )}
                    {partidos
                        .sort((a, b) => parseFecha(a.fecha_partido).getTime() - parseFecha(b.fecha_partido).getTime())
                        .map((p) => {
                            const resultado = getResultado(p);
                            const localInfo = getEquipoInfo(p.id_local);
                            const visitanteInfo = getEquipoInfo(p.id_visitante);
                            return (
                                <li key={p.id_partido} className="flex items-center gap-3">

                                    <div className="flex-1">
                                        <MatchCard
                                            hora={p.hora_partido}
                                            fecha={p.fecha_partido} // <-- pasa la fecha aquí
                                            local={localInfo}
                                            visitante={visitanteInfo}
                                            marcador_local={p.marcador_local}
                                            marcador_visitante={p.marcador_visitante}
                                            estado_partido={p.estado_partido}
                                            resultado={resultado}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </div>

        </div>

    );
}