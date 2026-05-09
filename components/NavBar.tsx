import '@/app/globals.css'

export default function NavBar() {
    return (
        <div className="navbar">
            <a href={`/families`}>Families</a>
            |
            <a href={`/monsters`}>Monsters</a>
            |
            <a href={`/moves`}>Skills</a>
            |
            <a href={`/locations`}>Locations</a>
        </div>
    )
}