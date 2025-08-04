import { 
  users, notifications,
  type User, type InsertUser, 
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Notification methods
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notifications: Map<number, Notification>;
  private currentUserId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentNotificationId = 1;

    // Initialize with sample users and data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample users with simplified permissions
    const adminUser = await this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      permissions: ["user_view", "user_edit", "user_create", "user_delete", "reports_view", "settings_manage"],
      firstName: "John",
      lastName: "Doe",
      isActive: true,
    });

    const managerUser = await this.createUser({
      username: "manager",
      email: "manager@example.com",
      password: "manager123",
      role: "manager",
      permissions: ["user_view", "user_edit", "reports_view"],
      firstName: "Jane",
      lastName: "Smith",
      isActive: true,
    });

    const employeeUser = await this.createUser({
      username: "employee",
      email: "employee@example.com",
      password: "employee123",
      role: "employee",
      permissions: [],
      firstName: "Bob",
      lastName: "Johnson",
      isActive: true,
    });

    // Create sample notifications
    await this.createNotification({
      userId: employeeUser.id,
      title: "Welcome to the System",
      message: "Your account has been created successfully",
      type: "info",
      isRead: false,
    });

    await this.createNotification({
      userId: managerUser.id,
      title: "Manager Access Granted",
      message: "You now have access to user management features",
      type: "info",
      isRead: false,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "employee",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }



  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      type: insertNotification.type || "info",
      isRead: insertNotification.isRead ?? false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
