# Database Setup Guide

## Method 1: Using psql Command Line

### 1. Connect to PostgreSQL

```bash
psql -U postgres
```

Or if you have a different user:

```bash
psql -U your_username
```

### 2. Create the Database

Once connected to PostgreSQL, run:

```sql
CREATE DATABASE right_fit_matcher;
```

### 3. Verify Database Creation

```sql
\l
```

You should see `right_fit_matcher` in the list.

### 4. Exit psql

```sql
\q
```

### 5. Update Your .env File

Open `.env` and update the `DATABASE_URL` with your actual credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/right_fit_matcher
```

Or if using a different user:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/right_fit_matcher
```

### 6. Sync the Database Schema

```bash
npm run sync-db
```

### 7. Start the Server

```bash
npm run dev
```

---

## Method 2: Using the Shell Script (macOS/Linux)

Make the script executable:

```bash
chmod +x src/database/create-database.sh
./src/database/create-database.sh
```

---

## Method 3: Using Docker (Optional)

If you have Docker installed and want to run PostgreSQL in a container:

### 1. Start PostgreSQL Container

```bash
docker run --name postgres-rfm \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=right_fit_matcher \
  -p 5432:5432 \
  -d postgres:latest
```

### 2. Update .env

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/right_fit_matcher
```

### 3. Sync the Database

```bash
npm run sync-db
```

---

## Troubleshooting

### Error: "peer authentication failed"

You might need to change your PostgreSQL authentication method. Edit `/etc/postgresql/12/main/pg_hba.conf` (or your version) and change:

```
local   all             all                                     peer
```

to:

```
local   all             all                                     md5
```

Then restart PostgreSQL:

```bash
sudo service postgresql restart
```

### Error: "password authentication failed"

- Make sure your password in `.env` matches your PostgreSQL user's password
- You can reset the postgres password: `psql -U postgres -c "ALTER USER postgres PASSWORD 'new_password';"`

### Error: "database does not exist"

Make sure you've created the database first (see Method 1 above).

---

## For Cloud Databases (Neon, Supabase, etc.)

1. Create a project on your cloud provider
2. Get your connection string (usually provided in the dashboard)
3. Update your `.env` file:

```env
DATABASE_URL=postgresql://user:pass@your-instance.provider.com:5432/dbname
```

4. Run `npm run sync-db`
5. Your tables will be created automatically!
