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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/Login")
public class Login extends HttpServlet {

    @Override
    public void init() throws ServletException {
        super.init();
        System.out.println("=== Initializing Login Servlet ===");
        ReadWriteUser.loadUsers();
        System.out.println("=== Login Servlet Initialized ===");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        System.out.println("Received POST request with action: " + action); // Debug log

        if ("login".equals(action)) {
            System.out.println("Handling login request");
            handleLogin(request, response);
        } else if ("signup".equals(action)) {
            System.out.println("Handling signup request");
            handleSignup(request, response);
        } else {
            System.out.println("Invalid action received: " + action);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid action");
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        System.out.println("=== Login Debug ===");
        System.out.println("Received email: " + email);
        System.out.println("Received password: " + password);

        // Load users before validation (as a safeguard)
        ReadWriteUser.loadUsers();

        Map<String, Object> user = ReadWriteUser.validateLogin(email, password);
        System.out.println("User validation result: " + user);

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (user != null) {
            // Create response object with user data including role
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("email", user.get("email"));
            responseData.put("role", user.get("role")); // Make sure your user data includes role
            responseData.put("username", user.get("username"));
            responseData.put("wallet", user.get("wallet"));
            responseData.put("user_id", user.get("user_id"));

            System.out.println("Response data being sent: " + responseData);

            // Convert to JSON and send response
            String jsonResponse = new Gson().toJson(responseData);
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(jsonResponse);
            out.flush();
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid email or password");

            String jsonResponse = new Gson().toJson(errorResponse);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(jsonResponse);
            out.flush();
            
            System.out.println("Login failed for email: " + email);
        }
    }

    private void handleSignup(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            System.out.println("Starting signup process..."); // Debug log

            Map<String, Object> newUser = new HashMap<>();
            newUser.put("username", request.getParameter("username"));
            newUser.put("full_name", request.getParameter("full_name"));
            newUser.put("email", request.getParameter("email"));
            newUser.put("password", request.getParameter("password"));
            newUser.put("phone", request.getParameter("phone"));
            newUser.put("address", request.getParameter("address"));
            newUser.put("city", request.getParameter("city"));
            newUser.put("state", request.getParameter("state"));
            newUser.put("zip", request.getParameter("zip"));
            newUser.put("country", request.getParameter("country"));
            newUser.put("role", "user");

            System.out.println("New user data: " + newUser); // Debug log

            ReadWriteUser.addUser(newUser);
            System.out.println("User added to list successfully"); // Debug log

            boolean saved = ReadWriteUser.saveUsers();
            System.out.println("Save result: " + saved); // Debug log

            if (saved) {
                response.setContentType("application/json");
                Map<String, Object> successResponse = new HashMap<>();
                successResponse.put("success", true);
                successResponse.put("message", "User registered successfully");
                response.getWriter().write(new Gson().toJson(successResponse));
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setContentType("application/json");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to save user");
                response.getWriter().write(new Gson().toJson(errorResponse));
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Signup validation error: " + e.getMessage()); // Debug log
            response.setContentType("application/json");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            response.getWriter().write(new Gson().toJson(errorResponse));
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception e) {
            System.out.println("Unexpected error during signup: " + e.getMessage()); // Debug log
            e.printStackTrace(); // Print full stack trace
            response.setContentType("application/json");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred during signup: " + e.getMessage());
            response.getWriter().write(new Gson().toJson(errorResponse));
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Map<String, Object>> users = ReadWriteUser.getUsersList();
        response.setContentType("application/json");

        PrintWriter out = response.getWriter();
        out.print("{\"users\": " + new Gson().toJson(users) + "}");
    }
}
