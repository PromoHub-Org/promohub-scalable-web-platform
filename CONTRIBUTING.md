# Contributing to PromoHub

Thank you for contributing to the PromoHub project.

This project is designed to simulate a real collaborative Cloud/DevOps engineering workflow. To keep the project organized, all contributors should follow the workflow below.

## Contribution Workflow

1. Check the existing GitHub Issues.
2. Choose or request assignment to an issue.
3. Create a new branch for your work.
4. Make your changes and test them.
5. Commit your changes with a clear commit message.
6. Push your branch to GitHub.
7. Open a Pull Request.
8. Describe what you changed and how you tested it.
9. Request a review.
10. Merge only after approval.

## Branch Naming

Use descriptive branch names.

Examples:

- `feature/baseline-app`
- `feature/vpc-setup`
- `feature/load-balancer`
- `feature/auto-scaling`
- `feature/cloudwatch-monitoring`
- `feature/terraform-networking`

## Pull Requests

Every Pull Request should include:

- A clear description of the changes
- The problem being addressed
- Testing performed
- Any known limitations or issues

Do not push directly to the `main` branch.

## Security

Never commit:

- AWS credentials
- Access keys
- Secret keys
- Passwords
- `.env` files
- Terraform state files containing sensitive information

Use environment variables or appropriate secret-management solutions when needed.

## Collaboration

Contributors are encouraged to review each other's work, ask questions, share technical reasoning, and document important decisions.

The goal is not only to build the project, but to practice real-world collaborative engineering workflows.
