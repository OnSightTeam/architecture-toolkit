/**
 * Bad Architecture Example
 * Contains multiple Clean Architecture violations
 */

import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

// UseCase layer depending on framework layer (VIOLATION)
export class CreateUserUseCase {
  private db: MongoClient;

  constructor() {
    // Direct instantiation of infrastructure (VIOLATION)
    this.db = new MongoClient('mongodb://localhost');
  }

  // HTTP Request leaked into Use Case (VIOLATION)
  async execute(request: Request): Promise<Response> {
    const userData = request.body;

    // Business logic mixed with database access (VIOLATION)
    const validation = this.validateUser(userData);
    if (!validation.isValid) {
      throw new Error('Invalid user');
    }

    // Direct SQL in use case (VIOLATION)
    await this.db.db('users').collection('users').insertOne(userData);

    // Returning Express Response from Use Case (VIOLATION)
    return {} as Response;
  }

  private validateUser(data: any): { isValid: boolean } {
    return { isValid: data.email && data.name };
  }
}

// Controller with business logic and database access (VIOLATION)
export class UserController {
  private app = express();

  async createUser(req: Request, res: Response): Promise<void> {
    // Business logic in controller (VIOLATION)
    if (!req.body.email || !req.body.name) {
      res.status(400).send('Missing required fields');
      return;
    }

    // Complex validation in controller (VIOLATION)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      res.status(400).send('Invalid email format');
      return;
    }

    // Direct database access from controller (VIOLATION)
    const mongo = new MongoClient('mongodb://localhost');
    await mongo.connect();
    await mongo.db('users').collection('users').insertOne(req.body);
    await mongo.close();

    res.status(201).send({ id: 'generated-id' });
  }
}

// Entity with database concerns (VIOLATION)
export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}

  // Infrastructure concern in entity (VIOLATION)
  async save(): Promise<void> {
    const mongo = new MongoClient('mongodb://localhost');
    await mongo.connect();
    await mongo.db('users').collection('users').insertOne(this);
    await mongo.close();
  }

  // Presentation concern in entity (VIOLATION)
  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      email: this.email,
    });
  }
}
