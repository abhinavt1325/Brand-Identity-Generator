import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
}

// Extend FastifyRequest definition to include user object
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export const authenticateRequest = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authorization token missing or invalid'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
    
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};
