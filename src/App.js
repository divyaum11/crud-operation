import React from 'react';
import './App.css';
import firebase from './Config';
// import firebase, { firestore } from './Config';
import 'bootstrap/dist/css/bootstrap.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { QuerySnapshot, doc } from 'firebase/firestore';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("Products");
    this.unsubscribe = null;
    this.state = {
      products : []
    };
  }
  componentDidMount(){
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  onCollectionUpdate = (QuerySnapshot) => {
    const products = [];
    QuerySnapshot.forEach((doc) => {
      const { name, description, url } = doc.data();
      products.push({
        key: doc.id,
        doc,
        name,
        description,
        url
      });
    });
    this.setState({
      products
    });
  }

  render() {
    const cardStyle = {
      width: '75%',
      height: 'auto',
      backgroundColor: 'white',
      margin: 'auto',
      display: 'block',
      marginTop: '60px',
      // opacity: 0.5,
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
            <Link to="/create">
              <button className="Add-Button">Add Products</button>
            </Link>
          </div>

          <div className="container">
            <div className="panel panel-heading">
              <h3 className="panel heading"></h3>
            </div>
          </div>

          <div className="panel-body table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map(product =>
                  <tr key={product.key}>
                    <td><Link to={`/show/${product.key}`}>{product.name}</Link></td>
                    <td>{product.description}</td>
                    <td><img src={product.url} width="100px" height="100px"></img></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </Card>
      </div>
    );
  }
}

export default App;
