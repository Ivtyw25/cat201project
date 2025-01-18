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
        ReadWriteUser.loadUsers();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("login".equals(action)) {
            handleLogin(request, response);
        } else if ("signup".equals(action)) {
            handleSignup(request, response);
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Map<String, Object> user = ReadWriteUser.validateLogin(email, password);

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (user != null) {
            // Create response object with user data including role
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("email", user.get("email"));
            responseData.put("role", user.get("role")); // Make sure your user data includes role
            responseData.put("username", user.get("username"));

            // Convert to JSON and send response
            String jsonResponse = new Gson().toJson(responseData);
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(jsonResponse);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid email or password");
            
            String jsonResponse = new Gson().toJson(errorResponse);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(jsonResponse);
        }
    }

    private void handleSignup(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
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

            ReadWriteUser.addUser(newUser);

            if (ReadWriteUser.saveUsers()) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Failed to save user");
            }
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(e.getMessage());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An error occurred during signup");
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
