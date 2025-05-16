
import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    //need to change the URL to your backend URL - jen 
  fetch("http://localhost:8000/api/products/")
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error("Error fetching products:", err));
}, []);

  return (
    <div>
      <h2>Product List</h2>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id}>
            <h3>{product.Title}</h3>
            <p>${product.Price}</p>
          </div>
        ))
      ) : (
        <p>Loading or no products found...</p>
      )}
    </div>
  );
};

/*
// PREDICTION POC
const Products = [
    {
        id: 989,
        Title: 'product 989',
        img: '/images/anh-nguyen-kcA-c3f_3FE-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 990,
        Title: 'product 990',
        img: '/images/anh-nguyen-kcA-c3f_3FE-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 991,
        Title: 'product 991',
        img: '/images/annie-spratt-m1t-RJ1iCIU-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 992,
        Title: 'product 992',
        img: '/images/chris-dez-t2ZIt-WNXrk-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 993,
        Title: 'product 993',
        img: '/images/elianna-friedman-4jpNPu7IW8k-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 994,
        Title: 'product 994',
        img: '/images/fernando-andrade-nAOZCYcLND8-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 995,
        Title: 'product 995',
        img: '/images/honza-vojtek-A39EqNtDpZs-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 996,
        Title: 'product 996',
        img: '/images/irene-kredenets-zNsSGYXaeP8-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 997,
        Title: 'product 997',
        img: '/images/jonathan-pielmayer-eFFnKMiDMGc-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 998,
        Title: 'product 998',
        img: '/images/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    },
    {
        id: 999,
        Title: 'product 999',
        img: '/images/edouard-gilles-a5JMF6XyFYI-unsplash.jpg',
        Price:  10,
        cat: 'fruit',
        graph : '/images/basic-line-chart.svg'
    }
]*/

export default Products;
