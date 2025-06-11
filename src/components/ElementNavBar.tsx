import { Link } from 'react-router-dom'

type ElementNavBarProps = {
    to: string
    children: React.ReactNode
}

function ElementNavBar({ to, children }: ElementNavBarProps) {
    return (
        <Link to={to}
            className="font-medium transition-colors px-2 py-1 rounded
                  text-amarillo-dorado hover:text-verde-pasto hover:bg-amarillo-dorado hover:shadow"
        >
            {children}
        </Link>
    )
}

export default ElementNavBar;