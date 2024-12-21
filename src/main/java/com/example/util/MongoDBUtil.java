package com.example.util;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoDBUtil {
    private static MongoClient mongoClient;
    private static MongoDatabase database;

    // Initialize the MongoDB connection
    static {
    	String URI = "mongodb+srv://ivtyw123:Ivantham123%40123@cluster0.zqhw6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
            // Replace with your MongoDB URI or use localhost for local development
        try{
            mongoClient = MongoClients.create(URI);
            database = mongoClient.getDatabase("sample_mflix");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

     // Method to test MongoDB connection
    public static String testConnection(){

            // Check if the connection is valid by fetching the database name
            if (mongoClient != null && database != null) {
                return "Successfully connected to MongoDB. Database: " + database.getName();
            } else {
                return "MongoDB connection failed.";
            }

    }

    // Get the MongoDatabase instance
    public static MongoDatabase getDatabase() {
        return database;
    }

    // Get collection from MongoDB
    public static MongoCollection<Document> getCollection(String collectionName) {
        return database.getCollection(collectionName);
    }
}
