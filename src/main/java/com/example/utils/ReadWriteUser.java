package com.example.utils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ReadWriteUser {

    private static final String USERS_FILE_NAME = "users.json"; // Name of the file in resources
    private static final Gson gson = new Gson();
    private static List<Map<String, Object>> usersList = new ArrayList<>();

    // Load users from JSON once
    public static void loadUsers() {
        try (InputStream inputStream = ReadWriteUser.class.getClassLoader().getResourceAsStream(USERS_FILE_NAME)) {
            if (inputStream == null) {
                throw new FileNotFoundException("File not found in resources: " + USERS_FILE_NAME);
            }

            Reader reader = new InputStreamReader(inputStream);
            Type listType = new TypeToken<List<Map<String, Object>>>() {}.getType();
            usersList = gson.fromJson(reader, listType);

            if (usersList == null) {
                usersList = new ArrayList<>();
            }
        } catch (IOException e) {
            e.printStackTrace();
            usersList = new ArrayList<>();
        }
    }

    // Get the users list
    public static List<Map<String, Object>> getUsersList() {
        return usersList;
    }

    // Add a new user
    public static void addUser(Map<String, Object> newUser) {
        usersList.add(newUser);
    }

    // Save users list back to JSON
    public static void saveUsers() {
        try {
            // Find the path of the resource file
            String filePath = ReadWriteUser.class.getClassLoader().getResource(USERS_FILE_NAME).getPath();

            // Write updated user data back to the JSON file
            try (Writer writer = new FileWriter(filePath)) {
                gson.toJson(usersList, writer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
