package com.example.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.JsonArray;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

public class ReadWriteUser {

    private static final String USERS_FILE_PATH = "C:/Users/junki/cat201project/src/main/webapp/data/users.json";
    private static final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .disableHtmlEscaping()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .create();
    private static List<Map<String, Object>> usersList = new ArrayList<>();

    public static void loadUsers() {
        try {
            File file = new File(USERS_FILE_PATH);
            if (!file.exists()) {
                usersList = new ArrayList<>();
                return;
            }

            try (Reader reader = new FileReader(file)) {
                JsonElement jsonElement = JsonParser.parseReader(reader);
                JsonObject root = jsonElement.getAsJsonObject();
                JsonArray usersArray = root.getAsJsonArray("users");
                Type listType = new TypeToken<List<Map<String, Object>>>() {
                }.getType();
                usersList = gson.fromJson(usersArray, listType);
            }

            if (usersList == null) {
                usersList = new ArrayList<>();
            }
        } catch (Exception e) {
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
                    usersArray.add(userObj);
                }

                root.add("users", usersArray);
                String jsonOutput = gson.toJson(root);
                jsonOutput = jsonOutput.replace("\r\n", "\n").replace("\r", "\n");
                writer.write(jsonOutput);

                return true;
            }
        } catch (Exception e) {
            e.printStackTrace(); // Temporarily add this for debugging
            return false;
        }
    }

    public static List<Map<String, Object>> getUsersList() {
        return usersList;
    }

    public static Map<String, Object> validateLogin(String email, String password) {
        return usersList.stream()
                .filter(user -> email.equals(user.get("email")) &&
                        password.equals(user.get("password")))
                .findFirst()
                .orElse(null);
    }

    private static String capitalizeString(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.toUpperCase();
    }

    public static void addUser(Map<String, Object> newUser) {
        if (isEmailExists((String) newUser.get("email"))) {
            throw new IllegalArgumentException("Email already exists");
        }

        int nextId = usersList.stream()
                .mapToInt(user -> ((Number) user.get("user_id")).intValue())
                .max()
                .orElse(0) + 1;

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
        usersList.add(orderedUser);
    }

    private static boolean isEmailExists(String email) {
        return usersList.stream()
                .anyMatch(user -> email.equals(user.get("email")));
    }
}
