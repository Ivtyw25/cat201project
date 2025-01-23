package com.example.servlet;

import java.io.FileInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.data.JsonLoader; // Correct the import to JsonLoader class
import com.example.data.JsonLoader.Card; // Ensure the correct path to Card class
import java.io.BufferedReader;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/readCard")
public class ReadCard extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set the response content type to JSON
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Load cards from the JSON file using absolute path
        String absolutePath = "C:\\Users\\houyu\\cat201project\\src\\main\\webapp\\data\\Card.json";
        try (InputStream inputStream = new FileInputStream(absolutePath)) {
            if (inputStream == null) {
                // Handle the case where the file is not found
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.println("{\"error\": \"Resource file not found\"}");
                return;
            }

            // Rest of your code remains the same
            List<JsonLoader.Card> cards = JsonLoader.loadCardsFromJson(inputStream);

            if (cards != null && !cards.isEmpty()) {
                // Convert the list of cards to JSON format and send it as the response
                out.println("[");
                for (int i = 0; i < cards.size(); i++) {
                    JsonLoader.Card card = cards.get(i);
                    out.print("{");
                    out.print("\"card_id\": " + card.getCardId() + ", ");
                    out.print("\"name\": \"" + card.getName() + "\", ");
                    out.print("\"description\": \"" + card.getDescription() + "\", ");
                    out.print("\"price\": " + card.getPrice() + ", ");
                    out.print("\"stock\": " + card.getStock() + ", ");
                    out.print("\"rarity\": \"" + card.getRarity() + "\", ");
                    out.print("\"image_url\": \"" + card.getImageUrl() + "\", ");
                    out.print("\"category\": \"" + card.getCategory() + "\""); // Added category
                    out.print("}");
                    if (i < cards.size() - 1) {
                        out.print(", ");
                    }
                }
                out.println("]");
            } else {
                out.println("[]");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Failed to load cards\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();

        try {
            // Read the JSON input from request body
            BufferedReader reader = request.getReader();
            StringBuilder jsonInput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonInput.append(line);
            }

            // Parse the input JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode cardData = mapper.readTree(jsonInput.toString());

            // Read existing cards
            String absolutePath = "C:\\Users\\junki\\cat201project\\src\\main\\webapp\\data\\Card.json";
            File jsonFile = new File(absolutePath);
            List<JsonLoader.Card> cards = JsonLoader.loadCardsFromJson(new FileInputStream(jsonFile));

            // Generate new card ID (max existing ID + 1)
            int newCardId = cards.stream()
                    .mapToInt(JsonLoader.Card::getCardId)
                    .max()
                    .orElse(0) + 1;

            // Create new card
            JsonLoader.Card newCard = new JsonLoader.Card(
                    newCardId,
                    cardData.get("name").asText(),
                    cardData.get("description").asText(),
                    cardData.get("price").asDouble(),
                    cardData.get("stock").asInt(),
                    cardData.get("rarity").asText(),
                    cardData.get("image_url").asText(),
                    cardData.get("category").asText());

            // Add new card to list
            cards.add(newCard);

            // Save updated list
            JsonLoader.saveCardsToJson(cards, absolutePath);

            response.setStatus(HttpServletResponse.SC_OK);
            out.println("{\"message\": \"Card added successfully\", \"id\": " + newCardId + "}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Failed to add card: " + e.getMessage() + "\"}");
        }
    }

    // Add this new method to handle DELETE requests
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();

        try {
            // Get the card ID from the request parameters
            int cardId = Integer.parseInt(request.getParameter("id"));
            System.out.println("Attempting to delete card with ID: " + cardId); // Debug log

            // Read the existing JSON file
            String absolutePath = "C:/Users/USER/Documents/Y2_S1/CAT 201/cat201project/src/main/webapp/data/Card.json";
            File jsonFile = new File(absolutePath);

            if (!jsonFile.exists()) {
                System.out.println("File not found at: " + absolutePath); // Debug log
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.println("{\"error\": \"JSON file not found\"}");
                return;
            }

            // Read the current cards
            List<JsonLoader.Card> cards = JsonLoader.loadCardsFromJson(new FileInputStream(jsonFile));
            System.out.println("Loaded " + cards.size() + " cards"); // Debug log

            // Find and remove the card with matching ID
            boolean cardFound = cards.removeIf(card -> card.getCardId() == cardId);
            System.out.println("Card found and removed: " + cardFound); // Debug log

            if (cardFound) {
                // Write the updated list back to the JSON file
                // You'll need to implement this method in JsonLoader
                JsonLoader.saveCardsToJson(cards, absolutePath);
                response.setStatus(HttpServletResponse.SC_OK);
                out.println("{\"message\": \"Card deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.println("{\"error\": \"Card not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Failed to delete card\"}");
        }
    }

    // Add this method to handle CORS preflight requests
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, DELETE, POST");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
