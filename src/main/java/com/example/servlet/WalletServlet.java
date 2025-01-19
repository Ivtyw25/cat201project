package com.example.servlet;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;

@WebServlet("/Wallet")
public class WalletServlet extends HttpServlet {
    private static final String USER_FILE_PATH = "C:/Users/USER/Documents/Y2_S1/CAT 201/cat201project/src/main/webapp/data/users.json";
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            System.out.println("Action received: " + action); // Debug log

            int userId = Integer.parseInt(request.getParameter("userId"));
            System.out.println("User ID: " + userId); // Debug log
            
            if ("updateWallet".equals(action)) {
                double amount = Double.parseDouble(request.getParameter("amount"));
                System.out.println("Amount to deduct: " + amount); // Debug log
                
                // Read current user data
                Reader reader = new FileReader(USER_FILE_PATH);
                JsonObject userJson = gson.fromJson(reader, JsonObject.class);
                reader.close();
                
                System.out.println("Current user data: " + userJson.toString()); // Debug log
                
                JsonArray users = userJson.getAsJsonArray("users");
                boolean success = false;
                
                for (JsonElement element : users) {
                    JsonObject user = element.getAsJsonObject();
                    if (user.get("user_id").getAsInt() == userId) {
                        double currentWallet = user.get("wallet").getAsDouble();
                        System.out.println("Current wallet: " + currentWallet); // Debug log
                        user.addProperty("wallet", currentWallet - amount);
                        System.out.println("New wallet amount: " + (currentWallet - amount)); // Debug log
                        success = true;
                        break;
                    }
                }
                
                if (success) {
                    // Save updated data with pretty printing
                    Writer writer = new FileWriter(USER_FILE_PATH);
                    gson.toJson(userJson, writer);
                    writer.close();
                    
                    // Prepare success response with ordered fields
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("success", true);
                    out.print(gson.toJson(result));
                    System.out.println("Update successful"); // Debug log
                } else {
                    // Prepare failure response with ordered fields
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("success", false);
                    result.put("message", "User not found");
                    out.print(gson.toJson(result));
                    System.out.println("User not found"); // Debug log
                }
            } else {
                // Handle invalid action
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("success", false);
                result.put("message", "Invalid action");
                out.print(gson.toJson(result));
                System.out.println("Invalid action received"); // Debug log
            }
        } catch (Exception e) {
            // Handle exceptions with pretty-printed error response
            System.out.println("Error occurred: " + e.getMessage()); // Debug log
            e.printStackTrace(); // Print full stack trace
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            out.print(gson.toJson(error));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            int userId = Integer.parseInt(request.getParameter("userId"));
            
            if ("getBalance".equals(action)) {
                // Read current user data
                Reader reader = new FileReader(USER_FILE_PATH);
                JsonObject userJson = gson.fromJson(reader, JsonObject.class);
                reader.close();
                
                JsonArray users = userJson.getAsJsonArray("users");
                double balance = 0;
                
                for (JsonElement element : users) {
                    JsonObject user = element.getAsJsonObject();
                    if (user.get("user_id").getAsInt() == userId) {
                        balance = user.get("wallet").getAsDouble();
                        break;
                    }
                }
                
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("balance", balance);
                out.print(gson.toJson(result));
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            out.print(gson.toJson(error));
        }
    }
} 