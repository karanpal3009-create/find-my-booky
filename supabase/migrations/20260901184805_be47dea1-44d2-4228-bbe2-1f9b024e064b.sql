
INSERT INTO public.libraries (id, name, address, city) VALUES
('11111111-1111-4111-8111-000000000001','Delhi Public Library','S.P. Mukherjee Marg, Chandni Chowk','Delhi'),
('11111111-1111-4111-8111-000000000002','Hardayal Municipal Public Library','Nishad Raj Marg, Chandni Chowk','Delhi'),
('11111111-1111-4111-8111-000000000003','Central Secretariat Library','Shastri Bhawan, Rajendra Prasad Road','Delhi'),
('11111111-1111-4111-8111-000000000004','Nehru Memorial Library','Teen Murti House, Motilal Nehru Marg','Delhi'),
('11111111-1111-4111-8111-000000000005','JNU Central Library','Jawaharlal Nehru University, New Mehrauli Road','Delhi');

INSERT INTO public.books (title, author, type, available, library_id) VALUES
('The Discovery of India','Jawaharlal Nehru','Book',true,'11111111-1111-4111-8111-000000000001'),
('Midnight''s Children','Salman Rushdie','Book',true,'11111111-1111-4111-8111-000000000001'),
('The White Tiger','Aravind Adiga','Book',false,'11111111-1111-4111-8111-000000000001'),
('India Today','Living Media','Magazine',true,'11111111-1111-4111-8111-000000000001'),
('Train to Pakistan','Khushwant Singh','Book',true,'11111111-1111-4111-8111-000000000002'),
('Godaan','Munshi Premchand','Book',true,'11111111-1111-4111-8111-000000000002'),
('Frontline','The Hindu Group','Magazine',false,'11111111-1111-4111-8111-000000000002'),
('The Argumentative Indian','Amartya Sen','Book',true,'11111111-1111-4111-8111-000000000003'),
('India After Gandhi','Ramachandra Guha','Book',true,'11111111-1111-4111-8111-000000000003'),
('Economic and Political Weekly','Sameeksha Trust','Magazine',true,'11111111-1111-4111-8111-000000000003'),
('An Autobiography','Jawaharlal Nehru','Book',false,'11111111-1111-4111-8111-000000000004'),
('The Story of My Experiments with Truth','M.K. Gandhi','Book',true,'11111111-1111-4111-8111-000000000004'),
('Annihilation of Caste','B.R. Ambedkar','Book',true,'11111111-1111-4111-8111-000000000004'),
('Seminar','Seminar Publications','Magazine',true,'11111111-1111-4111-8111-000000000004'),
('A Suitable Boy','Vikram Seth','Book',true,'11111111-1111-4111-8111-000000000005'),
('The God of Small Things','Arundhati Roy','Book',false,'11111111-1111-4111-8111-000000000005'),
('Sapiens','Yuval Noah Harari','Book',true,'11111111-1111-4111-8111-000000000005'),
('Down to Earth','CSE','Magazine',true,'11111111-1111-4111-8111-000000000005');
