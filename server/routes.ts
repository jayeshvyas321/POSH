import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertNotificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Logs download route
  app.get("/logs/download", async (req, res) => {
    // Basic auth check (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // TODO: Validate token and permissions if needed

    // Example: send dummy logs file
    res.setHeader("Content-Disposition", "attachment; filename=logs.txt");
    res.setHeader("Content-Type", "text/plain");
    res.send("Log line 1\nLog line 2\nLog line 3\n");
  });
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mark user as inactive instead of actual deletion
      await storage.updateUser(id, { isActive: false });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });



  // Notification routes
  app.get("/api/users/:id/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.isActive).length;
      
      // Calculate user distribution by role
      const adminUsers = users.filter(u => u.role === 'admin').length;
      const managerUsers = users.filter(u => u.role === 'manager').length;
      const employeeUsers = users.filter(u => u.role === 'employee').length;

      res.json({
        totalUsers,
        activeUsers,
        adminUsers,
        managerUsers,
        employeeUsers
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Roles routes (mock for now)
  app.get("/api/roles", async (req, res) => {
    try {
      const mockRoles = [
        {
          id: 1,
          name: 'admin',
          permissions: ['user_view', 'user_edit', 'user_create', 'user_delete', 'reports_view', 'settings_manage'],
          description: 'Full system access',
          createdAt: new Date('2024-01-01')
        },
        {
          id: 2,
          name: 'manager',
          permissions: ['user_view', 'user_edit', 'reports_view'],
          description: 'Can manage users and view reports',
          createdAt: new Date('2024-01-01')
        },
        {
          id: 3,
          name: 'employee',
          permissions: [],
          description: 'Basic user access',
          createdAt: new Date('2024-01-01')
        }
      ];
      res.json(mockRoles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/roles", async (req, res) => {
    try {
      // In a real app, you'd save to database
      // For now, just return the created role with an ID
      const roleData = req.body;
      const newRole = {
        ...roleData,
        id: Date.now(), // Mock ID
        createdAt: new Date(),
      };
      res.json(newRole);
    } catch (error) {
      res.status(400).json({ message: "Failed to create role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
