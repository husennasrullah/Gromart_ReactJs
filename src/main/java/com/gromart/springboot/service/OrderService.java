package com.gromart.springboot.service;

import com.gromart.springboot.model.Order;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface OrderService {
    Map<String, Object> findAllOrders(int page, int limit);

    void saveOrder (Order order);

    Map <String, Object> findByUserId (String userId, int page, int limit);

    Map<String, Object> findByOrderDate (Date orderDate, int page, int limit);

    Order findById (String orderId);

    void deleteOrderById(String orderId);

    int countDetail (String cartId);

    void updateStatus (Order order);

    Map<String, Object> countTransaction ();




}
