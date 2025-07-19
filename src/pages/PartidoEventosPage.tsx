import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebaseConfig";

type Evento = {
    tipo: "gol" | "autogol" | "amarilla" | "roja" | "tarjeta_negra" | "inicio" | "medio" | "fin";
    equipo?: "local" | "visitante";
    jugador?: string;
};

type Partido = {
    id_partido: number;
    id_local: number;
    id_visitante: number;
    fecha_partido: string;
    hora_partido: string;
    eventos?: Evento[];
};

type Equipo = {
    id_equipo: number;
    nombre_equipo: string;
};

function calcularMarcador(eventos: Evento[]) {
    let local = 0, visitante = 0;
    for (const ev of eventos) {
        if (ev.tipo === "gol") {
            if (ev.equipo === "local") local++;
            else if (ev.equipo === "visitante") visitante++;
        }
        if (ev.tipo === "autogol") {
            if (ev.equipo === "local") visitante++;
            else if (ev.equipo === "visitante") local++;
        }
    }
    return { local, visitante };
}

export default function PartidoEventosPage() {
    const { id } = useParams<{ id: string }>();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [partido, setPartido] = useState<Partido | null>(null);
    const [equipoLocal, setEquipoLocal] = useState<Equipo | null>(null);
    const [equipoVisitante, setEquipoVisitante] = useState<Equipo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const snap = await getDoc(doc(db, "partidos", id!));
            if (!snap.exists()) {
                setLoading(false);
                return;
            }
            const partidoData = snap.data() as Partido;
            setPartido(partidoData);
            setEventos(partidoData.eventos || []);

            // Cargar nombres de equipos
            const localSnap = await getDoc(doc(db, "equipos", partidoData.id_local.toString()));
            const visitanteSnap = await getDoc(doc(db, "equipos", partidoData.id_visitante.toString()));
            setEquipoLocal(localSnap.exists() ? (localSnap.data() as Equipo) : null);
            setEquipoVisitante(visitanteSnap.exists() ? (visitanteSnap.data() as Equipo) : null);

            setLoading(false);
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-8">Cargando eventos...</div>;
    if (!partido) return <div className="text-center py-8 text-rojo-alerta">Partido no encontrado.</div>;

    // ¿Hay evento de inicio?
    const hayInicio = eventos.some(ev => ev.tipo === "inicio");
    const marcador = calcularMarcador(eventos);

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 bg-blanco-puro rounded-xl shadow border border-verde-pasto mt-8">
            <Link to="/partidos" className="text-verde-pasto hover:underline mb-4 inline-block">← Volver a partidos</Link>
            <h1 className="text-2xl font-bold mb-2 text-azul-noche text-center">
                {equipoLocal?.nombre_equipo ?? "Local"} vs {equipoVisitante?.nombre_equipo ?? "Visitante"}
            </h1>
            <div className="text-center text-gris-oscuro mb-2">
                <span className="mr-4"><b>Fecha:</b> {partido.fecha_partido}</span>
                <span><b>Hora:</b> {partido.hora_partido}</span>
            </div>
            {hayInicio && (
                <div className="flex justify-center items-center mb-6">
                    <span className="bg-verde-menta text-azul-noche font-bold text-xl px-6 py-2 rounded-full shadow border border-verde-pasto">
                        {marcador.local} - {marcador.visitante}
                    </span>
                </div>
            )}
            <h3 className="font-bold text-verde-bosque mb-2 text-lg">Eventos del partido</h3>
            {eventos.length === 0 ? (
                <div className="text-center text-gris-oscuro">Sin eventos registrados.</div>
            ) : (
                <ul>
                    {eventos.map((ev, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-1 text-negro-suave">
                            {ev.tipo === "inicio" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Inicio del partido</span>}
                            {ev.tipo === "medio" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Medio tiempo</span>}
                            {ev.tipo === "fin" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Final del partido</span>}
                            {["gol", "autogol", "amarilla", "roja", "tarjeta_negra"].includes(ev.tipo) && (
                                <>
                                    <span className="px-2 py-1 rounded bg-verde-menta text-xs">
                                        {ev.equipo === "local"
                                            ? equipoLocal?.nombre_equipo ?? "Local"
                                            : equipoVisitante?.nombre_equipo ?? "Visitante"}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-amarillo-dorado text-xs">
                                        {ev.tipo === "tarjeta_negra"
                                            ? "Tarjeta negra"
                                            : ev.tipo.charAt(0).toUpperCase() + ev.tipo.slice(1)}
                                    </span>
                                    {ev.jugador && (
                                        <span className="px-2 py-1 rounded bg-gris-claro text-xs text-azul-noche">{ev.jugador}</span>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}