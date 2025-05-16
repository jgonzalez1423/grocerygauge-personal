import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../components/CartContext';
import styles from './Cart.module.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const [quantityInputs, setQuantityInputs] = useState({});

  useEffect(() => {
    const inputs = {};
    cartItems.forEach((item) => {
      inputs[item.product.product_id] = item.quantity.toString();
    });
    setQuantityInputs(inputs);
  }, [cartItems]);

  const handleQuantityUpdate = (productId, value) => {
    let newVal = value;
    if (!newVal || parseInt(newVal, 10) < 1) {
      newVal = "1";
    }
    setQuantityInputs({
      ...quantityInputs,
      [productId]: newVal,
    });
    updateQuantity(productId, parseInt(newVal, 10));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.current_price * item.quantity,
    0
  );

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartHeading}>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className={styles.emptyMessage}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartItems}>
          {cartItems.map((item) => {
            const productId = item.product.product_id;
            const inputValue =
              quantityInputs[productId] !== undefined
                ? quantityInputs[productId]
                : item.quantity.toString();

            return (
              <div key={productId} className={styles.cartItem}>
                <img
                  src={item.product.image_url || "https://via.placeholder.com/150"}
                  alt={item.product.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.product.name}</h3>
                  <div className={styles.quantityContainer}>
                    <label htmlFor={`quantity-${productId}`}>Quantity: </label>
                    <input
                      id={`quantity-${productId}`}
                      type="number"
                      min="1"
                      value={inputValue}
                      onChange={(e) =>
                        setQuantityInputs({
                          ...quantityInputs,
                          [productId]: e.target.value,
                        })
                      }
                      onBlur={(e) =>
                        handleQuantityUpdate(productId, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuantityUpdate(productId, e.target.value);
                          e.target.blur();
                        }
                      }}
                      className={styles.quantityInput}
                    />
                  </div>
                  <p className={styles.itemPrice}>
                    ${item.product.current_price} x {item.quantity}
                  </p>
                  <p className={styles.itemSubtotal}>
                    Subtotal: ${(item.product.current_price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromCart(productId)}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            );
          })}
          <div className={styles.cartTotal}>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className={styles.checkoutButton}>Estimate Total</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
