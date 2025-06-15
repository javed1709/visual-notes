// import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import Note from "../models/Note.js";
dotenv.config();

// Initialize Groq client with API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function run(query) {
  try {
    // Use Gemini AI model to generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro-preview-06-05",
      contents: query,
    });

    // Extract and return the text response
    return response.text;
  } catch (error) {
    console.error("Error using Gemini AI model:", error);
    throw new Error("Failed to generate content using Gemini AI.");
  }
} 


export async function generateAnswers(req, res) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Prompt text as per prompt.txt content
    const prompt = `write the short answers for these in the following format:
- strict: if differences between or comparision of two things are needed, give me a markdown table for it.
- strict: if diagrams are asked, give me a mermaidjs script for it.
- length: answers for each question should be around half a4 page when printed
- response should be with only markdown syntaxes like #, ##, bullet points, number points etc.
- format of response: question and answer. question is a ## heading (with question number) and answers (sideheadings with ### and bullets, numbers). separate with newlines.
- make damn sure about the mermaid script you give 100% accuratre and correct`;
    let fullContent = "";
    // Process the query in batches (5 lines each)
    const lines = query.split("\n");
    for (let i = 0; i < lines.length; i += 5) {
      const batch = lines.slice(i, i + 5).join("\n");
      const combinedQuery = batch + "\n" + prompt;
      const answer = await run(combinedQuery);
      fullContent += "\n" + answer;
    }

    try {
      // Store the note with content directly in MongoDB
      const note = await Note.create({ 
        owner: req.user._id, 
        content: fullContent,
        isPublic: false,
        title: query.split('\n')[0].substring(0, 50) || 'AI Generated Note' // Use first line as title
      });

      res.json({ 
        _id: note._id,
        content: note.content,
        title: note.title
      });
    } catch (error) {
      console.error("Note creation failed:", error);
      res.status(500).json({ message: "Failed to create note. Please try again later." });
    }
  } catch (error) {
    console.error("Generate answers error:", error);
    res.status(500).json({ message: error.message });
  }
}

// Endpoint to update a note as public (share the note)
export async function shareNote(req, res) {
  try {
    const { id } = req.params;
    // Find note and ensure the logged-in user is the owner.
    const note = await Note.findOne({ _id: id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.isPublic = true;
    await note.save();
    res.json({ message: "Note is now public", id: note._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all notes for the current user
export async function getUserNotes(req, res) {
  try {
    // Find all notes where the owner matches the current user's ID
    const notes = await Note.find({ owner: req.user._id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.json(notes);
  } catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function getSharedNote(req, res) {
  try {
    const { id } = req.params;
    // Find note and only return it if it's public
    const note = await Note.findOne({ _id: id, isPublic: true })
      .populate('owner', 'name');
    
    if (!note) {
      return res.status(404).json({ message: 'Shared note not found or not public' });
    }
    
    // Return the note with owner name and content
    res.json({
      _id: note._id,
      content: note.content,
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      ownerName: note.owner ? note.owner.name : 'Anonymous',
    });
  } catch (error) {
    console.error('Error fetching shared note:', error);
    res.status(500).json({ message: error.message });
  }
}

// Save manually created note
export async function saveManualNote(req, res) {
  try {
    const { title, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    try {
      // Create note record in database with content directly
      const note = await Note.create({
        title: title || 'Untitled Note',
        owner: req.user._id,
        content: content,
        isPublic: false
      });

      res.status(201).json({
        _id: note._id,
        title: note.title,
        content: note.content,
        isPublic: note.isPublic,
        createdAt: note.createdAt
      });
    } catch (error) {
      console.error("Note creation failed:", error);
      res.status(500).json({ message: "Failed to create note. Please try again later." });
    }
  } catch (error) {
    console.error('Error saving manual note:', error);
    res.status(500).json({ message: error.message });
  }
}

// Update an existing note
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find the note and verify ownership
    const note = await Note.findOne({ _id: id, owner: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }

    try {
      // Update note fields directly
      note.title = title || note.title;
      note.content = content;
      await note.save();

      res.json({
        _id: note._id,
        title: note.title,
        content: note.content,
        isPublic: note.isPublic,
        updatedAt: note.updatedAt
      });
    } catch (error) {
      console.error("Note update failed:", error);
      res.status(500).json({ message: "Failed to update note. Please try again later." });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: error.message });
  }
}

// Get single note by ID (for the user)
export async function getNoteById(req, res) {
  try {
    const { id } = req.params;
    // Find note and ensure the logged-in user is the owner
    const note = await Note.findOne({ _id: id, owner: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({
      _id: note._id,
      title: note.title || 'Untitled Note',
      content: note.content,
      isPublic: note.isPublic,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: error.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    // Find note and ensure the logged-in user is the owner
    const note = await Note.findOne({ _id: id, owner: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }
    
    await Note.deleteOne({ _id: id });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: error.message });
  }
}