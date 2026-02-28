-- Initialize sample data for development
MERGE INTO users (username, role) VALUES 
  ('admin', 'ADMIN'),
  ('tester_john', 'TESTER'),
  ('dev_sarah', 'DEVELOPER'),
  ('dev_mike', 'DEVELOPER'),
  ('tester_lisa', 'TESTER');

-- Sample issues
MERGE INTO issues (title, description, status, priority, created_by_id, created_at, updated_at) VALUES
  ('Login fails with special characters', 
   'Password field rejects @, #, and $ symbols during login. Users cannot log in with complex passwords.',
   'OPEN', 'CRITICAL', 1, NOW(), NOW()),
   
  ('UI layout broken on mobile devices',
   'Responsive design breaks on iPhone 12 and Samsung Galaxy S21. Navigation menu overlaps content.',
   'IN_PROGRESS', 'HIGH', 2, NOW(), NOW()),
   
  ('Data export fails for large datasets',
   'CSV export crashes when exporting more than 10,000 records. Error: "Memory limit exceeded"',
   'PENDING_VERIFICATION', 'HIGH', 1, NOW(), NOW()),
   
  ('Password reset email not received',
   'Users report not receiving password reset emails. Checked spam folder - not there.',
   'RESOLVED', 'MEDIUM', 2, NOW(), NOW()),
   
  ('Profile picture upload fails',
   'Uploading profile pictures larger than 2MB fails with "Invalid file type" error even for valid JPG files.',
   'CLOSED', 'LOW', 1, NOW(), NOW());