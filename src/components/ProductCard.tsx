import React, { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

const ProductCard = () => {
  // Állapotok
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  // Adatok betöltése
  useEffect(() => {
    fetch('/products.json')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);  // Termékek állapotba mentése
        setFilteredProducts(data);  // Inicializáljuk a szűrt termékeket is
      })
      .catch(() => setError('Failed to load products.'));
  }, []);

  // Keresés logika
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products); // Ha nincs keresett szó, mutassuk az összes terméket
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filtered.length === 0) {
        setError('No product found with the given name.');
      } else {
        setError('');
      }

      setFilteredProducts(filtered); // A szűrt eredmények beállítása
    }
  };

  return (
    <>
      <div className='product-card'>
        <label>Enter product name</label>
        <div className="search-section">
          <input
            type="text"
            value={searchQuery} // A keresett szöveget az állapotváltozó tartja
            onChange={(e) => setSearchQuery(e.target.value)} // Frissíti a keresett szöveget
            placeholder="Search by product name"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id}>
                <h2>{product.name}</h2>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category}</p>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                />
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
