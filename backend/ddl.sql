CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('EMPLOYEE', 'HR_ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIMESTAMP NOT NULL,
    photo_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, attendance_date)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_attendance_employee_id ON attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);

INSERT INTO users (email, password, role) VALUES 
('admin@company.com', '$2b$10$rKx7XqZ5JYVxYp3K/XZR5OUZvQ9P.zXJWXHJp9L5xVF8VZ7X8Q9Gq', 'HR_ADMIN'),
('employee@company.com', '$2b$10$rKx7XqZ5JYVxYp3K/XZR5OUZvQ9P.zXJWXHJp9L5xVF8VZ7X8Q9Gq', 'EMPLOYEE');

INSERT INTO employees (user_id, full_name, employee_code, department, position, phone, hire_date) VALUES 
(1, 'Admin User', 'EMP001', 'Human Resources', 'HR Manager', '+62812345678', '2020-01-15'),
(2, 'John Doe', 'EMP002', 'Engineering', 'Software Engineer', '+62823456789', '2021-03-20');
