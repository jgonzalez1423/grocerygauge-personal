import React from "react";
import { Link } from "react-router-dom"; 

function Footer() {
    return (
      <section className="footer custom-footer text-black py-4">
        <div className="container-fluid">
          <div className="row d-flex justify-content-center text-center">
            <div className="col-12 col-md-4">
              <h6>Information</h6>
              <hr />
              <p className="text-black">
              Grocery Gauge helps shoppers track grocery price inflation and find the best deals across different stores. Our goal is to make budgeting easier by providing real-time price comparisons and historical trends.
              </p>
            </div>
            <div className="col-12 col-md-4">
              <h6>Quick Links</h6>
              <hr />
              <ul className="list-unstyled">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/browse">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>
            <div className="col-12 col-md-4">
              <h6>Contact Us</h6>
              <hr />
              <p className="text-black mb-1">grocery-gauge@email.com</p>
              <p className="text-black mb-1">+1-111-111-1111</p>
            </div>
          </div>
        </div>
      </section>
    );
}

export default Footer;