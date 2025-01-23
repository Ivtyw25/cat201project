package com.example.data;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.io.File;
import java.io.IOException;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;

public class JsonLoader {

    public static List<Card> loadCardsFromJson(InputStream inputStream) throws IOException {
        List<Card> cards = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(inputStream);
        JsonNode cardsArray = rootNode.get("cards");

        if (cardsArray != null && cardsArray.isArray()) {
            for (JsonNode categoryNode : cardsArray) {
                String category = categoryNode.get("category").asText();
                JsonNode items = categoryNode.get("items");
                
                if (items != null && items.isArray()) {
                    for (JsonNode cardNode : items) {
                        Card card = new Card(
                            cardNode.get("card_id").asInt(),
                            cardNode.get("name").asText(),
                            cardNode.get("description").asText(),
                            cardNode.get("price").asDouble(),
                            cardNode.get("stock").asInt(),
                            cardNode.get("rarity").asText(),
                            cardNode.get("image_url").asText(),
                            category  // Pass the category from the parent node
                        );
                        cards.add(card);
                    }
                }
            }
        }

            // Debug log
        System.out.println("Loaded cards: " + cards.size());
        for (Card card : cards) {
            System.out.println("Card: " + card.getName() + ", Category: " + card.getCategory());
        }

        return cards;
}

    // Update your save method to handle categories
    public static void saveCardsToJson(List<Card> cards, String filePath) 
            throws IOException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode rootNode = mapper.createObjectNode();
        ArrayNode cardsArray = mapper.createArrayNode();

        // Group cards by category
        Map<String, List<Card>> cardsByCategory = cards.stream()
            .collect(Collectors.groupingBy(
                card -> card.getCategory() != null ? card.getCategory() : "Uncategorized"
            ));

        // Create category nodes
        cardsByCategory.forEach((category, categoryCards) -> {
            ObjectNode categoryNode = mapper.createObjectNode();
            categoryNode.put("category", category);
            
            ArrayNode itemsArray = mapper.createArrayNode();
            for (Card card : categoryCards) {
                ObjectNode cardNode = mapper.createObjectNode();
                cardNode.put("card_id", card.getCardId());
                cardNode.put("name", card.getName());
                cardNode.put("description", card.getDescription());
                cardNode.put("price", card.getPrice());
                cardNode.put("stock", card.getStock());
                cardNode.put("rarity", card.getRarity());
                cardNode.put("image_url", card.getImageUrl());
                cardNode.put("category", card.getCategory());
                itemsArray.add(cardNode);
            }
            
            categoryNode.set("items", itemsArray);
            cardsArray.add(categoryNode);
        });

        rootNode.set("cards", cardsArray);
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), rootNode);
    }

    // Static inner class Card
    public static class Card {
        private int cardId;
        private String name;
        private String description;
        private double price;
        private int stock;
        private String rarity;
        private String imageUrl;
        private String category;

        // Constructor
        public Card(int cardId, String name, String description, double price, 
                   int stock, String rarity, String imageUrl, String category) {
            this.cardId = cardId;
            this.name = name;
            this.description = description;
            this.price = price;
            this.stock = stock;
            this.rarity = rarity;
            this.imageUrl = imageUrl;
            this.category = category;
        }

        // Getters for Card fields
        public int getCardId() {
            return cardId;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public double getPrice() {
            return price;
        }

        public int getStock() {
            return stock;
        }

        public String getRarity() {
            return rarity;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public String getCategory() {
            return category;
        }

        // Add deductStock method
        public void deductStock(int quantityToDeduct) {
            this.stock = this.stock - quantityToDeduct;
        }
    }
}
