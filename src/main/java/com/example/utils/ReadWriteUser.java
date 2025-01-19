package com.example.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.JsonArray;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

public class ReadWriteUser {

    private static final String USERS_FILE_PATH = "C:/Users/USER/Documents/Y2_S1/CAT 201/cat201project/src/main/webapp/data/users.json";
    private static final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .create();
    private static List<Map<String, Object>> usersList = new ArrayList<>();

    public static void loadUsers() {
        try {
            File file = new File(USERS_FILE_PATH);
            System.out.println("Attempting to load users from: " + file.getAbsolutePath());
            System.out.println("File exists: " + file.exists());

            if (!file.exists()) {
                System.out.println("Users file not found!");
                usersList = new ArrayList<>();
                return;
            }

            try (Reader reader = new FileReader(file)) {
                JsonElement jsonElement = JsonParser.parseReader(reader);
                JsonObject root = jsonElement.getAsJsonObject();
                JsonArray usersArray = root.getAsJsonArray("users");
                
                System.out.println("Number of users found in JSON: " + usersArray.size());

                Type listType = new TypeToken<List<Map<String, Object>>>() {}.getType();
                usersList = gson.fromJson(usersArray, listType);

                System.out.println("Users loaded successfully. Total users: " + usersList.size());
                for (Map<String, Object> user : usersList) {
                    // Initialize wallet if not present
                    if (user.get("wallet") == null) {
                        user.put("wallet", 0.00);
                        System.out.println("Initialized wallet for user: " + user.get("email"));
                    }
                    System.out.println("Loaded user: " + user.get("email") + 
                                     ", role: " + user.get("role") + 
                                     ", wallet: " + user.get("wallet"));
                }
            }

            if (usersList == null) {
                System.out.println("usersList is null after loading, creating new ArrayList");
                usersList = new ArrayList<>();
            }
        } catch (Exception e) {
            System.out.println("Error loading users: " + e.getMessage());
            e.printStackTrace();
            usersList = new ArrayList<>();
        }
    }

    public static boolean saveUsers() {
        try {
            File file = new File(USERS_FILE_PATH);
            try (Writer writer = new FileWriter(file)) {
                JsonObject root = new JsonObject();
                JsonArray usersArray = new JsonArray();

                for (Map<String, Object> user : usersList) {
                    JsonObject userObj = new JsonObject();
                    userObj.addProperty("user_id", ((Number) user.get("user_id")).intValue());
                    userObj.addProperty("username", (String) user.get("username"));
                    userObj.addProperty("full_name", (String) user.get("full_name"));
                    userObj.addProperty("email", (String) user.get("email"));
                    userObj.addProperty("password", (String) user.get("password"));
                    userObj.addProperty("phone", (String) user.get("phone"));
                    userObj.addProperty("address", (String) user.get("address"));
                    userObj.addProperty("city", (String) user.get("city"));
                    userObj.addProperty("state", (String) user.get("state"));
                    userObj.addProperty("zip", (String) user.get("zip"));
                    userObj.addProperty("country", (String) user.get("country"));
                    userObj.addProperty("role", (String) user.get("role"));
                    userObj.addProperty("wallet", user.get("wallet") != null ? 
                        ((Number) user.get("wallet")).doubleValue() : 0.00);

                    usersArray.add(userObj);
                }

                root.add("users", usersArray);
                String jsonOutput = gson.toJson(root);
                jsonOutput = jsonOutput.replace("\r\n", "\n").replace("\r", "\n");
                writer.write(jsonOutput);

                return true;
            }
        } catch (Exception e) {
            System.out.println("Error saving users: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public static List<Map<String, Object>> getUsersList() {
        return usersList;
    }

    public static Map<String, Object> validateLogin(String email, String password) {
        System.out.println("Validating login for email: " + email);
        System.out.println("Current number of users in list: " + usersList.size());

        for (Map<String, Object> user : usersList) {
            System.out.println("Checking user: " + user.get("email"));
            
            if (user.get("email").toString().equals(email)) {
                System.out.println("Email matched!");
                if (user.get("password").toString().equals(password)) {
                    System.out.println("Password matched! Login successful");
                    
                    // Ensure wallet exists
                    if (user.get("wallet") == null) {
                        user.put("wallet", 500.00);
                        saveUsers();
                    }
                    
                    return user;
                } else {
                    System.out.println("Password did not match");
                }
            }
        }
        
        System.out.println("No matching user found");
        return null;
    }

    private static String capitalizeString(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.toUpperCase();
    }

    public static void addUser(Map<String, Object> newUser) {
        System.out.println("Starting addUser process..."); // Debug log

        if (isEmailExists((String) newUser.get("email"))) {
            System.out.println("Email already exists: " + newUser.get("email")); // Debug log
            throw new IllegalArgumentException("Email already exists");
        }

        int nextId = usersList.stream()
                .mapToInt(user -> ((Number) user.get("user_id")).intValue())
                .max()
                .orElse(0) + 1;

        System.out.println("Generated next user_id: " + nextId); // Debug log

        Map<String, Object> orderedUser = new LinkedHashMap<>();
        orderedUser.put("user_id", nextId);
        orderedUser.put("username", newUser.get("username"));
        orderedUser.put("full_name", capitalizeString((String) newUser.get("full_name")));
        orderedUser.put("email", newUser.get("email"));
        orderedUser.put("password", newUser.get("password"));
        orderedUser.put("phone", newUser.get("phone"));
        orderedUser.put("address", capitalizeString((String) newUser.get("address")));
        orderedUser.put("city", capitalizeString((String) newUser.get("city")));
        orderedUser.put("state", capitalizeString((String) newUser.get("state")));
        orderedUser.put("zip", newUser.get("zip"));
        orderedUser.put("country", capitalizeString((String) newUser.get("country")));
        orderedUser.put("role", "user");
        orderedUser.put("wallet", 0.00);

        System.out.println("Adding user to list with wallet: " + orderedUser.get("wallet")); // Debug log
        usersList.add(orderedUser);
        System.out.println("Current usersList size: " + usersList.size()); // Debug log
        
        // Save the updated users list to file
        boolean saved = saveUsers();
        if (saved) {
            System.out.println("User saved successfully with wallet balance: " + orderedUser.get("wallet"));
        } else {
            System.out.println("Error saving user!");
        }
    }

    private static boolean isEmailExists(String email) {
        return usersList.stream()
                .anyMatch(user -> email.equals(user.get("email")));
    }
}
