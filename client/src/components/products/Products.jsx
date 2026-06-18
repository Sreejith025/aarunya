import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get(
            "http://localhost:5000/api/product/all"
        );

        setProducts(response.data.products);
    };

    return (
        <div>
            <h1>Products</h1>

            {products.map((item) => (
                <div key={item._id}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <h3>₹{item.price}</h3>
                </div>
            ))}
        </div>
    );
}

export default Products;