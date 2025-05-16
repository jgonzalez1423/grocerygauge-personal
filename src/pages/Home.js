"use client";
import { Link,  useLocation } from "react-router-dom"; 
import React, { useState, useEffect } from "react";
import styles from "./TopBar.module.css";
//import Products from "../components/Products"; // Importing the Products component
import { AiFillCloseCircle } from "react-icons/ai"; // Importing the close icon from react-icons
console.log("TopBar CSS imported");

//top bar component
export function TopBar({ searchQuery, setSearchQuery }) {
   // const [searchQuery, setSearchQuery] = useState(""); // State for storing the search input value
   // const [activeTab, setActiveTab] = useState("Home"); // State for keeping track of the active tab

    const location = useLocation(); //izzie added
    const path = location.pathname; //izzie added

    const getActiveTab = () => {
    if (path === "/") return "Home";
    if (path === "/browse") return "Products";
    if (path === "/cart") return "Cart";
    if (path === "/about") return "About Us";
    return "";
    }; // izzie added

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query when input changes
    };
  
    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page reload)
        console.log("Searching for:", searchQuery); // Log the search query (you can replace this with actual search logic)
    };
  
    // Handle tab click (to set active tab)
    // const handleTabClick = (tabName) => {
    //     setActiveTab(tabName); // Update activeTab state when a tab is clicked
    // };
  
    return (
        <header className={styles.topBar}>
        {/* Left section (logo + title) */}
        <div className={styles.leftSection}>  
        <img 
            src="/images/Untitled_Artwork.webp" 
            alt="GroceryGauge Logo" 
            className={styles.logo}
            />
            <h1 className={styles.title}>GroceryGauge</h1>
        </div>

        {/* Right section (navigation + search) */}
        <div className={styles.rightSection}>
            <nav className={styles.navigation}>
                <Link
                    to="/"
                    className={`${styles.tab} ${getActiveTab() === "Home" ? styles.activeTab : ""}`} //changed to function call so that it works with footer

                    //onClick={() => handleTabClick("Home")}
                >
                    Home
                </Link>
                {/* Link for Products */}
                <Link
                    to="/browse"
                    className={`${styles.tab} ${getActiveTab() === "Products" ? styles.activeTab : ""}`}
                    //onClick={() => handleTabClick("Products")}
                >
                    Products
                    
                </Link>
                {/* Link for Cart */}
                <Link
                    to="/cart"
                    className={`${styles.tab} ${getActiveTab() === "Cart" ? styles.activeTab : ""}`}
                    //onClick={() => handleTabClick("Cart")}
                >
                    Cart
                </Link>
                {/* Link for About Us */}
                <Link
                    to="/about"
                    className={`${styles.tab} ${getActiveTab() === "About Us" ? styles.activeTab : ""}`}
                    //onClick={() => handleTabClick("About Us")}
                >
                    About Us
                </Link>
            </nav>

                {/* Search form */}
                <form className={styles.textfield} onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search in site"
                        value={searchQuery} // Display the current search query in the input field
                        onChange={handleSearchChange} // Handle the change in the search input
                        aria-label="Search"
                    />
                    <button
                        type="submit"
                        className={styles.searchButton}
                        aria-label="Submit search"
                    >
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b997d6d4ad3e310387c87f295e6d3c20f6e1de479763c581120c0eeeea50893?placeholderIfAbsent=true&apiKey=ec5f69a7fdc64a33839a43dcf4df9d9a"
                            alt="Search icon"
                            className={styles.img}
                        />
                    </button>
                </form>
            </div>
        </header>
    );
}

export const Home = ({ searchQuery,setSearchQuery}) => {
    // Select #? of products as "popular" products
    
    //const popularProducts = Products.slice(0, 8);
    const [detail, setDetail] = useState([]);
    const [close, setClose] = useState(false);
    const [products, setProducts] = useState([]);
    //jen added price alert
    const [alertEmail, setAlertEmail] = useState("");
    const [targetPrice, setTargetPrice] = useState("");
    const [showAlertForm, setShowAlertForm] = useState(false);
    const [alertProductId, setAlertProductId] = useState(null);


    const detailPage = async (product) => {
        // setDetail([{...product}]);
        // setClose(true);
        setDetail([{ ...product, graph: null }]);
        setClose(true);

    
        //setLoadingGraph(true);
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
        //setLoadingGraph(false);
    }
    };
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/`)
        .then((res) => res.json())
        .then((data) => {
            setProducts(data);
            const popularIds = [19, 90, 4006, 110, 7843, 7858, 7845, 7837];
            const filtered = data.filter(product => popularIds.includes(product.id));
            setPopularProducts(filtered);
          })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }, []);
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
     // Inline styles for the new elements
    const homeStyles = {
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        productGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '30px'
        },
        productCard: {
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '15px',
            transition: 'transform 0.3s ease'
        }
    };
    return (
        <div style={{
            //display: 'flex',
            //flexDirection: 'column',
            //alignItems: 'center',
           // justifyContent: 'center',
            minHeight: '60vh',  // Adjust based on your needs
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
        }}>
          {/* Welcome Header */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#2c3e50',
                    marginBottom: '1.5rem',
                    lineHeight: '1.3'
            }}>
              Welcome to GroceryGauge
            </h1>
                
            <p style={{
              fontSize: '1.25rem',
              color: '#7f8c8d',
                    marginBottom: '2.5rem',
                    lineHeight: '1.6'
            }}>
              Track Grocery Inflation Prices and Find The Best Deals For You!
            </p>
                
                {/* Search/Call-to-Action Section */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.8rem 1.2rem',
                  borderRadius: '50px',
                  border: '1px solid #ddd',
                  minWidth: '300px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              />
              <button style={{
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                border: 'none',
                background: 'rgb(138, 187, 99)',
                color: 'white',
                fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
              }}>
                <Link to="/browse" style={{ color: 'white', textDecoration: 'none' }}>
                  Explore Products
                </Link>
              </button>
            </div>
          </div>
      
          {/* Conditional Rendering */}
          {!searchQuery && (
            <>
              <h2 className={styles.title} style={{ margin: '20px 0 10px' }}>Popular Picks</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px'
              }}>
                {popularProducts.map((product) => (
                  <div key={product.id} style={{
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '15px',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
                      <img
             src={product.image_url || "https://thaka.bing.com/th/id/OIP.RCFyflqWgpQq07U0Tm3IQQHaHw?rs=1&pid=ImgDetMain"}
                        alt={product.name}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
          objectFit: 'contain', // <<-- 🔥 very important
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#2c3e50' }}>{product.name}</h3>
                    <p style={{ color: 'rgb(138, 187, 99)', fontWeight: 'bold' }}>${product.current_price}</p>
                    <button onClick={() => detailPage(product)} style={{
                      background: 'rgb(138, 187, 99)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '4px',
                      width: '100%',
                      marginBottom: '5px'
                    }}>
                      View Details
                    </button>
                    <button onClick={() => {
                      console.log("Alert product_id:", product.product_id);
                      setAlertProductId(product.product_id);
                      setShowAlertForm(true);
                    }} style={{
                      background: '#fff',
                      color: 'rgb(138, 187, 99)',
                      border: '1px solid rgb(138, 187, 99)',
                      padding: '8px',
                      borderRadius: '4px',
                      width: '100%'
                    }}>
                      Set Price Alert
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
      
          {searchQuery && (
            <>
              <h2 className={styles.title} style={{ margin: '20px 0 10px' }}>Search Results</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px'
              }}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} style={{
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      padding: '15px',
                      height: '420px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={product.image_url || "https://via.placeholder.com/150"}
                          alt={product.name}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: '5px'
                          }}
                        />
                      </div>
                      <h3 style={{ fontSize: '1.2rem', color: '#2c3e50' }}>{product.name}</h3>
                      <p style={{ color: 'rgb(138, 187, 99)', fontWeight: 'bold' }}>${product.current_price}</p>
                      <button onClick={() => detailPage(product)} style={{
                        background: 'rgb(138, 187, 99)',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '4px',
                        width: '100%'
                      }}>
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No results found.</p>
                )}
              </div>
            </>
          )}
      
          {/* Detail Modal */}
          {close && !showAlertForm && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '600px',
                position: 'relative'
              }}>
                <button onClick={() => setClose(false)} style={{
                  position: 'absolute',
                  top: '10px', right: '10px',
                  fontSize: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  <AiFillCloseCircle />
                </button>
                {detail.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '20px' }}>
                                <img
  src={item.image_url || "https://via.placeholder.com/150"}
  alt={item.name}
  style={{
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px'
  }}
/>
                    <div>
                      <h2 className={styles.title}>{item.name}</h2>
                      <p style={{ color: 'rgb(138, 187, 99)', fontWeight: 'bold' }}>${item.current_price}</p>
                      {item.graph ? (
                        <img src={item.graph} alt="Price trend" style={{ marginTop: '15px', maxWidth: '100%' }} />
                      ) : (
                        <p style={{ marginTop: '15px', color: '#999' }}>No price graph available.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      
          {/* Price Alert Modal */}
          {showAlertForm && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '100%',
                position: 'relative'
              }}>
                <button onClick={() => setShowAlertForm(false)} style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}>
                  <AiFillCloseCircle />
                </button>
                <h3>Set Price Alert</h3>
                <input
                  type="email"
                  placeholder="Your email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                  type="number"
                  placeholder="Target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button onClick={async () => {
                  try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/price-alerts/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        email: alertEmail,
                        target_price: parseFloat(targetPrice),
                        product_id: alertProductId
                      })
                    });
                    if (response.ok) {
                      alert("Price alert set!");
                      setShowAlertForm(false);
                      setAlertEmail("");
                      setTargetPrice("");
                    } else {
                      alert("Failed to set alert.");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred.");
                  }
                }} style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgb(138, 187, 99)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}>
                  Submit Alert
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };      