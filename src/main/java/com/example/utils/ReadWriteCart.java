package com.example.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ReadWriteCart {
    private static final String CART_FILE_PATH = "C:\\Users\\houyu\\cat201project\\src\\main\\webapp\\data\\Cart.json";
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    public static boolean addToCart(int userId, int cardId, int quantity) {
        try {
            // Read current cart data
            JsonObject root = readCartFile();
            JsonArray cartArray = root.getAsJsonArray("cart");

            // Find user's cart
            boolean found = false;
            for (JsonElement element : cartArray) {
                JsonObject cartObj = element.getAsJsonObject();
                if (cartObj.get("user_id").getAsInt() == userId) {
                    // Found user's cart, add item
                    JsonArray items = cartObj.getAsJsonArray("items");
                    JsonObject newItem = new JsonObject();
                    newItem.addProperty("card_id", cardId);
                    newItem.addProperty("quantity", quantity);
                    items.add(newItem);
                    found = true;
                    break;
                }
            }

            if (!found) {
                System.out.println("User cart not found for ID: " + userId);
                return false;
            }

            // Save updated cart
            try (FileWriter writer = new FileWriter(CART_FILE_PATH)) {
                gson.toJson(root, writer);
                return true;
            }

        } catch (Exception e) {
            System.out.println("Error adding to cart: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static JsonObject readCartFile() throws IOException {
        try (Reader reader = new FileReader(CART_FILE_PATH)) {
            return JsonParser.parseReader(reader).getAsJsonObject();
        }
    }

    public static List<Map<String, Object>> getCartItems(int userId) {
        try {
            System.out.println("Getting cart items for userId: " + userId);
            JsonObject root = readCartFile();
            JsonArray cartArray = root.getAsJsonArray("cart");
            System.out.println("Total carts found: " + cartArray.size());

            for (JsonElement element : cartArray) {
                JsonObject cartObj = element.getAsJsonObject();
                int currentUserId = cartObj.get("user_id").getAsInt();
                System.out.println("Checking cart for userId: " + currentUserId);
                
                if (currentUserId == userId) {
                    JsonArray items = cartObj.getAsJsonArray("items");
                    System.out.println("Found items for user: " + items);
                    Type listType = new TypeToken<List<Map<String, Object>>>() {}.getType();
                    List<Map<String, Object>> result = gson.fromJson(items, listType);
                    System.out.println("Converted items: " + result);
                    return result;
                }
            }
            
            System.out.println("No cart found for userId: " + userId);
            return new ArrayList<>();
        } catch (Exception e) {
            System.out.println("Error getting cart items: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public static boolean removeFromCart(int userId, int cardId) {
        try {
            System.out.println("Removing from cart - userId: " + userId + ", cardId: " + cardId);
            
            JsonObject root = readCartFile();
            JsonArray cartArray = root.getAsJsonArray("cart");

            for (JsonElement element : cartArray) {
                JsonObject cartObj = element.getAsJsonObject();
                if (cartObj.get("user_id").getAsInt() == userId) {
                    JsonArray items = cartObj.getAsJsonArray("items");
                    
                    // Find and remove the item
                    for (int i = 0; i < items.size(); i++) {
                        JsonObject item = items.get(i).getAsJsonObject();
                        if (item.get("card_id").getAsInt() == cardId) {
                            items.remove(i);
                            System.out.println("Item removed successfully");
                            return saveCartFile(root);
                        }
                    }
                }
            }
            
            System.out.println("Item not found in cart");
            return false;
        } catch (Exception e) {
            System.out.println("Error removing from cart: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private static boolean saveCartFile(JsonObject root) throws IOException {
        try (FileWriter writer = new FileWriter(CART_FILE_PATH)) {
            gson.toJson(root, writer);
            return true;
        }
    }
    public static boolean clearCart(int userId,List<Integer> selectedItems) {return  true;}
} 