-- Convert schedule column to text array
-- First specific alter to handle the conversion if data exists (casting simple text to single-item array)
alter table job_postings 
alter column schedule type text[] using array[schedule];

-- Or if column doesn't exist yet (idempotency for previous scripts in this flow)
-- alter table job_postings add column if not exists schedule text[];
