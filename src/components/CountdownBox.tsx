import type React from "react"

type Props = {
    number: number,
    children: React.ReactNode
}

function CountdownBox({number, children}: Props) {
    return (
        <>
            <div className="flex flex-col items-center bg-verde-menta rounded-xl shadow-lg px-6 py-4 min-w-28">
                <span className="text-4xl md:text-5xl font-extrabold text-verde-pasto">{number}</span>
                <span className="text-xs md:text-sm font-semibold text-verde-pasto mt-1 uppercase">{children}</span>
            </div>
        </>
    )
}

export default CountdownBox