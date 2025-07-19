import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../components/firebaseConfig";

type Evento = {
    tipo: "gol" | "autogol" | "amarilla" | "roja" | "tarjeta_negra" | "inicio" | "medio" | "fin";
    equipo?: "local" | "visitante";
    jugador?: string;
};

type Partido = {
    id_partido: number;
    estado_partido: number;
    fecha_partido: string;
    hora_partido: string;
    id_local: number;
    id_visitante: number;
    eventos?: Evento[];
    marcador_local: number;
    marcador_visitante: number;
};

type Equipo = {
    id_equipo: number;
    nombre_equipo: string;
};

type Jugador = {
    id_jugador: number;
    nombre_jugador: string;
    apellido_jugador: string;
    id_equipo: number;
};

function getEstadoNombre(estado: number) {
    if (estado === 0) return "Por jugar";
    if (estado === 1) return "En vivo";
    return "Finalizado";
}

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

export default function AdminPartido() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [partido, setPartido] = useState<Partido | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [jugadores, setJugadores] = useState<Jugador[]>([]);

    // Evento temporal para el formulario
    const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
        tipo: "gol",
        equipo: "local",
        jugador: "",
    });

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Partido
            const snap = await getDoc(doc(db, "partidos", id!));
            if (snap.exists()) {
                setPartido(snap.data() as Partido);
            } else {
                setError("Partido no encontrado");
                setLoading(false);
                return;
            }
            // Equipos
            const equiposSnap = await getDocs(collection(db, "equipos"));
            const equiposArr: Equipo[] = [];
            equiposSnap.forEach((doc: QueryDocumentSnapshot) => equiposArr.push(doc.data() as Equipo));
            setEquipos(equiposArr);

            // Jugadores
            const jugadoresSnap = await getDocs(collection(db, "jugadores"));
            const jugadoresArr: Jugador[] = [];
            jugadoresSnap.forEach((doc: QueryDocumentSnapshot) => jugadoresArr.push(doc.data() as Jugador));
            setJugadores(jugadoresArr);

            setLoading(false);
        }
        if (id) fetchData();
    }, [id]);

    async function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!partido || !nuevoEvento.tipo) return;

    // Eventos especiales no requieren equipo/jugador
    let evento: Evento = { tipo: nuevoEvento.tipo as Evento["tipo"] };
    if (
        ["gol", "autogol", "amarilla", "roja", "tarjeta_negra"].includes(nuevoEvento.tipo!)
    ) {
        if (!nuevoEvento.equipo || !nuevoEvento.jugador) return;
        evento = {
            tipo: nuevoEvento.tipo as Evento["tipo"],
            equipo: nuevoEvento.equipo as "local" | "visitante",
            jugador: nuevoEvento.jugador,
        };
    }

    const nuevosEventos = [...(partido.eventos || []), evento];

    // Cambiar estado_partido si corresponde
    let nuevoEstado = partido.estado_partido;
    if (nuevoEvento.tipo === "inicio") nuevoEstado = 1;
    if (nuevoEvento.tipo === "fin") nuevoEstado = 2;

    // Calcular el nuevo marcador
    const nuevoMarcador = calcularMarcador(nuevosEventos);

    await updateDoc(doc(db, "partidos", partido.id_partido.toString()), {
        eventos: nuevosEventos,
        estado_partido: nuevoEstado,
        marcador_local: nuevoMarcador.local,
        marcador_visitante: nuevoMarcador.visitante,
    });
    setPartido({
        ...partido,
        eventos: nuevosEventos,
        estado_partido: nuevoEstado,
        marcador_local: nuevoMarcador.local,
        marcador_visitante: nuevoMarcador.visitante,
    });
    setNuevoEvento({ tipo: "gol", equipo: "local", jugador: "" });
}

async function handleDeleteEvento(idx: number) {
    if (!partido || !partido.eventos) return;
    const nuevosEventos = partido.eventos.filter((_, i) => i !== idx);

    // Calcular el nuevo marcador tras eliminar el evento
    const nuevoMarcador = calcularMarcador(nuevosEventos);

    await updateDoc(doc(db, "partidos", partido.id_partido.toString()), {
        eventos: nuevosEventos,
        marcador_local: nuevoMarcador.local,
        marcador_visitante: nuevoMarcador.visitante,
    });
    setPartido({
        ...partido,
        eventos: nuevosEventos,
        marcador_local: nuevoMarcador.local,
        marcador_visitante: nuevoMarcador.visitante,
    });
}

    if (loading) return <div className="text-center py-8">Cargando partido...</div>;
    if (error) return <div className="text-center py-8 text-rojo-alerta">{error}</div>;
    if (!partido) return null;

    const eventos = partido.eventos || [];
    const marcador = calcularMarcador(eventos);

    // Obtener nombres de equipos
    const equipoLocal = equipos.find(e => e.id_equipo === partido.id_local);
    const equipoVisitante = equipos.find(e => e.id_equipo === partido.id_visitante);

    // Jugadores del equipo seleccionado
    const jugadoresEquipo = jugadores.filter(j =>
        j.id_equipo === (nuevoEvento.equipo === "local" ? partido.id_local : partido.id_visitante)
    );

    // Tipos de evento para el select
    const tiposEvento = [
        { value: "gol", label: "Gol" },
        { value: "autogol", label: "Autogol" },
        { value: "amarilla", label: "Tarjeta amarilla" },
        { value: "roja", label: "Tarjeta roja" },
        { value: "tarjeta_negra", label: "Tarjeta negra" },
        { value: "inicio", label: "Inicio del partido" },
        { value: "medio", label: "Medio tiempo" },
        { value: "fin", label: "Final del partido" },
    ];

    // Saber si el evento requiere equipo/jugador
    const requiereEquipoYJugador = ["gol", "autogol", "amarilla", "roja", "tarjeta_negra"].includes(nuevoEvento.tipo!);

    return (
        <div className="max-w-lg mx-auto mt-10 bg-blanco-puro rounded-xl shadow p-8 border-2 border-verde-pasto">
            <button
                className="mb-4 text-verde-pasto hover:underline"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>
            <h2 className="text-2xl font-bold mb-6 text-azul-noche">
                {equipoLocal?.nombre_equipo ?? "Local"} vs {equipoVisitante?.nombre_equipo ?? "Visitante"}
            </h2>
            <div className="mb-4 text-black">
                <div><b>Fecha:</b> {partido.fecha_partido}</div>
                <div><b>Hora:</b> {partido.hora_partido}</div>
                <div><b>Marcador:</b> {marcador.local} - {marcador.visitante}</div>
                <div><b>Estado:</b> {getEstadoNombre(partido.estado_partido)}</div>
            </div>
            <h3 className="font-bold text-verde-bosque mb-2">Eventos</h3>
            <ul className="mb-4">
                {eventos.map((ev, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                        {ev.tipo === "inicio" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Inicio del partido</span>}
                        {ev.tipo === "medio" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Medio tiempo</span>}
                        {ev.tipo === "fin" && <span className="px-2 py-1 rounded bg-verde-menta text-xs">Final del partido</span>}
                        {["gol", "autogol", "amarilla", "roja", "tarjeta_negra"].includes(ev.tipo) && (
                            <>
                                <span className="px-2 py-1 rounded bg-verde-menta text-xs">
                                    {ev.equipo === "local" ? equipoLocal?.nombre_equipo : equipoVisitante?.nombre_equipo}
                                </span>
                                <span className="px-2 py-1 rounded bg-amarillo-dorado text-xs">{ev.tipo === "tarjeta_negra" ? "Tarjeta negra" : ev.tipo}</span>
                                {ev.jugador && <span className="px-2 py-1 rounded bg-black text-xs">{ev.jugador}</span>}
                            </>
                        )}
                        <button
                            className="ml-2 text-rojo-alerta text-xs"
                            onClick={() => handleDeleteEvento(idx)}
                        >Eliminar</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddEvento} className="flex flex-wrap gap-2 mb-6 items-end">
                <select
                    className="rounded border border-verde-pasto px-2 py-1"
                    value={nuevoEvento.tipo}
                    onChange={e => setNuevoEvento(ev => ({
                        ...ev,
                        tipo: e.target.value as Evento["tipo"],
                        // Reset equipo y jugador si es evento especial
                        ...(["inicio", "medio", "fin"].includes(e.target.value) ? { equipo: undefined, jugador: "" } : {})
                    }))}
                >
                    {tiposEvento.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {requiereEquipoYJugador && (
                    <>
                        <select
                            className="rounded border border-verde-pasto px-2 py-1"
                            value={nuevoEvento.equipo}
                            onChange={e => setNuevoEvento(ev => ({ ...ev, equipo: e.target.value as Evento["equipo"], jugador: "" }))}
                        >
                            <option value="local">{equipoLocal?.nombre_equipo ?? "Local"}</option>
                            <option value="visitante">{equipoVisitante?.nombre_equipo ?? "Visitante"}</option>
                        </select>
                        <select
                            className="rounded border border-verde-pasto px-2 py-1"
                            value={nuevoEvento.jugador}
                            onChange={e => setNuevoEvento(ev => ({ ...ev, jugador: e.target.value }))}
                            required
                        >
                            <option value="">Selecciona jugador</option>
                            {jugadoresEquipo.map(j => (
                                <option key={j.id_jugador} value={`${j.nombre_jugador} ${j.apellido_jugador}`}>
                                    {j.nombre_jugador} {j.apellido_jugador}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <button
                    type="submit"
                    className="bg-verde-pasto text-blanco-puro px-4 py-2 rounded hover:bg-verde-bosque"
                >
                    Agregar evento
                </button>
            </form>
            <div>
                <b>Nota:</b> El marcador se calcula automáticamente según los eventos.
            </div>
        </div>
    );
}