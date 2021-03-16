package com.gromart.springboot.service;

import com.gromart.springboot.model.Product;
import com.gromart.springboot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAllProducts() {
        List<Product> product = productRepository.findAll();
        return product;
    }

    @Override
    public List<Product> findAllWithPaging(int page, int limit) {
        List<Product> product = productRepository.findAllWithPaging(page, limit);
        return product;
    }

    public Product findById(String productId) {

        return (Product) productRepository.findById(productId).get();
    }

    public Product findByName(String name) {
        return productRepository.findByName(name).get(0);
    }

    @Override
    public List<Product> searchId(String productId) {
        return productRepository.searchId(productId);
    }

    @Override
    public List<Product> searchName(String productName) {
        return productRepository.searchName(productName);
    }

    public void saveProduct(Product product) {
        synchronized (this) {    //  Critical section synchronized
            productRepository.saveProduct(product);
        }
    }

    public void updateProduct(Product product) {
        synchronized (this) {    //  Critical section synchronized
            productRepository.updateProduct(product);
        }
    }


    public void deleteProductById(String productId) {
        synchronized (this) {    //  Critical section synchronized
            productRepository.deleteProductById(productId);
        }
    }

    public boolean isProductExist(Product product) {

        return productRepository.findByName(product.getProductName()).size() != 0;
    }

    @Override
    public int findAllCount() {
        return productRepository.findAllCount();
    }

    @Override
    public int findAllCountId() {
        return 0;
    }

    @Override
    public int findAllCountName() {
        return 0;
    }

    public void deleteAllProducts() {
        productRepository.deleteAllProducts();
    }

}