import styles from "../styles/viewCart.module.css";

export default function CartList({image, name, price, quantity}) {
    return (
        <tr>
            <td className={styles.image}>{image && <img src={image} alt={name} className={styles.display_image} />}</td>
            {/*Using conditional rendering because the data loads after the first render*/}
            <td className={styles.name}>{name}</td>
            <td className={styles.price}>{price}</td>
            <td className={styles.quantity}>{quantity}</td>{/* Keeping the quantity fixed for now. Update the page so that the user can change the value accordingly */}
            <td className={styles.total}>{price * quantity}</td>
        </tr>
    )
}