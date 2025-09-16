## Devi Store

Ecommerce clothes website with catalog, item, and order processing pages.
Manager notifications via Telegram.
The CDEK pick-up point map enables selection of a delivery address.

### Setup

1. **Database**:
    - Install PostgreSQL and create a database.
    - Run the [schema_with_data.sql](sql/schema_with_data.sql) script to create tables and insert sample data.

2. **Telegram**:
    - Create a bot on Telegram.
    - Start a chat with it.

3. **Backend Setup**:
    - Navigate to the [backend](backend) directory.
    - Add `.env` file here using [.env.template](backend/.env.template).
    - Fill in the required data for the PostgreSQL database connection, Telegram bot and CDEK map.
    - Run `npm install` to install dependencies.
    - Start the backend with `npm start` or `npm run dev` (for development with nodemon).

4. **Frontend Setup**:
    - Navigate to the [frontend](frontend) directory.
    - Add `.env` file here using [.env.template](frontend/.env.template).
    - Fill in Yandex API key for the CDEK map.
    - Run `npm install` to install dependencies.
    - Start the frontend with `npm run dev` to run the Next.js development server.

Access the website at http://localhost:3000.
