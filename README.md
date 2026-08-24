# PromoHub — Scalable Web Platform

## Project Overview

PromoHub is an e-commerce web platform with generic dicount code, the website os designed to simulate a real world application that experiences significant traffic spikes during promotional campaigns.

The project focuses on designing, implementing, testing and automating a highly available and scalable cloud infrastructure capable of maintaining application availability and performance during sudden increases in traffic.

## The Problem

During promotional periods, a sudden increase in users can overwhelm a traditional single-server application architecture.

This can result in:

- Failed or timed-out login requests
- Slow response times
- Increased application errors
- Server resource exhaustion
- Poor availability
- A single point of failure

The initial version of this project will deliberately use a simple architecture so that we can reproduce and measure these problems before introducing improvements.

## Project Objective

The objective is to progressively transform the initial application into a scalable and highly available cloud platform.

The project will demonstrate how Cloud and DevOps engineering practices can be used to:

- Handle sudden traffic spikes
- Distribute traffic across multiple application instances
- Automatically scale compute resources
- Improve application availability
- Monitor infrastructure and application health
- Secure cloud resources
- Automate infrastructure deployment
- Automate application delivery
- Test system resilience and failure recovery

## Planned Architecture

The project will evolve progressively from a simple architecture:

Internet → EC2 → Database

into a more resilient architecture involving:

Internet → CloudFront/WAF → Application Load Balancer → Auto Scaling Group → Application Instances → RDS

Monitoring and automation will be added throughout the project.

## Technology Areas

- AWS
- EC2
- Application Load Balancer
- Auto Scaling
- VPC
- RDS
- CloudFront
- AWS WAF
- IAM
- CloudWatch
- Terraform
- Docker
- GitHub Actions
- Git/GitHub
- Load Testing

## Project Roadmap

1. Project setup
2. Build the baseline application
3. Deploy the initial single-server architecture
4. Perform load testing
5. Identify scalability and availability problems
6. Design the improved AWS architecture
7. Implement load balancing and Auto Scaling
8. Implement RDS
9. Improve security
10. Add monitoring and alerting
11. Rebuild infrastructure with Terraform
12. Implement CI/CD
13. Perform failure and load testing
14. Compare the baseline and improved architectures
15. Document results and lessons learned

## Collaboration

This is a collaborative Cloud/DevOps engineering project.

Contributions will be managed through GitHub using:

**Issues → Branches → Pull Requests → Code Review → Merge**

Contributors will work on defined areas of the project while maintaining a structured engineering workflow.

## Project Status

| Phase | Description | Status | Target Date |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Planning & Requirements Setup | ✅ Completed | Aug 2026 |
| **Phase 2** | Build Baseline (App & DB Deployment) | 🟡 In Progress | Aug 2026 |
| **Phase 3** | Reproduce the Problem (Load Testing) |  Pending | — |
| **Phase 4** | Scalable AWS Architecture Design |  Pending | — |
| **Phase 5** | Monitoring & Reliability (CloudWatch) |  Pending | — |
| **Phase 6** | Infrastructure as Code (Terraform) |  Pending | — |
| **Phase 7** | CI/CD Pipeline (GitHub Actions) |  Pending | — |
| **Phase 8** | Final Load Testing & Verification |  Pending | — |
