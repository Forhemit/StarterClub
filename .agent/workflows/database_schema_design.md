---
description: Use this skill when designing database schemas for relational (SQL) or document (NoSQL) databases. Provides normalization guidelines, indexing strategies, migration patterns, and performance optimization techniques.
---

# Database Schema Designer

## Overview
This skill provides comprehensive guidance for designing robust, scalable database schemas for both SQL and NoSQL databases. Whether building from scratch or evolving existing schemas, this framework ensures data integrity, performance, and maintainability.

### When to use this skill:
- Designing new database schemas
- Refactoring or migrating existing schemas
- Optimizing database performance
- Choosing between SQL and NoSQL approaches
- Creating database migrations
- Establishing indexing strategies
- Modeling complex relationships
- Planning data archival and partitioning

## Database Design Philosophy

### Core Principles
1. **Model the Domain, Not the UI**
   - Schema reflects business entities and relationships
   - Don't let UI requirements drive data structure
   - Separate presentation concerns from data model

2. **Optimize for Reads or Writes (Not Both)**
   - OLTP (transactional): Normalized, optimized for writes
   - OLAP (analytical): Denormalized, optimized for reads
   - Choose based on access patterns

3. **Plan for Scale From Day One**
   - Indexing strategy
   - Partitioning approach
   - Caching layer
   - Read replicas

4. **Data Integrity Over Performance**
   - Use constraints, foreign keys, validation
   - Performance issues can be optimized later
   - Data corruption is costly to fix

## SQL Database Design

### Normalization
Database normalization reduces redundancy and ensures data integrity.

#### 1st Normal Form (1NF)
Rule: Each column contains atomic (indivisible) values, no repeating groups.

```sql
-- ❌ Violates 1NF (multiple values in one column)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  product_ids VARCHAR(255)  -- '101,102,103' (bad!)
);

-- ✅ Follows 1NF
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product_id INT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

#### 2nd Normal Form (2NF)
Rule: Must be in 1NF + all non-key columns depend on the entire primary key.

```sql
-- ❌ Violates 2NF (customer_name depends only on customer_id, not full key)
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  customer_id INT,
  customer_name VARCHAR(100),  -- Depends on customer_id only
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- ✅ Follows 2NF (customer data in separate table)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);
```

#### 3rd Normal Form (3NF)
Rule: Must be in 2NF + no transitive dependencies (non-key columns depend only on primary key).

```sql
-- ❌ Violates 3NF (country depends on postal_code, not on customer_id)
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(50)  -- Depends on postal_code, not id
);

-- ✅ Follows 3NF
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  postal_code VARCHAR(10),
  FOREIGN KEY (postal_code) REFERENCES postal_codes(code)
);

CREATE TABLE postal_codes (
  code VARCHAR(10) PRIMARY KEY,
  country VARCHAR(50)
);
```

### Denormalization (When to Break Rules)
Sometimes denormalization improves performance for read-heavy applications.

```sql
-- Denormalized for performance (caching derived data)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  total_amount DECIMAL(10, 2),  -- Calculated from order_items
  item_count INT,               -- Calculated from order_items
  created_at TIMESTAMP
);
-- Trigger or application code keeps denormalized data in sync
```

**When to denormalize:**
- Read-heavy applications (reporting, analytics)
- Frequently joined tables causing performance issues
- Pre-calculated aggregates (counts, sums, averages)
- Caching derived data to avoid complex joins

### Data Types
Choose appropriate data types for efficiency and accuracy.

#### String Types
```sql
-- Fixed-length (use for predictable lengths)
CHAR(10)      -- ISO date: '2025-10-31'
CHAR(2)       -- State code: 'CA'

-- Variable-length (use for variable lengths)
VARCHAR(255)  -- Email, name, short text
TEXT          -- Long text (articles, descriptions)

-- ✅ Good: Appropriate sizes
email VARCHAR(255)
phone_number VARCHAR(20)
postal_code VARCHAR(10)

-- ❌ Bad: Wasteful or too small
email VARCHAR(500)       -- Too large
description VARCHAR(50)  -- Too small for long text
```

#### Numeric Types
```sql
-- Integer types
TINYINT    -- -128 to 127 (age, status codes)
SMALLINT   -- -32,768 to 32,767 (quantities)
INT        -- -2.1B to 2.1B (IDs, counts)
BIGINT     -- Large numbers (timestamps, large IDs)

-- Decimal types
DECIMAL(10, 2)  -- Exact precision (money: $99,999,999.99)
FLOAT           -- Approximate (scientific calculations)
DOUBLE          -- Higher precision approximations

-- ✅ Use DECIMAL for money
CREATE TABLE products (
  id INT PRIMARY KEY,
  price DECIMAL(10, 2)  -- Exact precision
);

-- ❌ Don't use FLOAT for money
price FLOAT  -- Rounding errors!
```

#### Date/Time Types
```sql
DATE       -- Date only: 2025-10-31
TIME       -- Time only: 14:30:00
DATETIME   -- Date + time: 2025-10-31 14:30:00
TIMESTAMP  -- Unix timestamp (auto-converts timezone)

-- ✅ Always store in UTC
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### Boolean
```sql
-- PostgreSQL
is_active BOOLEAN DEFAULT TRUE

-- MySQL
is_active TINYINT(1) DEFAULT 1
```

### Indexing Strategies
Indexes speed up reads but slow down writes. Use strategically.

#### When to Create Indexes
```sql
-- ✅ Index foreign keys
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- ✅ Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- ✅ Index columns used in WHERE, ORDER BY, GROUP BY
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ✅ Composite index for multi-column queries
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
```

#### Index Types
*   **B-Tree Index (Default)**: Best for equality and range queries.
*   **Hash Index**: Best for exact matches only.
*   **Full-Text Index**: Best for text search.
*   **Partial Index (PostgreSQL)**: Index only specific rows.

#### Composite Indexes (Column Order Matters)
Rule of Thumb: Put most selective column first, or most frequently queried alone.

```sql
-- ✅ Good: Index supports both queries
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- Query 1: Uses index efficiently
SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending';

-- Query 2: Uses index (customer_id only)
SELECT * FROM orders WHERE customer_id = 123;

-- ❌ Query 3: Doesn't use index (status is second column)
SELECT * FROM orders WHERE status = 'pending';
```

### Constraints
Use constraints to enforce data integrity at the database level.

*   **Primary Key**: Auto-incrementing integer or UUID.
*   **Foreign Key**: Enforce referential integrity (CASCADE, RESTRICT, SET NULL).
*   **Unique Constraint**: Prevent duplicates.
*   **Check Constraint**: Validate data values.
*   **Not Null Constraint**: Ensure required fields are present.

### Common Schema Patterns
*   **One-to-Many**: Orders → Order Items
*   **Many-to-Many**: Students ↔ Courses (requires junction table)
*   **Self-Referencing**: Employees → Manager
*   **Polymorphic Relationships**: Comments on Posts/Photos (either separate FKs or type/id columns)

## NoSQL Database Design
(Focus on Document Databases like MongoDB)

### Embedding vs Referencing
*   **Embedding (Denormalization)**: Good for 1:few, often accessed together.
*   **Referencing (Normalization)**: Good for 1:many, large documents, frequently updated data.

### Indexing in MongoDB
Create indexes similarly to SQL for performance.

## Database Migrations
### Best Practices
1.  **Always Reversible**: Plan `down` migrations.
2.  **Backward Compatible**: Don't break existing code; add nullable columns first.
3.  **Data Migrations Separate**: Don't mix schema and data changes if risky.
4.  **Test Migrations**: Verify on a production-like dataset.

### Zero-Downtime Migrations
Example: Renaming a column involves multiple steps (Add new -> Copy data -> Write to both -> Switch read -> Drop old).

## Performance Optimization
*   **Query Optimization**: Use `EXPLAIN` to analyze. Avoid `SELECT *`.
*   **N+1 Query Problem**: Use JOINs or eager loading instead of loops.

## Integration with Agents
*   **Backend System Architect**: Uses this skill for data modeling.
*   **Code Quality Reviewer**: Checks against these best practices.
*   **AI/ML Engineer**: Designs for analytics.

## Quick Start Checklist
- [ ] Identify entities and relationships
- [ ] Choose SQL or NoSQL
- [ ] Normalize to 3NF (SQL) or decide embed/reference (NoSQL)
- [ ] Define primary keys
- [ ] Add foreign key constraints
- [ ] Choose appropriate data types
- [ ] Add unique constraints
- [ ] Plan indexing strategy
- [ ] Add NOT NULL constraints
- [ ] Create CHECK constraints
- [ ] Plan for soft deletes (if needed)
- [ ] Add timestamps (created_at, updated_at)
- [ ] Design migration scripts
- [ ] Test migrations
