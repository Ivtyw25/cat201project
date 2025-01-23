package com.example.servlet;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.google.gson.*;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;

@WebServlet("/WalletTopUp")
public class WalletServletTopUp extends HttpServlet {

    private static final String USER_FILE_PATH = "C:\\Users\\houyu\\cat201project\\src\\main\\webapp\\data\\users.json";
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // Parse the entire JSON body from the request
            JsonObject requestBody = gson.fromJson(request.getReader(), JsonObject.class);
            String action = requestBody.get("action").getAsString();
            int userId = requestBody.get("userId").getAsInt();
            double amount = requestBody.get("amount").getAsDouble();
            String operation = requestBody.get("operation").getAsString();

            System.out.println("Action received: " + action); // Debug log
            System.out.println("User ID: " + userId); // Debug log
            System.out.println("Amount to deduct: " + amount); // Debug log
            System.out.println("Operation: " + operation); // Debug log
            
            if ("updateWallet".equals(action)) {
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
                        
                        // Apply the operation (subtract amount)
                        user.addProperty("wallet", currentWallet + amount);
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
}