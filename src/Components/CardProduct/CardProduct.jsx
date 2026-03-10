import { Link } from 'react-router'
import { useUser } from '../../Hooks/useUser.js'
import { useCart } from '../../Hooks/useCart.js'
import { FaShoppingCart } from 'react-icons/fa'

const CardProduct = ({
    product: { _id, name, imageUrl, description, price, stock },
}) => {
    const { isAuthenticated } = useUser()
    const { addToCart, loading, openModal } = useCart()

    const handleAddToCart = async () => {
        await addToCart({ _id, name, price, imageUrl, description, stock })
        openModal() // Abrir el modal del carrito despues de agregar el producto
    }

    return (
        <div className="card bg-base-100 w-80 lg:w-[30%] shadow-lg">
            <figure>
                <img
                    className="aspect-[9/9] object-cover"
                    src={imageUrl}
                    alt="Tazas"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <div className="badge badge-warning">{price}</div>
                <p>{description}</p>
                <div className="card-actions justify-between mt-4">
                    <Link
                        to={`/detailProduct/${_id}`}
                        className="btn btn-info btn-sm md:btn-md"
                    >
                        Ver detalles
                    </Link>

                    <button
                        onClick={handleAddToCart}
                        disabled={loading || stock === 0}
                        className="btn btn-success btn-sm md:btn-md"
                    >
                        <FaShoppingCart size={16} />
                        {stock === 0 ? 'Sin stock' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardProduct