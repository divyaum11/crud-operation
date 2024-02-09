import React, { useEffect, useState } from 'react';
import '../App.css';
import logo from '../logo.svg';
import firebase, { storage } from '../Config';
import { Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const ref = firebase.firestore().collection('Products').doc(id);
                const doc = await ref.get();

                if (doc.exists) {
                    const data = doc.data();
                    setProduct(data);
                    setName(data.name);
                    setDescription(data.description);
                    setUrl(data.url);
                    setIsLoading(false);
                } else {
                    console.log('Document does not exist!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        if (id) {
            fetchProduct();
        } else {
            console.error('No product ID provided!');
        }
    }, [id]);

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'description') {
            setDescription(value);
        }
    };

    const handleChange = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            setImage(image);

            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(image);
        }
    };

    const updateProduct = async () => {
        try {
            if (!name.trim()) {
                setNameError('Please enter a name');
                return;
            }

            if (!description.trim()) {
                setDescriptionError('Please enter a description');
                return;
            }
            setLoading(true);

            // Clear previous errors
            setNameError('');
            setDescriptionError('');

            // Check if the user selected a new image
            if (image) {
                // Upload the new image to storage
                const storageRef = firebase.storage().ref(`images/${image.name}`);
                await storageRef.put(image);
                const imageUrl = await storageRef.getDownloadURL();
                setUrl(imageUrl);
            }

            // Update the product data in the firestore database
            await firebase.firestore().collection('Products').doc(id).update({
                name,
                description,
                url,
            });

            console.log('Product updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const cardStyle = {
        width: '40rem',
        height: 'auto',
        backgroundColor: 'white',
        margin: 'auto',
        display: 'block',
        marginTop: '60px',
        paddingTop: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderStyle: 'outset',
        borderLeft: '50px solid pink',
    };

    return (
        <div>
            <Card style={cardStyle}>
                <div className="Buttons">
                    <Link to="/">
                        <button className="Edit-Button">Show Products</button>
                    </Link>
                </div>

                <div className="upload-data mb-3">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {url ? (
                                <img src={url} alt="Product" height="200px" width="200px" />
                            ) : (
                                <img src={logo} alt="Default" height="200px" width="200px" />
                            )}
                        </>
                    )}
                </div>
                <div className="upload-btn-wrapper">
                    <button className="file-btn">Choose A File</button>
                    <input type="file" onChange={handleChange} />
                </div>

                <div>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input type="text" className="form-control" name="name" value={name} onChange={onChange} placeholder="Please Enter name" required></input>
                        {nameError && <div className="text-danger">{nameError}</div>}
                    </div>
                </div>
                <div>
                    <div className="form-group">
                        <label htmlFor="description">Product Description</label>
                        <textarea className="form-control" name="description" value={description} col="80" rows="3" onChange={onChange} required></textarea>
                        {descriptionError && <div className="text-danger">{descriptionError}</div>}
                    </div>
                </div>

                <button onClick={updateProduct} className="btn btn-danger" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </Card>
        </div>
    );
}

export default EditProduct;
