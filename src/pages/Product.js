import React, { useEffect, useState, useContext } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import '../components/style.css';
import { CartContext } from '../components/CartContext';

const Product = ({searchQuery, setSearchQuery}) => {
  const [products, setProducts] = useState([]);
  const [detail, setDetail] = useState([]);
  const [close, setClose] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const { addToCart } = useContext(CartContext);

  // Fetch product data
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 12;

// Filter first
const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

// Then paginate
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  const detailPage = async (product) => {
    setDetail([{ ...product, graph: null }]);
    setClose(true);
    setQuantity("1");
    setLoadingGraph(true);

    try {
      const res = await fetch(`http://localhost:5001/generate-plot?product_id=${product.id}`);
      const data = await res.json();

      if (data.image) {
        const imageUrl = `data:image/png;base64,${data.image}`;
        setDetail([{ ...product, graph: imageUrl }]);
      }
    } catch (err) {
      console.error("Error fetching price graph:", err);
    } finally {
      setLoadingGraph(false);
    }
  };

  return (
    <>
      {close && (
        <div className="detail_container">
          <div className="detail_content">
            <button className="close" onClick={() => setClose(false)}>
              <AiFillCloseCircle />
            </button>
            {detail.map((x) => (
              <div key={x.id} className="detail_info">
                <div className="img-box">
                  <img src={x.image_url || "https://via.placeholder.com/200"} alt={x.name} />
                </div>
                <div className="product_detail">
                  <h2>{x.name}</h2>
                  <h3>${x.current_price}</h3>
                  <div className="product_graph">
                    {loadingGraph ? (
                      <p>Loading price graph...</p>
                    ) : x.graph ? (
                      <img src={x.graph} alt={`${x.name} Price Graph`} />
                    ) : (
                      <p>No price graph available.</p>
                    )}
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <label htmlFor="quantityInput" style={{ marginRight: '8px' }}>
                      Quantity:
                    </label>
                    <input
                      id="quantityInput"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      onBlur={() => {
                        if (!quantity || parseInt(quantity, 10) < 1) {
                          setQuantity("1");
                        }
                      }}
                      style={{ width: '60px' }}
                    />
                  </div>
                  <button
  onClick={async () => {
    try {
      console.log("Product object:", x);
      console.log("Product ID:", x.product_id);

      addToCart(x, parseInt(quantity, 10) || 1);
alert("Added to cart!");
setClose(false);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("An error occurred.");
    }
  }}
  style={{ marginTop: '15px' }}
>
  Add to Cart
</button>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
      {currentProducts.map((curElm) => (
  <div
    key={curElm.id}
    style={{
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '15px',
      height: '420px',  // same fixed height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      margin: '10px' // space between cards
    }}
  >
    {/* Product Image */}
    <div style={{ height: '180px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={curElm.image_url || "https://thaka.bing.com/th/id/OIP.RCFyflqWgpQq07U0Tm3IQQHaHw?rs=1&pid=ImgDetMain"}
        alt={curElm.name}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: '5px'
        }}
      />
    </div>

    {/* Product Name */}
    <div style={{
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '5px'
    }}>
      <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#2c3e50' }}>{curElm.name}</h3>
    </div>

    {/* Price */}
    <p style={{ color: 'rgb(138, 187, 99)', fontWeight: 'bold', margin: '10px 0' }}>
      ${curElm.current_price}
    </p>

    {/* View Button */}
    <button
      onClick={() => detailPage(curElm)}
      style={{
        background: 'rgb(138, 187, 99)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%'
      }}
    >
      View
    </button>
  </div>
))}

      </div>

      <div className="multipage" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            margin: '0 6px',
            padding: '6px 12px',
            borderRadius: '5px',
            backgroundColor: '#eee',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
            style={{
              margin: '0 4px',
              padding: '6px 12px',
              borderRadius: '5px',
              backgroundColor: currentPage === i + 1 ? '#8abb63' : '#eee',
              color: currentPage === i + 1 ? '#fff' : '#000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            margin: '0 6px',
            padding: '6px 12px',
            borderRadius: '5px',
            backgroundColor: '#eee',
            border: 'none',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Product;
