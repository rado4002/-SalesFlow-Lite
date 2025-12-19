-- src/main/resources/db/migration/V4__auto_create_admin_user.sql
-- H2 does NOT support ON CONFLICT → Use MERGE INTO (H2 syntax)
MERGE INTO users (username, phone_number, email, password, role, created_at, updated_at)
    KEY(phone_number)
    VALUES (
               'admin',
               '0000000000',
               'admin@salesflow.cd',
               '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
               'ADMIN',
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
           );