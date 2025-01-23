package com.example.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.utils.ReadWriteCart;
import com.google.gson.*;

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
        // Log headers for debugging
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            System.out.println(paramName + ": " + request.getParameter(paramName));
        }
        // Read the request body
        BufferedReader reader = request.getReader();
        StringBuilder requestBody = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }
        System.out.println("Request Body: " + requestBody.toString());

        // Parse the request body if it's JSON
        String contentType = request.getContentType();
        String action = null;
        int userId = 0;
        boolean success = false;

        if ("application/x-www-form-urlencoded".equalsIgnoreCase(contentType)) {
            action = request.getParameter("action");
            userId = Integer.parseInt(request.getParameter("userId"));
            String items = request.getParameter("items");

            if ("clearCart".equals(action) && items != null) {
                JsonArray itemsArray = JsonParser.parseString(items).getAsJsonArray();
                List<Integer> cardIds = new ArrayList<>();
                for (JsonElement element : itemsArray) {
                    JsonObject item = element.getAsJsonObject();
                    cardIds.add(item.get("card_id").getAsInt());
                }

                success = ReadWriteCart.clearCart(userId, cardIds);
            }
        }

        // Send JSON response
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(Map.of("success", success)));
    }

} 