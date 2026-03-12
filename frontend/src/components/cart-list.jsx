import styles from "../styles/viewCart.module.css";

export default function CartList({image, name, price, quantity, google_volume_id, onQuantityChange, onRemove}) {
    return (
        <tr>
            <td className={styles.image}>{image && <img src={image} alt={name} className={styles.display_image} />}</td>
            {/*Using conditional rendering because the data loads after the first render*/}
            <td className={styles.name}>{name}</td>
            <td className={styles.price}>${price}</td>
            <td className={styles.quantity_cell}>
                <div className={styles.quantity}>
                    <button onClick={() => onQuantityChange(google_volume_id, quantity - 1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => onQuantityChange(google_volume_id, quantity + 1)}>+</button>
                </div>
            </td>
            <td className={styles.total_cell}>${price * quantity}</td>
            <td><button className={styles.remove_btn} onClick={()=>onRemove(google_volume_id)}>Remove</button></td>
        </tr>
    )
}