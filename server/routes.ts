import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWheelSegmentSchema, insertWheelSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all wheel segments
  app.get("/api/segments", async (req, res) => {
    try {
      const segments = await storage.getWheelSegments();
      res.json(segments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch segments" });
    }
  });

  // Create a new wheel segment
  app.post("/api/segments", async (req, res) => {
    try {
      const validatedData = insertWheelSegmentSchema.parse(req.body);
      const segment = await storage.createWheelSegment(validatedData);
      res.status(201).json(segment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid segment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create segment" });
      }
    }
  });

  // Delete a wheel segment
  app.delete("/api/segments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid segment ID" });
      }
      
      await storage.deleteWheelSegment(id);
      res.status(200).json({ message: "Segment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete segment" });
    }
  });

  // Reset all segments
  app.delete("/api/segments", async (req, res) => {
    try {
      await storage.deleteAllWheelSegments();
      res.status(200).json({ message: "All segments deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset segments" });
    }
  });

  // Get wheel session
  app.get("/api/session", async (req, res) => {
    try {
      const session = await storage.getWheelSession();
      if (!session) {
        return res.status(404).json({ message: "No session found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Update wheel session
  app.patch("/api/session", async (req, res) => {
    try {
      const validatedData = insertWheelSessionSchema.partial().parse(req.body);
      const session = await storage.createOrUpdateWheelSession(validatedData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid session data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update session" });
      }
    }
  });

  // Increment spin count
  app.post("/api/session/spin", async (req, res) => {
    try {
      const session = await storage.incrementSpinCount();
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment spin count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
