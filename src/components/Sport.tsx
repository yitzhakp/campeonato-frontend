import type React from "react";

type Props = {
    src: string,
    children: React.ReactNode
}

function Sport({src, children}: Props) {
    return (
        <>
            <div className="flex flex-col items-center bg-gris-claro p-6 rounded-xl shadow-md">
                <img src={src} alt="Balonmano" className="w-80 h-80 object-contain mb-4" />
                <p className="text-xl font-bold text-verde-pasto">{children}</p>
            </div>
        </>
    )
}

export default Sport;