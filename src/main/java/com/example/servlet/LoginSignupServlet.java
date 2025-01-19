import com.google.gson.Gson;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import com.example.utils.ReadWriteUser;

private void handleLogin(HttpServletRequest request, HttpServletResponse response) 
        throws IOException {
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    
    // Add debug logging
    System.out.println("Login attempt - Email: " + email);
    System.out.println("Login attempt - Password: " + password); // Be careful with logging passwords in production
    
    Map<String, Object> user = ReadWriteUser.validateLogin(email, password);
    System.out.println("User object returned: " + user); // See what validateLogin returns
    
    response.setContentType("application/json");
    PrintWriter out = response.getWriter();
    
    if (user != null) {
        // Create response object with user data including role
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("success", true);
        responseData.put("email", user.get("email"));
        responseData.put("role", user.get("role")); // Include role in response
        responseData.put("username", user.get("username"));

        // Debug log
        System.out.println("Response data: " + responseData);
        
        // Convert to JSON and send response
        String jsonResponse = new Gson().toJson(responseData);
        response.setStatus(HttpServletResponse.SC_OK);
        out.print(jsonResponse);
        
        System.out.println("Login successful - Role: " + user.get("role")); // Debug log
    } else {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Invalid email or password");
        
        String jsonResponse = new Gson().toJson(errorResponse);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        out.print(jsonResponse);
        
        System.out.println("Login failed for email: " + email); // Debug log
    }
}