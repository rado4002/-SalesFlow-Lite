-- V3__auto_create_admin_user.sql
INSERT INTO users (phone_number, username, email, password, role, created_at, updated_at)
SELECT '0000000000', 'admin', 'admin@salesflow.cd',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
       'ADMIN', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone_number = '0000000000');

INSERT INTO users (phone_number, username, email, password, role, created_at, updated_at)
SELECT '1111', 'user', 'user@salesflow.cd',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
       'USER', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone_number = '1111');