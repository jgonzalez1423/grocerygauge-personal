import { useState } from "react";
import React from 'react';

function About() {

  //  State for contact form
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (for now, just log it)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };


  return (
    <div>
      {/* */}

      <section className= "section bg-light border-bottom">
      <div className = "container">
      <div>
        <h5 className = "main-heading">Our Mission</h5>
        <div className = 'underline'></div>
        <p>
          Grocery Gauge helps shoppers track grocery price inflation and find the best deals across different stores. Our goal is to make budgeting easier by providing real-time price comparisons and historical trends.
        </p>
      </div>

      <div className="about_img">
      <img 
        src="/images/istockphoto-1215072566-612x612.jpg" 
        alt="Team working on Grocery Gauge" 
      />
      <img 
        src="/images/360_F_506184891_GDL7vlfqeBRSALShhxF6wx43lG7r54Mo.jpg" 
        alt="Team working on Grocery Gauge" 
      />
    </div>
    </div>
      </section>

      <section className="section">
  <div className="container-fluid">
    <div className="card shadow" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 border-right">
            <h6>Contact Us</h6>
            <hr />
            {/* Wrap the form fields in a form tag and connect it to handleSubmit */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
  <label className="mb-1" htmlFor="name">Name</label>
  <input
    id="name"
    name="name"
    className="form-control"
    placeholder="Enter Name"
    type="text"
    value={formData.name}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label className="mb-1" htmlFor="email">Email</label>
  <input
    id="email"
    name="email"
    className="form-control"
    placeholder="Enter Email"
    type="email"
    value={formData.email}
    onChange={handleChange}
  />
</div>

          <div className="form-group">
           <label className="mb-1" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="Enter Message"
                value={formData.message}
                onChange={handleChange}
                 ></textarea>
              </div>
              <div className="form-group py-3">
                <button type="submit" className="btn btn-primary shadow w-100">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Our Info */}
          <div className="col-md-6 border-start">
            <h5 className="main-heading">Our Info</h5>
            <div className="underline"></div>

            <p>Email: grocery-gauge@email.com</p>
            <p>Phone: +1-111-111-1111</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
    
  )
}

export default About;