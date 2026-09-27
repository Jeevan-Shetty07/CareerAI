import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getDb } from '../db/db';

export const getSkillGapAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const resume = store.resumes.filter(r => r.userId === userId).slice(-1)[0];
    const latestMatch = store.job_matches.filter(m => m.userId === userId).slice(-1)[0];

    const strongSkills = [
      { name: 'React', level: 90, category: 'Frontend', projectsCount: 3 },
      { name: 'JavaScript (ES6+)', level: 88, category: 'Languages', projectsCount: 4 },
      { name: 'SQL & PostgreSQL', level: 80, category: 'Databases', projectsCount: 2 },
      { name: 'HTML5 & Tailwind CSS', level: 92, category: 'Frontend', projectsCount: 5 },
      { name: 'Git & Version Control', level: 85, category: 'Tools', projectsCount: 4 },
    ];

    const skillsToImprove = [
      {
        name: 'Node.js & Express Architecture',
        level: 55,
        targetLevel: 85,
        category: 'Backend',
        whyItMatters: 'Essential for handling asynchronous event loops, streaming data, and architecting scalable microservices.',
        effortHours: 18,
        resources: [
          { title: 'Node.js Design Patterns', url: 'https://nodejsdesignpatterns.com', type: 'Book/Doc' },
          { title: 'Mastering Express Controllers', url: 'https://expressjs.com', type: 'Doc' }
        ],
        recommendedProject: 'Build a rate-limited REST API gateway with Redis token bucket.'
      },
      {
        name: 'Docker & Multi-Container Workflows',
        level: 40,
        targetLevel: 80,
        category: 'DevOps',
        whyItMatters: 'Top companies mandate Dockerized local environments and production deployment containers.',
        effortHours: 14,
        resources: [
          { title: 'Docker Deep Dive', url: 'https://docs.docker.com', type: 'Doc' },
          { title: 'Docker Compose in 100 Seconds', url: 'https://youtube.com', type: 'Video' }
        ],
        recommendedProject: 'Containerize a React frontend, Node backend, and PostgreSQL database with persistent volumes.'
      },
      {
        name: 'System Design & Distributed Caching',
        level: 45,
        targetLevel: 80,
        category: 'Architecture',
        whyItMatters: 'Differentiates entry-level candidates from product-grade software engineers during technical rounds.',
        effortHours: 20,
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Repository' }
        ],
        recommendedProject: 'Implement a Cache-Aside Redis layer with TTL invalidation.'
      }
    ];

    const missingSkills = [
      {
        name: 'Amazon Web Services (AWS)',
        level: 20,
        targetLevel: 75,
        category: 'Cloud',
        whyItMatters: 'Appears on 75%+ of Full Stack & Backend job postings. Knowledge of S3, EC2, RDS, and Lambda is highly valued.',
        effortHours: 25,
        resources: [
          { title: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/', type: 'Course' },
          { title: 'AWS S3 & EC2 Deployment Guide', url: 'https://docs.aws.amazon.com', type: 'Doc' }
        ],
        recommendedProject: 'Deploy an automated CI/CD pipeline hosting a full-stack web application on AWS EC2 and S3.'
      },
      {
        name: 'Kubernetes & Container Orchestration',
        level: 10,
        targetLevel: 70,
        category: 'DevOps',
        whyItMatters: 'Standard in scalable enterprise microservice deployments.',
        effortHours: 30,
        resources: [
          { title: 'Kubernetes Official Tutorials', url: 'https://kubernetes.io/docs/tutorials/', type: 'Doc' }
        ],
        recommendedProject: 'Deploy a multi-pod cluster on Minikube with Ingress routing and auto-scaling.'
      },
      {
        name: 'CI/CD Pipelines (GitHub Actions)',
        level: 25,
        targetLevel: 80,
        category: 'DevOps',
        whyItMatters: 'Automates testing, linting, and zero-downtime deployment for modern Agile software teams.',
        effortHours: 12,
        resources: [
          { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'Doc' }
        ],
        recommendedProject: 'Configure a workflow that runs unit tests, builds Docker images, and triggers deployment.'
      }
    ];

    res.json({
      success: true,
      data: {
        strongSkills,
        skillsToImprove,
        missingSkills,
        summary: 'Your skill profile has strong frontend and database fundamentals. Addressing Cloud (AWS) and Containerization (Docker) will immediately elevate your candidacy for Full Stack roles.',
        latestJobMatch: latestMatch || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
