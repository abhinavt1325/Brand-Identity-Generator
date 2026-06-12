import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string()
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  
  // POST /signup
  fastify.post('/auth/signup', async (request, reply) => {
    try {
      const { username, email, password, confirmPassword } = signupSchema.parse(request.body);

      if (password !== confirmPassword) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Passwords do not match'
        });
      }

      // Check if username or email already exists
      const existingUser = await db.select()
        .from(usersTable)
        .where(
          or(
            eq(usersTable.username, username),
            eq(usersTable.email, email)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        const field = existingUser[0].username === username ? 'Username' : 'Email';
        return reply.status(409).send({
          error: 'Conflict',
          message: `${field} is already registered`
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Insert user
      const [user] = await db.insert(usersTable).values({
        id: userId,
        username,
        email,
        passwordHash
      }).returning();

      // Sign JWT
      const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      throw err;
    }
  });

  // POST /login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const { username, password } = loginSchema.parse(request.body);

      // Find user
      const [user] = await db.select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1);

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid username or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid username or password'
        });
      }

      // Sign JWT
      const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      return reply.status(200).send({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      throw err;
    }
  });

};

export default authRoutes;
