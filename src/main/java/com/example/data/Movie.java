package com.example.data;
public class Movie {
    private String title;
    private String plot;
    private int year;

    public Movie(String title, String plot, int year) {
        this.title = title;
        this.plot = plot;
        this.year = year;
    }

    // Getters
    public String getTitle() {
        return title;
    }

    public String getPlot() {
        return plot;
    }

    public int getYear() {
        return year;
    }

    // Convert Movie object to JSON
    public String toJson() {
        return "{ \"title\": \"" + title + "\", \"plot\": \"" + plot + "\", \"year\": " + year + " }";
    }
}

