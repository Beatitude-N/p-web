// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import "../components/ProductList.css"
import axios from 'axios';
import  img from "../components/img/img.jpg"

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('https://www.pexels.com/photo/opened-book-on-tree-root-3358707/');

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      setLoading(true);
      const response = await axios.get('https://bea-product-api.onrender.com/products');
      console.log('Data fetched successfully:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please try again.');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const addProduct = async () => {
    try {
      const response = await axios.post('https://bea-product-api.onrender.com/products', {
        name: newProductName,
        quantity: newProductQuantity,
        price: newProductPrice,
      });

      setProducts([...products, response.data]);
      // Clear input fields after successful addition
      setNewProductName('');
      setNewProductQuantity(0);
      setNewProductPrice(0);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error adding product. Please try again.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://bea-product-api.onrender.com/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      setError(`Error deleting product with ID ${id}. Please try again.`);
    }
  };

  return (
    <div>
      <h1>Product List</h1>

      {!loading && !error && (
  <ul>
    {products.map(product => (
      <li key={product._id}>
        {product.name} - ${product.price}
        {product.image ? (
          <img src={imageUrl} alt={product.name} />
        ) : (
          <p>No image available</p>
        )}
        <button className='btn' onClick={() => deleteProduct(product._id)}>Delete</button>
      </li>
    ))}
  </ul>
)}


      <button onClick={fetchData}>Fetch Data</button>


      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newProductQuantity}
        onChange={(e) => setNewProductQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

export default ProductList;
