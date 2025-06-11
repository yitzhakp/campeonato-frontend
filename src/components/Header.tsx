function Header() {
    return (
        <>
            <img
                src="src/assets/logo_iea.png"
                alt="Logo del Instituto Experimental"
                className="h-12 w-auto rounded"
            />
            <span
                className="text-2xl font-bold text-amarillo-dorado"
                style={{ textShadow: "1px 1px 2px #002B5B" }}
            >
                Campeonato IEA 2025
            </span>
        </>
    )
}

export default Header;