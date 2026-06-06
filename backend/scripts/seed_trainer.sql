-- Example SQL to create a trainer record. Run in your MySQL client connected to the application's database.
-- Replace values as needed.

INSERT INTO trainers (user_id, trainer_name, email, mobile, experience_years, specialization, created_at)
VALUES (123, 'Srikanth PO', 'srikanth.po@apexplacements.in', '9000123456', 5, 'Placement Training', NOW());
