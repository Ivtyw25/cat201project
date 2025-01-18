package com.example.data;

import java.util.List;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class Database {
    private static Database instance;
    private List<Movie> movies;

    // Private constructor to prevent instantiation
    private Database() {
        movies = new ArrayList<>();
        loadMoviesFromCSV();  // Load movies when the database is initialized
    }

    // Get the singleton instance of the database
    public static Database getInstance() {
        if (instance == null) {
            synchronized (Database.class) {
                if (instance == null) {
                    instance = new Database();
                }
            }
        }
        return instance;
    }

    // Load movies from CSV file (you can modify this to fit your CSV format)
    private void loadMoviesFromCSV() {
    	 try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("movies.csv");
                 BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {

                if (inputStream == null) {
                    throw new FileNotFoundException("movies.csv file not found in resources.");
                }

                System.out.println(inputStream.toString());

                String line;
                while ((line = reader.readLine()) != null) {
                    // Assuming the CSV format is "title, plot, year"
                    String[] movieData = line.split(",");
                    if (movieData.length == 3) {
                        String title = movieData[0].trim();
                        String plot = movieData[1].trim();
                        int year = Integer.parseInt(movieData[2].trim());
                        movies.add(new Movie(title, plot, year));
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
    }

    // Get movie by title
    public Movie getMovieByTitle(String title) {
        for (Movie movie : movies) {
            if (movie.getTitle().equalsIgnoreISSUE(title)) {
                return movie;
            }
        }
        return null;  // Return null if not found
    }

    // Get all movies (optional)
    public List<Movie> getAllMovies() {
        return movies;
    }
}
