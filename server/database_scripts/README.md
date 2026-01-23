## Project Setup

Follow these steps to get the development environment running.

### 1. Start the Infrastructure (Database)

We use Docker to run the PostgreSQL database. From the **root** directory, run:

```bash
docker compose up -d

# Enter the Postgres container
docker exec -it tcc-postgres psql -U admin -d tcc_db

# To exit the Postgres CLI
\q

# Start the application server
cd server
npm install
npm run dev

# Stopping the environment
# From the root directory
docker compose down -v
```
