import ModalCart from './ModalCart'
import { useCart } from '../../Hooks/useCart.js'

const Cart = () => {
    const { total, itemsQuantity, openModal, isModalOpen } = useCart()

    const handleViewCartClick = () => {
        // Cerrar el dropdown quitando el focus
        document.activeElement.blur()
        // Abrir el modal
        openModal()
    }

    return (
        <>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-success btn-circle"
                    >
                        <div className="indicator">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />{' '}
                            </svg>
                            <span className="badge badge-sm indicator-item">
                                {itemsQuantity}
                            </span>
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-[1000] mt-3 w-52 shadow"
                    >
                        <div className="card-body">
                            <span className="text-lg font-bold">
                                {itemsQuantity} items
                            </span>
                            <span className="text-info">
                                Subtotal: ${total}
                            </span>
                            <div className="card-actions">
                                <button
                                    onClick={handleViewCartClick}
                                    className="btn btn-primary btn-block"
                                >
                                    Ver carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && <ModalCart />}
        </>
    )
}

export default Cart