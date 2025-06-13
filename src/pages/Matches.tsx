import { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseConfig";
import MatchCard from "../components/MatchCard"; // Ajusta la ruta si es necesario

type Equipo = {
    id_equipo: number;
    nombre_equipo: string;
    color_equipo: string[]; // Asegúrate de que este campo existe y es un array de strings
};

type Match = {
    id_partido: number;
    categoria_partido: number;
    jornada_partido: number;
    fecha_partido: string;
    hora_partido: string;
    id_local: number;
    id_visitante: number;
    marcador_local: number;
    marcador_visitante: number;
    estado_partido: number;
};

const FECHAS = [
    "19/07/25",
    "26/07/25",
    "02/08/25",
    "09/08/25",
    "16/08/25",
    "23/08/25",
    "30/08/25",
    "06/09/25",
    "13/09/25",
];

function DateFilter({
    selectedDate,
    setSelectedDate,
}: {
    selectedDate: string;
    setSelectedDate: (f: string) => void;
}) {
    const idx = FECHAS.indexOf(selectedDate);

    const prev = () => {
        if (idx > 0) setSelectedDate(FECHAS[idx - 1]);
    };
    const next = () => {
        if (idx < FECHAS.length - 1) setSelectedDate(FECHAS[idx + 1]);
    };

    return (
        <div className="flex items-center gap-3 justify-center mb-6">
            <button
                onClick={prev}
                disabled={idx === 0}
                className="p-2 rounded-full hover:bg-verde-menta disabled:opacity-50 bg-blanco-puro text-verde-bosque"
            >
                <span aria-label="Anterior" role="img">⬅️</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-verde-menta rounded shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-verde-bosque" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" stroke="currentColor" fill="none" />
                </svg>
                <span className="font-semibold text-verde-bosque">{selectedDate}</span>
            </div>
            <button
                onClick={next}
                disabled={idx === FECHAS.length - 1}
                className="p-2 rounded-full hover:bg-verde-menta disabled:opacity-50 bg-blanco-puro text-verde-bosque"
            >
                <span aria-label="Siguiente" role="img">➡️</span>
            </button>
        </div>
    );
}
export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(FECHAS[0]);

    useEffect(() => {
        setLoading(true);

        // Escuchar cambios en tiempo real en partidos
        const unsubscribePartidos = onSnapshot(collection(db, "partidos"), (partidosSnap) => {
            const partidos: Match[] = [];
            partidosSnap.forEach((doc) => partidos.push(doc.data() as Match));
            setMatches(partidos);
            setLoading(false);
        });

        // Cargar equipos solo una vez (si no cambian seguido)
        async function fetchEquipos() {
            const equiposSnap = await getDocs(collection(db, "equipos"));
            const equiposArr: Equipo[] = [];
            equiposSnap.forEach((doc) => equiposArr.push(doc.data() as Equipo));
            setEquipos(equiposArr);
        }
        fetchEquipos();

        // Limpieza del listener al desmontar
        return () => unsubscribePartidos();
    }, []);

    const getEquipo = (id: number) =>
        equipos.find(e => e.id_equipo === id) || { nombre_equipo: "Equipo desconocido", color_equipo: ["#ccc"] };

    // Filtrar partidos por fecha seleccionada
    const filteredMatches = matches.filter(m => m.fecha_partido === selectedDate);

    // Filtrar por combinaciones de jornada y categoría
    const secciones = [
        { jornada: 0, categoria: 1, titulo: "Balonmano - Junior" },
        { jornada: 0, categoria: 0, titulo: "Fútbol - Junior" },
        { jornada: 1, categoria: 1, titulo: "Balonmano - Senior" },
        { jornada: 1, categoria: 0, titulo: "Fútbol - Senior" },
    ];

    // Obtener el número de fecha del campeonato según la fecha seleccionada
    const fechaNumero = FECHAS.indexOf(selectedDate) + 1;

    if (loading) return <div className="text-center py-8 text-verde-bosque">Cargando partidos...</div>;

    return (
        <div className="max-w-3xl mx-auto py-8 bg-gris-claro text-gris-oscuro">
            <h1 className="text-3xl font-bold mb-8 text-center text-azul-noche">Partidos</h1>
            <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {secciones.map(({ jornada, categoria, titulo }) => {
                const matchesSeccion = filteredMatches.filter(
                    m => m.jornada_partido === jornada && m.categoria_partido === categoria
                );
                return (
                    <section key={titulo} className="mb-8 bg-blanco-puro rounded-xl shadow p-4">
                        <h2 className="text-xl font-bold mb-4 text-verde-pasto border-b-2 border-verde-menta pb-2">{titulo}</h2>
                        {matchesSeccion.length === 0 ? (
                            <div className="text-center text-gris-oscuro">No hay partidos en esta sección.</div>
                        ) : (
                            <div className="flex flex-wrap justify-around gap-5">
                                {matchesSeccion.map((m) => (
                                    <MatchCard
                                        key={m.id_partido}
                                        torneo="Torneo IEA"
                                        grupo={`Fecha ${fechaNumero}`}
                                        hora={m.hora_partido}
                                        marcador_local={m.marcador_local}
                                        marcador_visitante={m.marcador_visitante}
                                        estado_partido={m.estado_partido}
                                        local={{
                                            nombre: getEquipo(m.id_local).nombre_equipo,
                                            colores: getEquipo(m.id_local).color_equipo,
                                        }}
                                        visitante={{
                                            nombre: getEquipo(m.id_visitante).nombre_equipo,
                                            colores: getEquipo(m.id_visitante).color_equipo,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}