import { 
  users, trainings, userTrainings, notifications,
  type User, type InsertUser, 
  type Training, type InsertTraining,
  type UserTraining, type InsertUserTraining,
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
  
  // Training methods
  getTraining(id: number): Promise<Training | undefined>;
  getAllTrainings(): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;
  updateTraining(id: number, training: Partial<InsertTraining>): Promise<Training | undefined>;
  
  // User Training methods
  getUserTrainings(userId: number): Promise<UserTraining[]>;
  getTrainingUsers(trainingId: number): Promise<UserTraining[]>;
  assignTraining(userTraining: InsertUserTraining): Promise<UserTraining>;
  updateUserTraining(id: number, userTraining: Partial<UserTraining>): Promise<UserTraining | undefined>;
  
  // Notification methods
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trainings: Map<number, Training>;
  private userTrainings: Map<number, UserTraining>;
  private notifications: Map<number, Notification>;
  private currentUserId: number;
  private currentTrainingId: number;
  private currentUserTrainingId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.trainings = new Map();
    this.userTrainings = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentTrainingId = 1;
    this.currentUserTrainingId = 1;
    this.currentNotificationId = 1;

    // Initialize with sample users and data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample users
    const adminUser = await this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      firstName: "John",
      lastName: "Doe",
      isActive: true,
    });

    const managerUser = await this.createUser({
      username: "manager",
      email: "manager@example.com",
      password: "manager123",
      role: "manager",
      firstName: "Jane",
      lastName: "Smith",
      isActive: true,
    });

    const employeeUser = await this.createUser({
      username: "employee",
      email: "employee@example.com",
      password: "employee123",
      role: "employee",
      firstName: "Bob",
      lastName: "Johnson",
      isActive: true,
    });

    // Create sample trainings
    const poshTraining = await this.createTraining({
      title: "POSH Compliance Training",
      description: "Prevention of Sexual Harassment at workplace compliance training",
      category: "Compliance",
      duration: 120,
      createdBy: adminUser.id,
      isActive: true,
    });

    const securityTraining = await this.createTraining({
      title: "Data Security Fundamentals",
      description: "Learn about data protection and cybersecurity best practices",
      category: "Security",
      duration: 90,
      createdBy: adminUser.id,
      isActive: true,
    });

    const leadershipTraining = await this.createTraining({
      title: "Leadership Essentials",
      description: "Essential leadership skills for managers and team leads",
      category: "Management",
      duration: 180,
      createdBy: adminUser.id,
      isActive: true,
    });

    // Assign trainings to users
    await this.assignTraining({
      userId: employeeUser.id,
      trainingId: poshTraining.id,
      status: "completed",
      progress: 100,
    });

    await this.assignTraining({
      userId: employeeUser.id,
      trainingId: securityTraining.id,
      status: "in_progress",
      progress: 60,
    });

    await this.assignTraining({
      userId: employeeUser.id,
      trainingId: leadershipTraining.id,
      status: "assigned",
      progress: 0,
    });

    // Create sample notifications
    await this.createNotification({
      userId: employeeUser.id,
      title: "New Training Assigned: POSH Compliance",
      message: "You have been assigned a new training module",
      type: "info",
      isRead: false,
    });

    await this.createNotification({
      userId: employeeUser.id,
      title: "Training Completion Reminder",
      message: "Please complete your pending training modules",
      type: "warning",
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

  // Training methods
  async getTraining(id: number): Promise<Training | undefined> {
    return this.trainings.get(id);
  }

  async getAllTrainings(): Promise<Training[]> {
    return Array.from(this.trainings.values());
  }

  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const id = this.currentTrainingId++;
    const training: Training = {
      ...insertTraining,
      id,
      isActive: insertTraining.isActive ?? true,
      createdAt: new Date(),
    };
    this.trainings.set(id, training);
    return training;
  }

  async updateTraining(id: number, trainingData: Partial<InsertTraining>): Promise<Training | undefined> {
    const training = this.trainings.get(id);
    if (!training) return undefined;
    
    const updatedTraining = { ...training, ...trainingData };
    this.trainings.set(id, updatedTraining);
    return updatedTraining;
  }

  // User Training methods
  async getUserTrainings(userId: number): Promise<UserTraining[]> {
    return Array.from(this.userTrainings.values()).filter(ut => ut.userId === userId);
  }

  async getTrainingUsers(trainingId: number): Promise<UserTraining[]> {
    return Array.from(this.userTrainings.values()).filter(ut => ut.trainingId === trainingId);
  }

  async assignTraining(insertUserTraining: InsertUserTraining): Promise<UserTraining> {
    const id = this.currentUserTrainingId++;
    const userTraining: UserTraining = {
      ...insertUserTraining,
      id,
      status: insertUserTraining.status || "assigned",
      progress: insertUserTraining.progress || 0,
      assignedAt: new Date(),
      completedAt: null,
    };
    this.userTrainings.set(id, userTraining);
    return userTraining;
  }

  async updateUserTraining(id: number, userTrainingData: Partial<UserTraining>): Promise<UserTraining | undefined> {
    const userTraining = this.userTrainings.get(id);
    if (!userTraining) return undefined;
    
    const updatedUserTraining = { ...userTraining, ...userTrainingData };
    this.userTrainings.set(id, updatedUserTraining);
    return updatedUserTraining;
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
