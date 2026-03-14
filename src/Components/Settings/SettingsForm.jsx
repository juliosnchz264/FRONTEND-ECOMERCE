import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from '../../Hooks/useUser.js'
import toast from 'react-hot-toast'
import { updateProfileService } from '../../services/userServices' // ✅ Import correcto

// 🚩 Limpiamos la URL para apuntar a la raíz (donde vive /uploads)
const baseServerUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

const SettingsForm = () => {
    const { userInfo, setUserInfo } = useUser()
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: userInfo?.username,
            email: userInfo?.email
        }
    })

    // 🚩 Lógica para determinar qué imagen mostrar
    const getAvatarSrc = () => {
        if (preview) return preview; // Base64 de la previsualización local
        if (userInfo?.avatar) {
            // Si la ruta ya es absoluta (http), la dejamos; si es relativa (/uploads), le ponemos la base
            return userInfo.avatar.startsWith('http') 
                ? userInfo.avatar 
                : `${baseServerUrl}${userInfo.avatar}`;
        }
        // Fallback: iniciales
        return `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=random`;
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        const MAX_SIZE = 2 * 1024 * 1024 

        if (!allowedTypes.includes(file.type)) {
            toast.error("Solo JPG, PNG o WebP")
            e.target.value = ""
            return
        }

        if (file.size > MAX_SIZE) {
            toast.error("El archivo supera los 2MB")
            e.target.value = ""
            return
        }

        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // ✅ CORREGIDO: usar updateProfileService en lugar de updateUserService
            const result = await updateProfileService(data, selectedFile);

            if (result.success && result.user) {
                // Actualizamos el contexto global
                setUserInfo(prev => ({
                    ...prev,
                    ...result.user
                }));
                
                // 🚩 Actualizamos localStorage para persistencia al recargar
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...result.user }));
                
                toast.success(result.message);
                setPreview(null); // Limpiamos la preview después de guardar con éxito
                setSelectedFile(null);
            } else {
                toast.error(result.message || "Error al actualizar");
            }
        } catch (error) {
            console.error('Error en onSubmit:', error);
            toast.error(error.message || "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-6">
            {/* SECCIÓN AVATAR */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-base-200">
                <div className="avatar">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                        <img 
                            src={getAvatarSrc()} 
                            alt="Avatar preview" 
                            className="object-cover w-full h-full"
                            // 🚩 Si la imagen del servidor falla, cargamos las iniciales
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username}`;
                            }}
                        />
                    </div>
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label font-semibold py-1">Cambiar foto de perfil</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-primary file-input-sm w-full" 
                    />
                    <span className="text-[10px] opacity-50 mt-1">Máx 2MB (JPG, PNG, WebP)</span>
                </div>
            </div>

            {/* SECCIÓN DATOS PERSONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label font-semibold">Nombre de usuario</label>
                    <input 
                        {...register('username', { required: "El nombre es obligatorio" })}
                        className="input input-bordered focus:input-primary" 
                    />
                    {errors.username && <span className="text-error text-xs mt-1">{errors.username.message}</span>}
                </div>

                <div className="form-control">
                    <label className="label font-semibold">Email</label>
                    <input 
                        {...register('email')}
                        disabled
                        className="input input-bordered opacity-60 bg-base-200 cursor-not-allowed" 
                    />
                </div>
            </div>

            <div className="divider text-xs opacity-50 uppercase">Seguridad</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label font-semibold">Nueva Contraseña</label>
                    <input 
                        type="password"
                        {...register('password', { minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                        className="input input-bordered focus:input-primary" 
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="card-actions justify-end mt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary px-8"
                >
                    {loading ? <span className="loading loading-spinner"></span> : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}

export default SettingsForm;