import React, { Component } from "react";

import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
  Carousel,
  CarouselItem,
} from "react-bootstrap";

import ProductService from "../../../service/ProductService";
import { connect } from "react-redux";
import CartService from "../../../service/CartService";
import DetailShop from "./DetailShop";
import { Redirect } from "react-router";
import RegistrasiService from "../../../service/RegistrasiService";

class HomeBuyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      listProduct: [],
      search: "",
      page: "1",
      count: 0,
      limit: 8,
      isSearch: true,
      userid: this.props.dataUser.userId,
      cartId: "",
      isOpen: false,
      detailShop: "",
    };
  }

  addToCart = (productId, qty) => {
    let addToCart = {
      cartId: this.state.cartId, //coba
      user: {
        userId: this.props.dataUser.userId,
      },
      totalAmount: 100000,
      detail: [
        {
          product: {
            productId: productId,
          },
          quantity: qty,
        },
      ],
    };

    CartService.addToCart(this.props.dataUser.userId, productId, addToCart)
      .then((res) => {
        alert("Successfully added item to cart");
        this.getCurrentCart();
      })
      .catch((err) => {
        console.log("error :", err.response.data);
        alert(err.response.data);
      });
  };

  detailShop = (productId) => {
    this.setState({
      detailShop: this.state.product.filter(
        (prod) => prod.productId === productId
      ),
      isOpen: true,
    });
  };

  closeModal = () => this.setState({ isOpen: false });

  searchProduct = () => {
    if (this.state.isSearch) {
      if (this.state.search === "") {
        this.getProductPaging();
      } else {
        ProductService.searchByName(
          this.state.search,
          this.state.page,
          this.state.limit
        )
          .then((res) => {
            let page = res.data.qty / this.state.limit;
            this.setState({
              product: res.data.product,
              count: Math.ceil(page),
              isSearch: false,
            });
          })
          .catch((err) => {
            alert("Failed Fetching Data nama");
          });
      }
    } else {
      this.setState({
        search: "",
        product: this.state.listProduct,
        isSearch: true,
      });
      this.getProductPaging();
    }
  };

  setSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  handleChange = (event, value) => {
    ProductService.getProductPaging(value, this.state.limit).then((res) => {
      this.setState({
        page: value,
        product: res.data.product,
      });
    });
  };

  getProductPaging() {
    ProductService.getProductPaging(this.state.page, this.state.limit)
      .then((res) => {
        let page = res.data.qty / this.state.limit;
        this.setState({
          product: res.data.product,
          listProduct: res.data.product,
          count: Math.ceil(page),
        });
      })
      .catch((err) => {
        alert("Failed Fetching Data");
      });
  }

  getCurrentCart() {
    CartService.getCartByUserID(this.state.userid).then((res) => {
      console.log("pesan :", res.data.errorMessage);
      if (res.data.errorMessage === "No-Cart") {
      } else {
        this.setState({
          cartId: res.data.cartId,
        });
      }
    });
  }

  getNewDataUser() {
    RegistrasiService.searchID(this.state.userid)
      .then((res) => {
        this.props.changeLogin(res.data);
      })
      .catch((err) => {
        alert("Failed Fetch Data");
      });
  }

  componentDidMount() {
    this.getProductPaging();
    this.getCurrentCart();
    this.getNewDataUser();
  }

  render() {
    // console.log("CARTID :", this.state.cartId);
    console.log("datauser :", this.props.dataUser);

    return (
      <Container fluid style={{ backgroundColor: "#f2f4f7" }}>
        {this.state.isOpen ? (
          <DetailShop
            closeModal={this.closeModal}
            isOpen={this.state.isOpen}
            detailShop={this.state.detailShop}
            addToCart={this.addToCart}
          />
        ) : null}

        <br />
        <Row>
          <Col md={3}>
            <Card
              bg="warning"
              text=""
              className="mb-2"
              style={{ textAlign: "center" }}
            >
              <Card.Header>
                <Card.Title> CREDIT LIMIT </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <i
                      class="fas fa-wallet"
                      style={{ fontSize: "6vh", color: "white" }}
                    ></i>
                  </Col>
                  <Col md={8}>
                    <h2>
                      Rp.
                      {this.props.dataUser.creditLimit
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")}
                      ,-
                    </h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <br />
            <Card
              bg="success"
              text=""
              className="mb-2"
              style={{ textAlign: "center" }}
            >
              <Card.Header>
                <Card.Title> INVOICE LIMIT </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <i
                      class="fab fa-sellsy"
                      style={{ fontSize: "6vh", color: "white" }}
                    ></i>
                  </Col>
                  <Col md={8}>
                    <h2>{this.props.dataUser.invoiceLimit} Transaction</h2>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <br />
            <Carousel fade>
              <Carousel.Item style={{ height: "400px" }}>
                <img
                  className="d-block w-100"
                  src="https://i.ibb.co/F6qy0wj/img1.png"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: "400px" }}>
                <img
                  className="d-block w-100"
                  src="https://i.ibb.co/sb8999b/img2.png"
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item style={{ height: "400px" }}>
                <img
                  className="d-block w-100"
                  src="https://i.ibb.co/K99ScDT/img3.png"
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>

          <Col md={9}>
            <Form>
              <Form.Row className="align-items-center">
                <Col md={3}>
                  <Form.Label htmlFor="inlineFormInput" srOnly>
                    Name
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    id="inlineFormInput"
                    as="select"
                  >
                    <option value="low">Price - Low to High</option>
                    <option value="high">Price - High to Low</option>
                  </Form.Control>
                </Col>
                <Col md={9}>
                  <InputGroup className="mb-2">
                    <FormControl
                      placeholder="search your product"
                      onChange={this.setSearch}
                      value={this.state.search}
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text
                        style={{ cursor: "pointer" }}
                        onClick={this.searchProduct}
                      >
                        {this.state.isSearch ? (
                          <i class="fas fa-search"></i>
                        ) : (
                          <i class="fas fa-times-circle"></i>
                        )}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Col>
              </Form.Row>
            </Form>
            <hr />
            <Container>
              <center>
                <Row>
                  {this.state.product.map((prod, idx) => (
                    <Col key={idx} xs={3}>
                      <Card>
                        <Card.Body
                          style={{ cursor: "pointer" }}
                          onClick={() => this.detailShop(prod.productId)}
                        >
                          <i
                            class="fas fa-camera-retro"
                            style={{ fontSize: "11vh" }}
                          ></i>
                          <Card.Title>{prod.productName}</Card.Title>
                          <Card.Text>
                            {prod.stock == 0 ? (
                              <Button variant="danger" disabled>
                                Out of Stock
                              </Button>
                            ) : (
                              <p>Stock Available : {prod.stock} items</p>
                            )}
                            <p>
                              Rp.
                              {prod.unitPrice
                                .toString()
                                .replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  "."
                                )}
                              ,-
                            </p>
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Button
                            variant="primary"
                            size="md"
                            style={{ width: "80%" }}
                            onClick={() => this.addToCart(prod.productId, 1)}
                            disabled={prod.stock === 0}
                          >
                            add to cart
                          </Button>
                        </Card.Footer>
                      </Card>
                      <br />
                    </Col>
                  ))}
                </Row>
              </center>
            </Container>
            <Pagination
              color="primary"
              count={this.state.count}
              page={this.state.page}
              onChange={this.handleChange}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    statusLogin: state.Auth.statusLogin,
    dataUser: state.Auth.users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeLogin: (payload) => dispatch({ type: "LOGIN_SUCCESS", payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeBuyer);

//export default HomeBuyer;
