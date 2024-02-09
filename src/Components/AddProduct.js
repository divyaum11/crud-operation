import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import firebase from '../Config';
import 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection("Products");
        this.state = {
            name: '',
            description: '',
            url: '',
            image: null,
            errors: {},
            successMessage: '',
            loading: false,
        }
    }

    validateForm = () => {
        const { name, description, url } = this.state;
        let errors = {};

        if (!name.trim()) {
            errors.name = 'Please enter a name';
        }

        if (!description.trim()) {
            errors.description = 'Please enter a description';
        }

        if (!url) {
            errors.url = 'Please choose an image';
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    handleChange = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState({ image });

            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ url: reader.result });
            };
            reader.readAsDataURL(image);
        }
    };

    onSubmit = () => {
        const { name, description, url } = this.state;

        if (!this.validateForm()) {
            return;
        }

        this.setState({ loading: true });

        this.ref
            .add({
                name,
                description,
                url,
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                this.setState({
                    name: '',
                    description: '',
                    url: '',
                    successMessage: 'Product added successfully!',
                    errors: {},
                });

                // Use React Router's history for navigation
                // this.props.history.push('/');
                window.location.href = "/";
            })
            .catch((error) => {
                console.error("Error adding document:", error);
                this.setState({
                    successMessage: '',
                    errors: { general: 'Error adding the product. Please try again.' },
                });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    render() {
        const { name, description, errors, successMessage, loading } = this.state;
        const cardStyle = {
            width: '50%',
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

                    <div>
                        <div className="form-group">
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                                placeholder="Please Enter name"
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                    </div>

                    <div>
                        <div className="form-group mb-3">
                            <label htmlFor="description">Product Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={description}
                                col="80"
                                rows="3"
                                onChange={this.onChange}
                            />
                            {errors.description && <div className="text-danger">{errors.description}</div>}
                        </div>
                    </div>

                    <div className="upload-btn-wrapper">
                        <button className="file-btn">Choose A File</button>
                        <input type="file" onChange={this.handleChange} />
                    </div>
                    {errors.url && <div className="text-danger">{errors.url}</div>}

                    <div className="upload-data">
                        {this.state.url ? (
                            <img src={this.state.url} alt="Product" height="200px" width="200px" />
                        ) : (
                            <img src={logo} alt="Default" height="200px" width="200px" />
                        )}
                    </div>

                    {successMessage && <div className="text-success">{successMessage}</div>}

                    <div className="Buttons">
                        <button className="Submit-Button" onClick={this.onSubmit}disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </Card>
            </div>
        );
    }
}

export default AddProduct;
