import type Equipo from "../Types/Equipo";

function TeamCard(team: Equipo) {
    const colorStyle =
        team.color_equipo.length > 1
            ? {
                  background: `repeating-linear-gradient(
                    45deg,
                    ${team.color_equipo[0]},
                    ${team.color_equipo[0]} 6px,
                    ${team.color_equipo[1]} 6px,
                    ${team.color_equipo[1]} 12px
                  )`
              }
            : {
                  backgroundColor: team.color_equipo[0]
              };

    return (
        <div
            key={team.id_equipo}
            className="bg-gris-claro rounded-2xl shadow-md p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h3
                  className=" font-semibold truncate  sm:max-w-[220px] md:max-w-[200px] transition-all"
                  title={team.nombre_equipo}
                  style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
                >
                  {team.nombre_equipo}
                </h3>
                <span
                    className="w-6 h-6 rounded-full border border-black"
                    style={colorStyle}
                ></span>
            </div>
            <p className="text-sm">Curso: {team.curso_equipo}</p>
            <p className="text-sm">Uniforme: {team.uniforme_equipo}</p>
        </div>
    );
}

export default TeamCard;