import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountdownBox from "./CountdownBox";

type Props = {
    date: string
}

interface TiempoRestante {
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

function CountDown({ date }: Props) {
    const [time, setTime] = useState<TiempoRestante>({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    });
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const intervalo = setInterval(() => {
            const currentDate = new Date().getTime();
            const targetDate = new Date(date).getTime();
            const difference = targetDate - currentDate;

            if (difference <= 0) {
                setFinished(true);
                clearInterval(intervalo);
            } else {
                const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
                const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((difference % (1000 * 60)) / 1000);
                setTime({ dias, horas, minutos, segundos });
            }
        }, 1000);

        return () => clearInterval(intervalo);
    }, [date]);

    if (finished) {
        return (
            <div className="text-center mt-10">
                <h3 className="text-3xl font-bold mb-4 text-amarillo-dorado drop-shadow">¡El torneo ya ha empezado!</h3>
                <Link
                    to="/player/partidos"
                    className="inline-block mt-4 px-6 py-3 bg-amarillo-dorado text-azul-noche font-bold rounded-lg shadow hover:bg-verde-pasto hover:text-blanco-puro transition"
                >
                    Ver partidos
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-10">
            <h3 className="text-2xl font-bold mb-8 text-azul-noche tracking-wide uppercase">¡Faltan para el torneo!</h3>
            <div className="flex gap-4 md:gap-8">
                <CountdownBox number={time.dias}>Días</CountdownBox>
                <CountdownBox number={time.horas}>Horas</CountdownBox>
                <CountdownBox number={time.minutos}>Minutos</CountdownBox>
                <CountdownBox number={time.segundos}>Segundos</CountdownBox>
            </div>
        </div>
    );
}

export default CountDown;