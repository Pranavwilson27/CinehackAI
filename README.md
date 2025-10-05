
***

#  CinehackAI

This repository contains the web application built for **Cinehack.ai @FISAT** on 04/10/2025. It's an intelligent script breakdown tool designed to streamline the pre-production pipeline for filmmakers.

---

##  Team: Cinicon Alley

* **College**: SJCET Palai
* **Branch**: Artificial Intelligence and Data Science
* **Members**:
    * Pranav Wilson
    * Sai Krishna P
    * Jens Jose

---

##  The Problem Statement

> Create an intelligent Script Breakdown Tool that automatically categorizes and organizes script elements including characters, props, locations, wardrobes, and scheduling requirements to streamline the pre-production plan (Similar to StudioBinder).

---

##  Our Solution: Cinecon.Ally

**Cinecon.Ally** is a simple, AI-powered screenplay breakdown and editing tool. Its core purpose is to provide writers and production teams with a tool to upload screenplays and automatically break them down into their essential elements.

The system intelligently extracts and organizes the following components into a clean, tabulated format that can be downloaded as a **CSV file**:
* Scenes
* Characters
* Props
* Wardrobe
* Location & Time



###  Additional Features

To showcase the potential of the system, we've included two additional proof-of-concept tools.

#### 1. Simple Budget Estimation 💰
The application provides a preliminary budget estimate for the production. This is achieved by assigning average industry values to key fields (e.g., cast, crew, art department). The final estimate is then derived through simple calculations based on the script's contents.

* **Future Potential**: Develop a custom Machine Learning model trained on industry pre-production data to predict budgets with much higher accuracy.

#### 2. Character-Based Screen Time Ratio 📊
The application generates a pie chart visualizing the screen time distribution for each character. This gives the creative team a quick overview, making it easier to improvise and make necessary script changes during pre-production.



---

## 🚀 Future Potential

Cinicon.Ally aims to evolve into a comprehensive pre-production suite for writers and production teams. Future enhancements include:

* **All-in-One Writing & Management Tool**: Become a fully AI-powered screenplay analysis and development tool, allowing writers to store ideas, notes, and write full-bound screenplays (similar to Notion or Obsidian). This will provide the entire team with a single system and workflow to follow, Making it easier and creative.

* **Intelligent Scheduling System**: Provide an automated scheduling system that considers all extracted script elements. The schedule will be fully customizable, allowing the production team to make manual overrides as needed (similar to StudioBinder).

---

##  Tech Stack

### Backend
* **Runtime Environment**: Node.js
* **Web Framework**: Express.js
* **API**: Groq
* **Environment Variables**: dotenv

### Frontend
* HTML
* CSS
* JavaScript


