const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
const PORT = 5500; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve the notes.html file
 app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
  
  // Serve the index.html file (default route)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
    // Read the contents of db.json and send it as a response
    const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
    res.json(notes);
  });
  
  // Receive a new note to save on the request body, add it to db.json, and return the new note
  app.post("/api/notes", (req, res) => {
    // Read the existing notes from db.json
    const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
  
    // Create a new note object with a unique ID
    const newNote = {
      id: uuid.v4(), // Generate a unique ID
      title: req.body.title,
      text: req.body.text,
    };
  
    // Add the new note to the array of notes
    notes.push(newNote);
  
    // Write the updated notes array back to db.json
    fs.writeFileSync("db.json", JSON.stringify(notes));
  
    // Respond with the new note
    res.json(newNote);
  });
  
  // Implement DELETE route (Bonus)
  app.delete("/api/notes/:id", (req, res) => {
    // Read the existing notes from db.json
    const notes = JSON.parse(fs.readFileSync("db.json", "utf8"));
  
    // Extract the note ID from the request parameters
    const noteId = req.params.id;
  
    // Find the index of the note with the specified ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);
  
    if (noteIndex !== -1) {
      // Remove the note from the array
      notes.splice(noteIndex, 1);
  
      // Write the updated notes array back to db.json
      fs.writeFileSync("db.json", JSON.stringify(notes));
  
      res.json({ message: "Note deleted" });
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  });

  // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });