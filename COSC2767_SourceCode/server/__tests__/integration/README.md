Here's the rewritten README section with improved structure and clarity:

---

### **Running Tests and Setting Up Your Environment**

#### **Project Structure**

- Root folder: Contains project-wide configurations and commands.
- `server/`: Backend server code and tests.
- `client/`: Frontend application.
- `server/__tests__`: Unit and Integration Tests for Backend

---

#### **Environment Setup**

1. **Install Dependencies**
   Run the following command at the root of the project to install all dependencies, including development dependencies:

   ```bash
   npm install --include=dev
   ```

2. **Start the Development Server**
   At the root folder, run:

   ```bash
   npm run dev
   ```

   This will start both the client and server in development mode.

3. **Set Up Database (Docker)**
   Ensure the database is running in a **staging environment**:
   - For local development, use Docker to run the database:
     ```bash
     docker run -d -p 27017:27017 --names test_db mongo
     ```
   - To operate with mondo, use this command to enter docker:
     ```bash
     docker exec -it test_db mongosh
     ```
   - Confirm the database is accessible and connected to the staging environment.

---

#### **Running Tests**

To run tests, navigate to the `server` folder and use the commands below.

1. **Integration Tests**

   - Integration tests require the client, server, and database to be in a staging environment.
     - **Client**: Run locally.
     - **Server**: Run locally.
     - **Database**: Run in Docker.
   - Command:
     ```bash
     npm run test:integration
     ```

2. **Unit Tests**
   - Unit tests run independently of the staging environment and mock dependencies where necessary.
   - Command:
     ```bash
     npm run test:unit
     ```

---

#### **Summary of Commands**

| Command                     | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `npm install --include=dev` | Install all dependencies, including dev tools.   |
| `npm run dev`               | Start the client and server in development mode. |
| `docker-compose up -d`      | Start the database in Docker.                    |
| `npm run test:integration`  | Run integration tests (requires staging setup).  |
| `npm run test:unit`         | Run unit tests independently.                    |

---
