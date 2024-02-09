import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
// import firebase from '../Config';
import firebase, { storage } from '../Config';
import { Card } from 'react-bootstrap';
import { Link, useParams, withRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ShowProducts(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const ref = firebase.firestore().collection('Products').doc(id);
                const doc = await ref.get();

                if (doc.exists) {
                    setProduct(doc.data());
                    setKey(doc.id);
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

    const deleteProduct = (id) => {
        setLoading(true);
        var deserRef = storage.ref(product.url); // Use ref() instead of refFromURL()
        firebase.firestore().collection('Products').doc(id).delete().then(() => {
          console.log("Document is successfully deleted");
          navigate('/');
        }).catch((error) => {
          console.error("Error is", error);
        });
        deserRef.delete().then(() => {
          console.log('file deleted');
          navigate('/');
        }).catch((error) => {
          console.log('error while deleting the file', error);
        }).finally(() => {
            setLoading(false);
        });
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

                <div className="upload-data">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {product.url ? (
                                <img src={product.url} alt="Product" height="200px" width="200px" />
                            ) : (
                                <img src={logo} alt="Default" height="200px" width="200px" />
                            )}
                        </>
                    )}
                </div>

                <div className="container">
                    <div className="panel panel-default">
                        <h3 className="panel-title">{product.name}</h3>
                    </div>
                    <div className="panel-body">
                        <dl>
                            <dt>Description:</dt>
                            <dd>{product.description}</dd>
                        </dl>
                    </div>
                    <Link to={`/edit/${key}`} className="btn btn-success">
                        Edit
                    </Link>
                    <button onClick={() => deleteProduct(key)} className="btn btn-danger" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Card>
        </div>
    );
}

export default ShowProducts;
