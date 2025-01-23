package com.example.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
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
            System.out.print("Hello here is remove from cart id is" + cardId + " succss? " + success);
        }
        else if ("clearCart".equals(action)) {
            StringBuilder jsonBuilder = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
            }

            // Parse the JSON body
            String jsonString = jsonBuilder.toString();
            JsonObject jsonObject = JsonParser.parseString(jsonString).getAsJsonObject();

            // Extract the "items" array
            JsonArray itemsArray = jsonObject.getAsJsonArray("items");
            System.out.println("Selected items to clear from cart:");

            // Extract card IDs from the items array
            List<Integer> cardIds = new ArrayList<>();
            for (JsonElement element : itemsArray) {
                JsonObject item = element.getAsJsonObject();
                int cardId = item.get("card_id").getAsInt();
                cardIds.add(cardId);
                System.out.println("Card ID: " + cardId);
            }

            // Call the method to clear the specified items from the cart
            success = ReadWriteCart.clearCart(userId, cardIds);
        }

        out.print(gson.toJson(Map.of("success", success)));
    }
} 