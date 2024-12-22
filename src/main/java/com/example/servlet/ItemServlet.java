package com.example.servlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.data.Database;
import com.example.data.Movie;


@WebServlet("/itemServlet")
public class ItemServlet extends HttpServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get the title parameter from the request
        Database db = Database.getInstance();

        // Fetch all movies from the database
        List<Movie> movies = db.getAllMovies();

        // Set the response content type to JSON
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (movies != null && !movies.isEmpty()) {
            // Convert the list of movies to JSON format and send it as the response
            out.println("[");
            for (int i = 0; i < movies.size(); i++) {
                Movie movie = movies.get(i);
                out.print("{");
                out.print("\"title\": \"" + movie.getTitle() + "\", ");
                out.print("\"plot\": \"" + movie.getPlot() + "\", ");
                out.print("\"year\": " + movie.getYear());
                out.print("}");
                if (i < movies.size() - 1) {
                    out.print(", ");
                }
            }
            out.println("]");
        } else {
            // If no movies are found, return an empty JSON array
            out.println("[]");
        }
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    }
}
