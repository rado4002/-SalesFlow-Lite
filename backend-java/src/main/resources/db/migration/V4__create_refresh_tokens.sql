-- V4__create_refresh_tokens.sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    device VARCHAR(255)
    );

-- Add FK constraint in a separate statement so some DBs give clearer errors
ALTER TABLE refresh_tokens
    ADD CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
