-- Test account for local development.
-- Email: test@example.com
-- Password: test123456

INSERT INTO users (username, email, password)
VALUES (
    'test',
    'test@example.com',
    '$2a$10$BTJPMzBjthwhi27FSo1jTuN4cxVw8ND5CJLh91fIJcOQ5s6Z0zH7e'
)
ON CONFLICT (email) DO UPDATE
SET
    username = EXCLUDED.username,
    password = EXCLUDED.password,
    updated_at = CURRENT_TIMESTAMP;
