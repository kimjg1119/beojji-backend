import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Function to hash password
  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  // Create example users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      username: 'Alice',
      studentId: '20240001',
      password: await hashPassword('password123'),
      role: 'user',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      username: 'Bob',
      studentId: '20240002',
      password: await hashPassword('password123'),
      role: 'user',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'Admin',
      studentId: '20240003',
      password: await hashPassword('password'),
      role: 'admin',
    },
  })

  // Create example courses
  const course1 = await prisma.course.create({
    data: {
      name: 'Programming Languages',
      courseId: 'COSE212',
      term: 'Fall 2024',
      description: 'Learn the basics of programming languages',
      link: 'https://plrg.korea.ac.kr/courses/cose212/2024_2/',
      user: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: admin.id }],
      },
    },
  })

  const course2 = await prisma.course.create({
    data: {
      name: 'Theory of Computation',
      courseId: 'COSE215',
      term: 'Spring 2024',
      description: 'Learn the basics of theory of computation',
      link: 'https://plrg.korea.ac.kr/courses/cose215/2024_1/',
      user: {
        connect: [{ id: user1.id }, { id: admin.id }],
      },
    },
  })

  // Create example problems
  const problem1 = await prisma.problem.create({
    data: {
      title: 'Scala Practice',
      description: 'Practice Scala programming language',
      link: 'https://github.com/ku-plrg-classroom/docs/tree/main/scala/scala-tutorial',
    },
  })

  const problem2 = await prisma.problem.create({
    data: {
      title: 'Fibonacci Sequence',
      description: 'Generate the first 10 numbers of the Fibonacci sequence',
      link: 'https://example.com/problems/fibonacci',
    },
  })

  const problem3 = await prisma.problem.create({
    data: {
      title: 'Implement a Stack',
      description: 'Implement a stack data structure with push and pop operations',
      link: 'https://example.com/problems/stack',
    },
  })

  // Create CourseProblem relationships
  await prisma.courseProblem.createMany({
    data: [
      {
        courseId: course1.id,
        problemId: problem1.id,
        dueDate: new Date('2024-12-31T23:59:59Z'),
      },
      {
        courseId: course1.id,
        problemId: problem2.id,
        dueDate: new Date('2024-12-31T23:59:59Z'),
      },
      {
        courseId: course2.id,
        problemId: problem1.id,
        dueDate: new Date('2024-06-30T23:59:59Z'),
      },
      {
        courseId: course2.id,
        problemId: problem3.id,
        dueDate: new Date('2024-06-30T23:59:59Z'),
      },
    ],
  })

  // Fetch and log the created data to verify the structure
  const coursesWithProblems = await prisma.course.findMany({
    include: {
      courseProblem: {
        include: {
          problem: true,
        },
      },
    },
  })

  console.log('Courses with problems:', JSON.stringify(coursesWithProblems, null, 2))
  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })