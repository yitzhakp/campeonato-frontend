type TeamInfo = {
    nombre: string;
    colores: string[];
};

type MatchCardProps = {
    torneo: string;
    grupo?: string;
    hora: string;
    local: TeamInfo;
    visitante: TeamInfo;
    marcador_local: number;
    marcador_visitante: number;
    estado_partido: number; // 0: no iniciado, 1: en vivo, 2: finalizado
};

function TeamCircle({ colores }: { colores: string[] }) {
    const colorStyle =
        colores.length > 1
            ? {
                background: `repeating-linear-gradient(
            45deg,
            ${colores[0]},
            ${colores[0]} 6px,
            ${colores[1]} 6px,
            ${colores[1]} 12px
          )`
            }
            : {
                backgroundColor: colores[0]
            };
    return (
        <span
            className="w-5 h-5 rounded-full border border-negro-suave inline-block"
            style={colorStyle}
        ></span>
    );
}

export default function MatchCard({
    torneo,
    grupo,
    hora,
    local,
    visitante,
    marcador_local,
    marcador_visitante,
    estado_partido,
}: MatchCardProps) {
    // Lógica para estilos de equipos según estado
    let localClass = "text-verde-bosque font-semibold";
    let visitanteClass = "text-verde-bosque font-semibold";
    const marcadorClass = "text-verde-pasto font-bold";
    let statusContent = (
        <span className="text-sm text-verde-bosque font-bold">{hora}</span>
    );

    if (estado_partido === 1) {
        // En vivo

        statusContent = (
            <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rojo-alerta animate-pulse"></span>
                <span className="text-rojo-alerta font-bold uppercase text-xs">En vivo</span>
            </span>
        );
    } else if (estado_partido === 2) {

        if (marcador_local > marcador_visitante) {
            localClass += " font-extrabold";
            visitanteClass += " opacity-60";
        } else if (marcador_local < marcador_visitante) {
            visitanteClass += " font-extrabold";
            localClass += " opacity-60";
        } else {
            localClass += " opacity-60";
            visitanteClass += " opacity-60";
        }
        statusContent = (
            <div className="flex flex-col text-center text-verde-bosque font-bold">
                <span>{hora}</span>
                <div className="mt-2">
                    Finalizado
                </div>
            </div>
        );
    } else {
        // No iniciado
        statusContent = (
            <span className="text-sm text-verde-bosque font-bold">{hora}</span>
        );
    }

    return (
        <div className="bg-verde-menta rounded-xl flex items-center px-4 py-3 gap-4 text-gris-oscuro shadow border border-verde-pasto">
            <div className="flex-1">
                <div className="text-xs font-bold text-azul-noche">
                    {torneo}
                    {grupo && <>, <span className="font-normal text-verde-pasto">{grupo}</span></>}
                </div>
                {/* Equipos */}
                <div className="flex items-center gap-2 mt-2">
                    {statusContent}
                    <div className="flex flex-col gap-2 ml-4">
                        <div className="flex justify-between gap-3">
                            <div className={`flex items-center gap-2 ${localClass}`}>
                                <TeamCircle colores={local.colores} />
                                <span className="text-sm">{local.nombre}</span>
                            </div>
                            {estado_partido !== 0 && (
                                <span className={estado_partido === 1 ? "text-rojo-alerta font-bold text-lg" : marcadorClass}>
                                    {marcador_local}
                                </span>

                            )}
                        </div>
                        <div className="flex justify-between gap-3">

                            <div className={`flex  items-center gap-2 ${visitanteClass}`}>
                                <TeamCircle colores={visitante.colores} />
                                <span className="text-sm">{visitante.nombre}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                {estado_partido !== 0 && (
                                    <span className={estado_partido === 1 ? "text-rojo-alerta font-bold text-lg" : marcadorClass}>
                                        {marcador_visitante}
                                    </span>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}