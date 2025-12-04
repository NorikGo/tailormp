import { PrismaClient } from '@prisma/client';

/**
 * Database Helper for E2E Tests
 *
 * Use these functions to setup/cleanup test data
 */

const prisma = new PrismaClient();

/**
 * Clean up test users (emails starting with "test-")
 */
export async function cleanupTestUsers() {
  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: 'test-',
      },
    },
  });
}

/**
 * Clean up test orders
 */
export async function cleanupTestOrders(userId: string) {
  await prisma.order.deleteMany({
    where: {
      userId,
    },
  });
}

/**
 * Clean up test cart
 */
export async function cleanupTestCart(userId: string) {
  await prisma.cart.deleteMany({
    where: {
      userId,
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      tailor: true,
    },
  });
}

/**
 * Create test product for a tailor
 */
export async function createTestProduct(tailorId: string) {
  return prisma.product.create({
    data: {
      tailorId,
      title: 'Test Product E2E',
      description: 'This is a test product for E2E testing',
      price: 199.99,
      category: 'Anzug',
      isActive: true,
    },
  });
}

/**
 * Delete test products (title contains "Test Product")
 */
export async function cleanupTestProducts() {
  await prisma.product.deleteMany({
    where: {
      title: {
        contains: 'Test Product',
      },
    },
  });
}

/**
 * Disconnect Prisma (call in afterAll)
 */
export async function disconnectDB() {
  await prisma.$disconnect();
}

export { prisma };
