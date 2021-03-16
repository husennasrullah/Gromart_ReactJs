import React, { Component } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import CartService from "../../../service/CartService";
import ShippingService from "../../../service/ShippingService";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipping: [],
      shippingFee: 0,
      cart: [],
      currentCart: [],
      userid: "Buyer-4cf2f03d-404a-44f2-810f-b143d4a9f8c0",
    };
  }

  checkout = () => {};

  setShipping = (e) => {
    this.setState({
      shippingFee: [e.target.value],
    });
  };

  componentDidMount() {
    CartService.getCartByUserID(this.state.userid)
      .then((res) => {
        this.setState({
          cart: res.data,
          currentCart: res.data.detail,
        });
      })
      .catch((err) => {
        alert("Failed Fetching Data User");
      });

    ShippingService.getShipping()
      .then((res) => {
        this.setState({
          shipping: res.data,
        });
      })
      .catch((err) => {
        alert("Failed Fetching Data Shipper");
      });
  }
  render() {
    const { currentCart, cart } = this.state;
    console.log(this.state.currentCart);
    console.log(this.state.shippingFee);
    return (
      <Container fluid>
        <div>
          <h2>Shopping Cart</h2>
        </div>
        <br />
        <Container style={{ width: "90%" }}>
          <Card>
            <Card.Header as="h5">
              <Row sm>
                <Col sm={9}>
                  <h4>Item Detail</h4>
                </Col>
                <Col sm={3}>
                  <h4>Summary</h4>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={8}>
                  <table className="table table-sm ">
                    <thead className="thead-dark">
                      <th> Product </th>
                      <th> Quantity </th>
                      <th> unit Price </th>
                      <th> SubTotal </th>
                      <th></th>
                    </thead>
                    <tbody>
                      {currentCart.map((cart, idx) => (
                        <tr key={idx}>
                          <td>
                            <img
                              src="https://i.ibb.co/8PXKYMK/sepatu.jpg"
                              alt="sepatu"
                              style={{ width: "120px" }}
                            ></img>
                            {/* <i
                              class="far fa-image"
                              style={{ fontSize: "10vh" }}
                            ></i> */}
                            <p>{cart.product.productName}</p>
                          </td>
                          <td>
                            <InputGroup
                              className="mb-3"
                              style={{ width: "130px" }}
                            >
                              <InputGroup.Prepend style={{ cursor: "pointer" }}>
                                <InputGroup.Text>-</InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl value={cart.quantity} />
                              <InputGroup.Append style={{ cursor: "pointer" }}>
                                <InputGroup.Text>+</InputGroup.Text>
                              </InputGroup.Append>
                            </InputGroup>
                          </td>
                          <td>Rp.{cart.product.unitPrice},-</td>
                          <td>Rp.{cart.subTotal},-</td>
                          <td>
                            <i
                              class="fas fa-trash-alt"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
                <Col sm={4}>
                  <Form>
                    <Form.Group>
                      <Form.Row>
                        <Col md={5}>
                          <Form.Label as="h6">
                            {currentCart.length} items
                          </Form.Label>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Form.Label>Rp.{cart.totalAmount},-</Form.Label>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label as="h6">Shipping Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        type="text"
                        style={{ height: "130px" }}
                        placeholder="your address....."
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Row>
                        <Col md={3}>
                          <Form.Label as="h6">Shipping</Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            name="shippingFee"
                            onChange={this.setShipping}
                          >
                            <option disabled selected value>
                              --select an option--
                            </option>
                            {this.state.shipping.map((ship, idx) => (
                              <option key={idx} value={ship.fee}>
                                {ship.shippingCompany}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group>
                      <Form.Row>
                        <Col md={5}>
                          <Form.Label as="h6">Shipping Fee</Form.Label>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Form.Label>Rp.{this.state.shippingFee},-</Form.Label>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group>
                      <Form.Row>
                        <Col md={5}>
                          <Form.Label as="h6">Total Payment</Form.Label>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Form.Label>Rp.80.000,-</Form.Label>
                        </Col>
                      </Form.Row>
                    </Form.Group>
                  </Form>
                  <Button
                    variant="success"
                    onClick={this.checkout}
                    style={{ width: "100%" }}
                  >
                    Checkout
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </Container>
    );
  }
}

export default Cart;
