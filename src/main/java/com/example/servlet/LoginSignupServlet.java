package com.example.servlet;

import com.example.utils.ReadWriteUser;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/Login")
public class LoginSignupServlet extends HttpServlet {

    @Override
    public void init() throws ServletException {
        // Load users once during servlet initialization
        ReadWriteUser.loadUsers();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Parse the JSON body from the request
        JsonObject jsonRequest = JsonParser.parseReader(request.getReader()).getAsJsonObject();

        String action = jsonRequest.get("action").getAsString();
        String username = jsonRequest.get("username").getAsString();
        String password = jsonRequest.get("password").getAsString();

        List<Map<String, Object>> users = ReadWriteUser.getUsersList(); // Get the in-memory users list

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if ("signup".equalsIgnoreCase(action)) {
            boolean exists = users.stream().anyMatch(user -> user.get("username").equals(username));
            if (exists) {
                out.print("{\"success\": false, \"message\": \"User already exists.\"}");
            } else {
                int userId = users.stream()
                        .mapToInt(user -> (int) user.get("user_id"))
                        .max()
                        .orElse(0) + 1;

                Map<String, Object> newUser = new HashMap<>();
                newUser.put("user_id", userId);
                newUser.put("username", username);
                newUser.put("password", password);

                ReadWriteUser.addUser(newUser); // Add user to the in-memory list
                ReadWriteUser.saveUsers(); // Save updated list to JSON

                out.print("{\"success\": true, \"message\": \"Signup successful.\"}");
            }
        } else if ("login".equalsIgnoreCase(action)) {
            boolean validUser = users.stream()
                    .anyMatch(user -> user.get("username").equals(username) && user.get("password").equals(password));
            if (validUser) {
                out.print("{\"success\": true, \"message\": \"Login successful.\"}");
            } else {
                out.print("{\"success\": false, \"message\": \"Invalid credentials.\"}");
            }
        } else {
            out.print("{\"success\": false, \"message\": \"Invalid action.\"}");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Map<String, Object>> users = ReadWriteUser.getUsersList();
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();
        out.print("{\"users\": " + new Gson().toJson(users) + "}");
    }
}