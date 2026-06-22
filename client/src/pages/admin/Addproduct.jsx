import Navbar from '../../components/navbar/Navbar'
import './Addproduct.css'
import { PlusCircle, List, FileText, UploadCloud, X, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config'

export default function Addproduct() {
    const [activeTab, setActiveTab] = useState('add');
    const [products, setProducts] = useState([]);

    const [editingProduct, setEditingProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Women');
    const [subCategory, setSubCategory] = useState('kurti');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const [colorInput, setColorInput] = useState('');
    const [colors, setColors] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'list') {
            fetchProducts();
        }
    }, [activeTab]);

    const handleAddColor = () => {
        if (colorInput.trim() && !colors.includes(colorInput.trim())) {
            setColors([...colors, colorInput.trim()]);
            setColorInput('');
        }
    }

    const handleRemoveColor = (colorToRemove) => {
        setColors(colors.filter(c => c !== colorToRemove));
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 6) {
            alert('You can only upload a maximum of 6 images.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    }

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        if (newPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(newPreviews[index]);
        }
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    }

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setPrice(product.price);
        setOfferPrice(product.offerPrice);
        setColors(product.colors || []);
        
        // Load existing images as previews
        const previews = product.images.map(img => img.startsWith('/uploads') ? `${API_BASE_URL}${img}` : img);
        setImagePreviews(previews);
        setImages([]); // clear files
        
        setActiveTab('add'); // switch to form tab
    };

    const handleDeleteClick = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Product deleted successfully!');
                fetchProducts();
            } else {
                setMessage(data.message || 'Failed to delete product');
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            setMessage('Error connecting to server');
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setName('');
        setDescription('');
        setCategory('Women');
        setSubCategory('kurti');
        setPrice('');
        setOfferPrice('');
        setColors([]);
        setImages([]);
        setImagePreviews([]);
        setActiveTab('list');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // If not in edit mode, images are required. In edit mode they are optional.
        if (!editingProduct && images.length === 0) {
            setMessage('Please upload at least one image.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('price', price);
        formData.append('offerPrice', offerPrice);
        formData.append('colors', JSON.stringify(colors));

        images.forEach(img => {
            formData.append('images', img);
        });

        const url = editingProduct 
            ? `${API_BASE_URL}/api/products/${editingProduct._id}`
            : `${API_BASE_URL}/api/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
                // Reset form
                setEditingProduct(null);
                setName('');
                setDescription('');
                setPrice('');
                setOfferPrice('');
                setColors([]);
                setImages([]);
                setImagePreviews([]);
                setActiveTab('list');
            } else {
                setMessage(data.message || 'Error saving product');
            }
        } catch (error) {
            setMessage('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-container">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className={`sidebar-item ${activeTab === 'add' && !editingProduct ? 'active' : ''}`} onClick={() => { setEditingProduct(null); handleCancelEdit(); setActiveTab('add'); }}>
                        <PlusCircle size={20} />
                        <span>Add Product</span>
                    </div>
                    <div className={`sidebar-item ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                        <List size={20} />
                        <span>Product List</span>
                    </div>
                    <div className="sidebar-item">
                        <FileText size={20} />
                        <span>Orders</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="admin-content">
                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    {activeTab === 'list' ? (
                        <div className="product-list-view">
                            <div className="list-header-row">
                                <h2>All Products</h2>
                                <button className="add-new-btn" onClick={() => { setEditingProduct(null); setActiveTab('add'); }}>+ Add New Product</button>
                            </div>
                            <div className="product-table-wrapper">
                                {products.length > 0 ? (
                                    <table className="product-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Subcategory</th>
                                                <th>Price</th>
                                                <th>Offer Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((prod) => {
                                                const imgUrl = prod.images && prod.images.length > 0
                                                    ? (prod.images[0].startsWith('/uploads') ? `${API_BASE_URL}${prod.images[0]}` : prod.images[0])
                                                    : 'https://via.placeholder.com/50x60?text=No+Img';
                                                return (
                                                    <tr key={prod._id}>
                                                        <td className="img-td">
                                                            <img src={imgUrl} alt={prod.name} className="table-product-img" />
                                                        </td>
                                                        <td className="name-td" title={prod.name}>{prod.name}</td>
                                                        <td>{prod.category}</td>
                                                        <td>{prod.subCategory}</td>
                                                        <td>₹{prod.price}</td>
                                                        <td>₹{prod.offerPrice}</td>
                                                        <td className="actions-td">
                                                            <button className="table-edit-btn" onClick={() => handleEditClick(prod)} title="Edit product">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="table-delete-btn" onClick={() => handleDeleteClick(prod._id)} title="Delete product">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-products-admin">No products added yet. Click "Add Product" to add one!</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="form-view">
                            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <form className="add-product-form" onSubmit={handleSubmit}>

                                <div className="form-group">
                                    <label>Product Image {editingProduct && <span className="helper-label">(leave empty to keep existing images)</span>}</label>
                                    <div className="image-upload-container">
                                        {imagePreviews.map((preview, i) => (
                                            <div key={i} className="upload-box preview-box">
                                                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                                <button type="button" onClick={() => removeImage(i)} className="remove-img-btn">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {imagePreviews.length < 6 && (
                                            <label className="upload-box">
                                                <UploadCloud size={24} color="#a0aabf" />
                                                <span>Upload</span>
                                                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" placeholder="Type here" value={name} onChange={e => setName(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Product Description</label>
                                    <textarea placeholder="Type here" rows="4" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={category} onChange={e => {
                                        const newCategory = e.target.value;
                                        setCategory(newCategory);
                                        if (newCategory === 'Home') {
                                            setSubCategory('Popular Products');
                                        } else {
                                            setSubCategory('kurti');
                                        }
                                    }}>
                                        <option value="Women">Women</option>
                                        <option value="Home">Home</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>List Item</label>
                                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                                        {category === 'Women' ? (
                                            <>
                                                <option value="kurti">kurti</option>
                                                <option value="Tops">Tops</option>
                                                <option value="Sarees">Sarees</option>
                                                <option value="Skirts">Skirts</option>
                                                <option value="Jeans">Jeans</option>
                                                <option value="Activewear">Activewear</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Popular Products">Popular Products</option>
                                                <option value="New Arrival">New Arrival</option>
                                                <option value="Most Wanted">Most Wanted</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Product Price</label>
                                    <input type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required />
                                </div>

                                <div className="form-group">
                                    <label>Offer Price</label>
                                    <input type="number" placeholder="0" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} required />
                                </div>

                                <div className="form-group colors-group">
                                    <label>Colours</label>
                                    <div className="colors-input-row">
                                        <input
                                            type="text"
                                            placeholder="e.g. red"
                                            value={colorInput}
                                            onChange={e => setColorInput(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' ? (e.preventDefault(), handleAddColor()) : null}
                                        />
                                        <button type="button" className="add-color-btn" onClick={handleAddColor}>Add Colour</button>
                                    </div>
                                    {colors.length > 0 && (
                                        <div className="colors-list">
                                            {colors.map((color, idx) => (
                                                <span key={idx} className="color-tag">
                                                    {color}
                                                    <button type="button" onClick={() => handleRemoveColor(color)}><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="form-actions-row">
                                    <button type="submit" className="submit-btn" disabled={loading}>
                                        {loading ? 'SAVING...' : (editingProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT')}
                                    </button>
                                    {editingProduct && (
                                        <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>
                                            CANCEL
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
