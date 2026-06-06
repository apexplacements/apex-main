-- Insert Trainer Accounts into generated_emails

-- Insert first trainer account: srikanth.tr@apexplacements.in
INSERT INTO generated_emails (user_name, role, email, default_password, password, status, created_at)
VALUES 
(
  'Srikanth Kumar (Trainer)',
  'tr',
  'srikanth.tr@apexplacements.in',
  'trainer@123',
  NULL,
  'active',
  NOW()
);

-- Insert second trainer account (optional)
INSERT INTO generated_emails (user_name, role, email, default_password, password, status, created_at)
VALUES 
(
  'Sample Trainer',
  'tr',
  'trainer.sample@apexplacements.in',
  'trainer@123',
  NULL,
  'active',
  NOW()
);

-- Verify insertion
SELECT id, user_name, email, role, default_password FROM generated_emails WHERE role = 'tr';
