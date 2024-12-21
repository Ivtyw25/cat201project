package com.example.servlet;
import java.io.IOException;
import java.io.PrintWriter;

import com.example.util.MongoDBUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/mongoServlet")
public class MongoServlet extends HttpServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                // Test the MongoDB connection
        String connectionStatus = MongoDBUtil.testConnection();

        // Send the connection status to the browser
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h2>MongoDB Connection Test</h2>");
        out.println("<p>" + connectionStatus + "</p>");
        out.println("</body></html>");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    }
}
