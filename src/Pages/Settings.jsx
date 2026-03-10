import SettingsForm from '../Components/Settings/SettingsForm'

const Settings = () => {
    return (
        <div className="container mx-auto p-4 max-w-3xl min-h-[80vh] flex flex-col mt-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">Configuración de cuenta</h1>
                <p className="text-base-content/60 italic">Gestiona tu información personal y seguridad</p>
            </header>

            <section className="bg-base-100 shadow-xl rounded-box border border-base-200">
                <SettingsForm />
            </section>
        </div>
    )
}

export default Settings