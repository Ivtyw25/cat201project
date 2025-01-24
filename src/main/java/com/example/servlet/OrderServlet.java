package com.example.servlet;

import com.google.gson.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@WebServlet("/order")
public class OrderServlet extends HttpServlet {

    private final static String ORDER_FILE_PATH = "C:\\Users\\houyu\\cat201project\\src\\main\\webapp\\data\\Order.json";
    private final static String CARD_FILE_PATH = "C:\\Users\\houyu\\cat201project\\src\\main\\webapp\\data\\Card.json";
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Read existing orders from the JSON file
            JsonObject root = readOrderFile();
            JsonArray ordersArray = root.getAsJsonArray("orders");

            // Convert the orders data to a pretty-printed JSON string
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String jsonResponse = gson.toJson(ordersArray);

            // Respond with the orders in JSON format
            response.getWriter().write(jsonResponse);

            // Set response status to OK
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        // Set response type to JSON
        response.setContentType("application/json");
        try {

            String action = request.getParameter("action");
            if ("addOrder".equals(action)) {
                String itemsParam = request.getParameter("items");
                Integer userId = Integer.parseInt(request.getParameter("userId"));
                JsonArray items = JsonParser.parseString(itemsParam).getAsJsonArray();

                // Create a new order object
                JsonObject newOrder = new JsonObject();
                newOrder.addProperty("order_id", UUID.randomUUID().toString());
                newOrder.addProperty("user_id", userId);
                newOrder.addProperty("total_sales", calculateTotalSales(items));
                newOrder.addProperty("status", "Ready to ship");
                newOrder.add("items", items);

                // Read existing orders from the JSON file
                JsonObject root = readOrderFile();
                JsonArray ordersArray = root.getAsJsonArray("orders");

                // Add the new order to the orders array
                ordersArray.add(newOrder);

                // Write updated orders back to the file
                writeOrderFile(root);

                // Respond with success
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"Order added successfully\"}");
            } else if ("shipOrder".equals(action)){
                System.out.println("I can enter ship order");
                JsonObject root = readOrderFile();
                JsonArray ordersArray = root.getAsJsonArray("orders");
                String orderId = request.getParameter("orderID");

                // Iterate through orders and update the status of the matching order
                boolean orderUpdated = false;  // To check if any order was updated
                for (JsonElement orderElement : ordersArray) {
                    JsonObject order = orderElement.getAsJsonObject();
                    String currentOrderId = order.get("order_id").getAsString();

                    // Log order id and compare with the given orderId
                    System.out.println("Checking order with order_id: " + currentOrderId);
                    System.out.println(orderId);
                    if (currentOrderId.equals(orderId)) {
                        System.out.println("Found matching order. Updating status to 'Shipped'");
                        order.addProperty("status", "Shipped");
                        orderUpdated = true;
                        break;  // Exit the loop after finding the matching order
                    }
                }

                writeOrderFile(root);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"order Shipped successfully  \"}");
            } else {
                // Respond with error if action or items are invalid
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Invalid action or items parameter\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Respond with error
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"An error occurred while processing the request\"}");
        }
    }

    private double getPriceById(int cardId) throws IOException {
        FileReader reader = new FileReader(CARD_FILE_PATH);
        JsonParser parser = new JsonParser();
        JsonObject root = parser.parse(reader).getAsJsonObject();
        JsonArray ordersArray = root.getAsJsonArray("cards");
        for (JsonElement order : ordersArray) {
            JsonObject orderObj = order.getAsJsonObject();
            JsonArray items = orderObj.getAsJsonArray("items");
            for (JsonElement item : items) {
                JsonObject itemObj = item.getAsJsonObject();
                if (itemObj.get("card_id").getAsInt() == cardId) {
                    return itemObj.get("price").getAsDouble();
                }
            }
        }
        throw new IllegalArgumentException("Card Id not found");
    }

    private double calculateTotalSales(JsonArray items) throws IOException {
        double totalSales = 0.0;
        for (JsonElement itemElement : items) {
            JsonObject item = itemElement.getAsJsonObject();
            int cardId = item.get("card_id").getAsInt();
            int quantity = item.get("quantity").getAsInt();
            double price = getPriceById(cardId);
            totalSales += quantity * price;
        }
        return totalSales;
    }

    private JsonObject readOrderFile() throws IOException {
        if (!Files.exists(Paths.get(ORDER_FILE_PATH))) {
            // If the file doesn't exist, create an empty orders structure
            JsonObject root = new JsonObject();
            root.add("orders", new JsonArray());
            writeOrderFile(root);
            return root;
        }
        String jsonContent = new String(Files.readAllBytes(Paths.get(ORDER_FILE_PATH)));
        return JsonParser.parseString(jsonContent).getAsJsonObject();
    }

    private void writeOrderFile(JsonObject root) throws IOException {
        try (Writer writer = new FileWriter(ORDER_FILE_PATH)) {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            gson.toJson(root, writer);
        }
    }
}
