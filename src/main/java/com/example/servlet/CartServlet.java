package com.example.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.utils.ReadWriteCart;
import com.google.gson.Gson;

@WebServlet("/Cart")
public class CartServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        if ("getCart".equals(action)) {
            try {
                int userId = Integer.parseInt(request.getParameter("userId"));
                System.out.println("Fetching cart for userId: " + userId);
                
                List<Map<String, Object>> cartItems = ReadWriteCart.getCartItems(userId);
                System.out.println("Cart items found: " + cartItems);
                
                String jsonResponse = gson.toJson(cartItems);
                System.out.println("Sending response: " + jsonResponse);
                
                out.print(jsonResponse);
            } catch (Exception e) {
                System.out.println("Error in getCart: " + e.getMessage());
                e.printStackTrace();
                out.print("[]");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        int userId = Integer.parseInt(request.getParameter("userId"));
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        boolean success = false;

        if ("addToCart".equals(action)) {
            int cardId = Integer.parseInt(request.getParameter("cardId"));
            int quantity = Integer.parseInt(request.getParameter("quantity"));
            success = ReadWriteCart.addToCart(userId, cardId, quantity);
        } 
        else if ("removeFromCart".equals(action)) {
            int cardId = Integer.parseInt(request.getParameter("cardId"));
            success = ReadWriteCart.removeFromCart(userId, cardId);
        }

        out.print(gson.toJson(Map.of("success", success)));
    }
} 