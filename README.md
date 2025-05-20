# Recipe Generator with Favorites

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It features an AI-powered recipe generator with a favorites feature that allows you to save recipes to a PostgreSQL database. The application is containerized with Docker and Docker Compose for easy local development.

## Features

- Recipe generation based on available ingredients
- Dark mode and Hot Dog theme support
- Save favorite recipes to PostgreSQL database
- Filter recipes by dietary preferences
- Responsive design

## Getting Started


### Azure OpenAI Environment Variables (Required)

To use the AI-powered features, you must set the following Azure OpenAI environment variables in your `.env` file:

```
AZURE_OPENAI_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_VERSION=your-azure-openai-api-version
AZURE_OPENAI_DEPLOYMENT_NAME=your-azure-openai-deployment-name
```

You can find example values in `.env.example`. These values are required for the `/api/generate-recipes` endpoint to work. If you do not have access to Azure OpenAI, contact your administrator or see the Azure documentation for details on provisioning these resources.

You can run the app using Docker Compose or directly using npm:

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed on your machine.
2. We've provided scripts to easily start the application:

**For Windows users:**
```powershell
# Run the PowerShell script
.\run.ps1
```

**For Linux/macOS users:**
```bash
# Make the script executable
chmod +x run.sh

# Run the script
./run.sh
```

This will start both the Next.js application and PostgreSQL database in containers. The application will be accessible at http://localhost:3000.

If you encounter any issues, you can also try running directly with:
```bash
# Using the clean configuration file
docker-compose -f docker-compose.clean.yml up --build
```

### Using npm directly

If you prefer to run the app directly without Docker:

```bash
# Install dependencies
npm install

# Set up the database (you need PostgreSQL installed locally)
# Update .env file with your local PostgreSQL connection string

# Generate Prisma client
npx prisma generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Structure

The application uses PostgreSQL for storing favorite recipes with the following schema:

```
Table: favorites
- id (PK): Serial
- user_id: String (for future authentication integration)
- recipe_name: Text
- recipe_data: JSONB (stores the full recipe object)
- created_at: Timestamp with timezone
```

## Theme Support

The application supports three themes:
1. Light Mode (default)
2. Dark Mode 
3. Hot Dog Mode - a fun, vibrant theme with red and yellow colors

You can toggle between these themes using the theme button in the top right corner.

## Docker Configuration

The project includes several Docker-related files:

- `docker-compose.clean.yml`: The recommended Docker Compose configuration that resolves formatting issues
- `docker-compose.yml` and `docker-compose.override.yml`: Alternative configurations (not recommended)
- `Dockerfile`: Multi-stage build configuration for the Next.js application
- `.dockerignore`: Lists files excluded from Docker builds
- `run.ps1` and `run.sh`: Basic startup scripts for Windows and Linux/macOS
- `docker-cli.ps1` and `docker-cli.sh`: Advanced Docker helper scripts with multiple commands
- `scripts/db-setup.sh`: Script for database migrations and setup

### Docker CLI Helper

We've created helper scripts to make working with Docker easier:

**For Windows:**
```powershell
# Show available commands
.\docker-cli.ps1 help

# Start services
.\docker-cli.ps1 start

# View logs
.\docker-cli.ps1 logs

# Access database shell
.\docker-cli.ps1 db-shell
```

**For Linux/macOS:**
```bash
# Make the script executable
chmod +x docker-cli.sh

# Show available commands
./docker-cli.sh help

# Start services
./docker-cli.sh start

# Rebuild services
./docker-cli.sh rebuild
```

### Troubleshooting Docker Issues

If you encounter issues with Docker:

1. Make sure Docker is running on your system
2. Try using the `docker-compose.clean.yml` file directly: `docker-compose -f docker-compose.clean.yml up --build`
3. Check that ports 3000 and 5432 are not already in use by other applications
4. If the database fails to initialize, you may need to remove existing volumes: `docker volume prune`

## Learn More

To learn more about the technologies used, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
