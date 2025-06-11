import { Calendar } from "lucide-react";
import CountDown from "../components/Countdown";
import Sport from "../components/Sport";
import Teams from "../components/Teams";

export default function HomeCampeonato() {
    return (
        <div className="min-h-screen bg-gris-claro text-gris-oscuro">
            {/* Hero Section */}
            <section className="bg-[url('/cancha.jpg')] bg-cover bg-center text-azul-noche py-20 px-6">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold drop-shadow-xl mb-10">Campeonato Intercolegiado 2025</h1>
                    <img src='/trofeo.svg' alt="Balonmano" className="w-60 h-60 lg:w-80 lg:h-80 object-cover rounded-full border-black border" />
                    <p className="text-xl mt-4"> Respeto. Compañerismo. Pasión.</p>
                    <CountDown date="2025-07-19T07:00:00-05:00" />
                </div>
            </section>

            {/* Sección de Deportes */}
            <section className="py-6 px-6 mb-10 bg-blanco-puro rounded-xl">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xl mb-6">
                        Desde hace tiempo, el <strong>Instituto Experimental del Atlántico</strong> ha llevado a cabo un campeonato en la clase de <strong>Educación Física</strong>. Este campeonato es organizado por los estudiantes de undécimo grado. En este, toda la institución participa en un <strong>deporte</strong>, en su respectiva <strong>categoría</strong>.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6 mb-10 bg-blanco-puro">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">DEPORTES</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Sport src="/balonmano.svg">BALONMANO</Sport>
                        <Sport src="/futbol.svg">FÚTBOL</Sport>
                    </div>
                </div>
            </section>

            {/* Sección de Categorías */}
            <section className="py-12 px-6 bg-blanco-puro">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">CATEGORÍAS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex flex-col items-center bg-gris-claro p-6 rounded-xl shadow-md">
                            <p className="text-2xl font-bold text-azul-noche mb-2">Junior</p>
                            <p className="text-lg text-gris-medio">6° y 7°</p>
                        </div>
                        <div className="flex flex-col items-center bg-gris-claro p-6 rounded-xl shadow-md">
                            <p className="text-2xl font-bold text-azul-noche mb-2">Senior</p>
                            <p className="text-lg text-gris-medio">8° a 11°</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Equipos Destacados */}
            <section className="py-12 px-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Equipos Destacados</h2>
                <Teams></Teams>
            </section>

            {/* Sección de próximos partidos */}
            <section className="py-12 px-6 bg-blanco-puro">
                <h2 className="text-3xl font-bold mb-6 text-center">Próximos Partidos</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center gap-4 bg-gris-claro p-4 rounded-xl shadow-sm">
                        <Calendar className="text-azul-noche" />
                        <div>
                            <p className="font-medium">Los Galácticos vs Águilas Blancas</p>
                            <p className="text-sm text-gris-medio">Viernes, 14 de junio - 10:00 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-gris-claro p-4 rounded-xl shadow-sm">
                        <Calendar className="text-azul-noche" />
                        <div>
                            <p className="font-medium">The Legends vs Ledma</p>
                            <p className="text-sm text-gris-medio">Viernes, 14 de junio - 11:00 AM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}