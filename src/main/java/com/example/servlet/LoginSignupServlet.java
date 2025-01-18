private void handleLogin(HttpServletRequest request, HttpServletResponse response) 
        throws IOException {
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    
    // Add debug logging
    System.out.println("Login attempt - Email: " + email);
    
    Map<String, Object> user = ReadWriteUser.validateLogin(email, password);
    
    if (user != null) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("Login successful");
    } else {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Invalid email or password");
    }
} 