import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebaseConfig";
import { Link } from "react-router-dom";

type Partido = {
    id_partido: number;
    estado_partido: number;
    fecha_partido: string;
    hora_partido: string;
    id_local: number;
    id_visitante: number;
    marcador_local: number;
    marcador_visitante: number;
};

function getEstadoNombre(estado: number) {
    if (estado === 0) return "Por jugar";
    if (estado === 1) return "En vivo";
    return "Finalizado";
}

function Admin() {
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [loading, setLoading] = useState(true);
    const [fechaFiltro, setFechaFiltro] = useState<string>("");

    // Función para recargar partidos (puedes llamarla tras editar un partido si lo deseas)
    const fetchPartidos = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, "partidos"));
        const arr: Partido[] = [];
        snap.forEach(docu => arr.push(docu.data() as Partido));
        setPartidos(arr);
        setLoading(false);
    };

    useEffect(() => {
        fetchPartidos();
    }, []);

    // Obtener todas las fechas únicas para el filtro
    const fechasUnicas = Array.from(new Set(partidos.map(p => p.fecha_partido)));

    // Filtrar partidos por fecha si hay filtro
    const partidosFiltrados = fechaFiltro
        ? partidos.filter(p => p.fecha_partido === fechaFiltro)
        : partidos;

    if (loading) return <div className="text-center py-8">Cargando partidos...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-blanco-puro rounded-xl shadow p-8 border-2 border-verde-pasto">
            <h2 className="text-2xl font-bold mb-6 text-azul-noche">Partidos</h2>
            <div className="mb-4 flex items-center gap-3">
                <label className="font-semibold text-verde-bosque">Filtrar por fecha:</label>
                <select
                    className="rounded-lg border border-verde-pasto px-2 py-1 bg-blanco-puro text-negro-suave"
                    value={fechaFiltro}
                    onChange={e => setFechaFiltro(e.target.value)}
                >
                    <option value="">Todas</option>
                    {fechasUnicas.map(fecha => (
                        <option key={fecha} value={fecha}>{fecha}</option>
                    ))}
                </select>
                <button
                    className="ml-4 bg-verde-pasto text-blanco-puro px-3 py-1 rounded hover:bg-verde-bosque"
                    onClick={fetchPartidos}
                >
                    Refrescar
                </button>
            </div>
            <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-verde-bosque">
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>ID Local</th>
                        <th>ID Visitante</th>
                        <th>Marcador</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {partidosFiltrados.map(p => (
                        <tr
                            key={p.id_partido}
                            className="bg-gris-claro rounded-lg hover:bg-verde-menta cursor-pointer transition"
                        >
                            <td colSpan={6} className="p-0">
                                <Link
                                    to={`/admin/partido/${p.id_partido}`}
                                    className="flex w-full h-full px-2 py-1 items-center no-underline text-negro-suave"
                                >
                                    <span className="w-1/6">{p.fecha_partido}</span>
                                    <span className="w-1/6">{p.hora_partido}</span>
                                    <span className="w-1/6">{p.id_local}</span>
                                    <span className="w-1/6">{p.id_visitante}</span>
                                    <span className="w-1/6">{p.marcador_local} - {p.marcador_visitante}</span>
                                    <span className="w-1/6">{getEstadoNombre(p.estado_partido)}</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;