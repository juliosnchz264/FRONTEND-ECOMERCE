// src/Components/Profile/SettingsForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from '../../Hooks/useUser.js'
import toast from 'react-hot-toast'
import { updateProfileService } from '../../services/userServices'
import { FiUpload, FiUser, FiMail, FiLock, FiSave, FiX, FiImage } from 'react-icons/fi'

const baseServerUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

const SettingsForm = () => {
    const { userInfo, setUserInfo } = useUser()
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            username: userInfo?.username || '',
            email: userInfo?.email || ''
        }
    })

    const password = watch('password')

    const getAvatarSrc = () => {
        if (preview) return preview;
        if (userInfo?.avatar) {
            return userInfo.avatar.startsWith('http') 
                ? userInfo.avatar 
                : `${baseServerUrl}${userInfo.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=6366f1&color=fff&bold=true&size=128`;
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

    const removePreview = () => {
        setPreview(null)
        setSelectedFile(null)
        const fileInput = document.getElementById('avatar-upload')
        if (fileInput) fileInput.value = ''
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await updateProfileService(data, selectedFile);

            if (result.success && result.user) {
                setUserInfo(prev => ({
                    ...prev,
                    ...result.user
                }));
                
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...result.user }));
                
                toast.success(result.message);
                setPreview(null);
                setSelectedFile(null);
                reset({
                    username: result.user.username,
                    email: result.user.email
                });
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECCIÓN AVATAR */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiImage className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Foto de perfil
                </h3>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full ring-4 ring-purple-100 dark:ring-purple-900/50 overflow-hidden bg-gray-100 dark:bg-gray-700 transition-all duration-300 group-hover:ring-purple-300 dark:group-hover:ring-purple-700">
                            <img 
                                src={getAvatarSrc()} 
                                alt="Avatar preview" 
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=6366f1&color=fff`;
                                }}
                            />
                        </div>
                        {preview && (
                            <button
                                type="button"
                                onClick={removePreview}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 shadow-lg"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cambiar foto de perfil
                        </label>
                        <div className="flex gap-2">
                            <input 
                                id="avatar-upload"
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden" 
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('avatar-upload').click()}
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600"
                            >
                                <FiUpload className="w-4 h-4" />
                                <span className="text-sm font-medium">Seleccionar imagen</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Formatos permitidos: JPG, PNG, WebP. Máximo 2MB
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DATOS PERSONALES */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Información personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre de usuario
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FiUser className="w-4 h-4" />
                            </div>
                            <input 
                                {...register('username', { required: "El nombre es obligatorio" })}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="Tu nombre de usuario"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FiMail className="w-4 h-4" />
                            </div>
                            <input 
                                {...register('email')}
                                disabled
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-200"
                            />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">El email no se puede modificar</p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN SEGURIDAD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiLock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    Seguridad
                </h3>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input 
                                type="password"
                                {...register('password', { 
                                    minLength: { 
                                        value: 6, 
                                        message: "Mínimo 6 caracteres" 
                                    }
                                })}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                {errors.password.message}
                            </p>
                        )}
                        {password && password.length >= 6 && (
                            <p className="text-green-500 dark:text-green-400 text-xs flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-green-500 dark:bg-green-400 rounded-full"></span>
                                Contraseña segura
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => {
                        reset({
                            username: userInfo?.username,
                            email: userInfo?.email
                        });
                        removePreview();
                    }}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <FiSave className="w-4 h-4" />
                            <span>Guardar cambios</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default SettingsForm