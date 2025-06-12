import CountDown from "../components/Countdown";
import Sport from "../components/Sport";
import Teams from "../components/Teams";

export default function HomeCampeonato() {
    return (
        <div className="min-h-screen w-full bg-gris-claro text-gris-oscuro">
            {/* Hero Section */}
            <section className="bg-[url('/cancha.jpg')] bg-cover bg-center text-azul-noche py-8 px-6">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
                    <img src='/trofeo.svg' alt="Balonmano" className="w-40 h-40 lg:w-60 lg:h-60 object-cover rounded-full border-black border" />
                    <p className="text-xl mt-4"> Respeto. Compañerismo. Pasión.</p>
                    <CountDown date="2025-07-19T07:00:00-05:00" />
                </div>
            </section>

            {/* Sección de Deportes */}
            <section className="py-6 px-6 mb-10 bg-verde-menta rounded-xl text-center">
                <h1 className="text-5xl font-bold drop-shadow-xl mb-10">Campeonato Intercursos 2025</h1>
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xl mb-6">
                        Desde hace tiempo, el <strong>Instituto Experimental del Atlántico</strong> ha llevado a cabo un campeonato en la clase de <strong>Educación Física</strong>. Este campeonato es organizado por los estudiantes de undécimo grado. En este, toda la institución participa en un <strong>deporte</strong>, en su respectiva <strong>categoría</strong>.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6 mb-10 bg-verde-menta rounded-xl">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">DEPORTES</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Sport src="/balonmano.svg">BALONMANO</Sport>
                        <Sport src="/futbol.svg">FÚTBOL</Sport>
                    </div>
                </div>
            </section>

            {/* Sección de Categorías */}
            <section className="py-12 px-6 bg-verde-menta rounded-xl" >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">EQUIPOS</h2>
                    <section className="py-12 px-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Balonmano Junior</h2>
                        <Teams deporte={1} jornada={0}></Teams>
                    </section>

                    <section className="py-12 px-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Balonmano Senior</h2>
                        <Teams deporte={1} jornada={1}></Teams>
                    </section>

                    <section className="py-12 px-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Fútbol Junior</h2>
                        <Teams deporte={0} jornada={0}></Teams>
                    </section>

                    <section className="py-12 px-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Fútbol Senior</h2>
                        <Teams deporte={0} jornada={1}></Teams>
                    </section>
                </div>
            </section>
        </div>
    );
}