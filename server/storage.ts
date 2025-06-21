import { 
  wheelSegments, 
  wheelSessions,
  type WheelSegment, 
  type InsertWheelSegment,
  type WheelSession,
  type InsertWheelSession 
} from "@shared/schema";

export interface IStorage {
  // Wheel Segments
  getWheelSegments(): Promise<WheelSegment[]>;
  createWheelSegment(segment: InsertWheelSegment): Promise<WheelSegment>;
  deleteWheelSegment(id: number): Promise<void>;
  deleteAllWheelSegments(): Promise<void>;
  
  // Wheel Sessions
  getWheelSession(): Promise<WheelSession | undefined>;
  createOrUpdateWheelSession(session: Partial<InsertWheelSession>): Promise<WheelSession>;
  incrementSpinCount(): Promise<WheelSession>;
}

export class MemStorage implements IStorage {
  private segments: Map<number, WheelSegment>;
  private session: WheelSession | undefined;
  private currentSegmentId: number;
  private sessionId: number;

  constructor() {
    this.segments = new Map();
    this.currentSegmentId = 1;
    this.sessionId = 1;
    
    // Initialize with default segments
    const defaultSegments = [
      { label: 'Apple', color: 'from-red-500 to-red-600', order: 0 },
      { label: 'Orange', color: 'from-orange-500 to-orange-600', order: 1 },
      { label: 'Banana', color: 'from-yellow-500 to-yellow-600', order: 2 },
      { label: 'Grape', color: 'from-purple-500 to-purple-600', order: 3 },
      { label: 'Cherry', color: 'from-pink-500 to-pink-600', order: 4 },
      { label: 'Mango', color: 'from-amber-500 to-amber-600', order: 5 },
    ];
    
    defaultSegments.forEach(segment => {
      const id = this.currentSegmentId++;
      this.segments.set(id, { ...segment, id });
    });
    
    // Initialize session
    this.session = {
      id: this.sessionId,
      totalSpins: 0,
      soundEnabled: true
    };
  }

  async getWheelSegments(): Promise<WheelSegment[]> {
    return Array.from(this.segments.values()).sort((a, b) => a.order - b.order);
  }

  async createWheelSegment(insertSegment: InsertWheelSegment): Promise<WheelSegment> {
    const id = this.currentSegmentId++;
    const segment: WheelSegment = { ...insertSegment, id };
    this.segments.set(id, segment);
    return segment;
  }

  async deleteWheelSegment(id: number): Promise<void> {
    this.segments.delete(id);
  }

  async deleteAllWheelSegments(): Promise<void> {
    this.segments.clear();
    this.currentSegmentId = 1;
  }

  async getWheelSession(): Promise<WheelSession | undefined> {
    return this.session;
  }

  async createOrUpdateWheelSession(sessionData: Partial<InsertWheelSession>): Promise<WheelSession> {
    if (this.session) {
      this.session = { ...this.session, ...sessionData };
    } else {
      this.session = {
        id: this.sessionId,
        totalSpins: 0,
        soundEnabled: true,
        ...sessionData
      };
    }
    return this.session;
  }

  async incrementSpinCount(): Promise<WheelSession> {
    if (this.session) {
      this.session.totalSpins += 1;
    } else {
      this.session = {
        id: this.sessionId,
        totalSpins: 1,
        soundEnabled: true
      };
    }
    return this.session;
  }
}

export const storage = new MemStorage();
