import { useParams } from "react-router-dom";

function Player () {
    const {name} = useParams();
    return (
        <p>Nombre del jugador: {name}</p>
    )
}

export default Player;