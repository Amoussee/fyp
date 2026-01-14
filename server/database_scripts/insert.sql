TRUNCATE TABLE
  survey_responses,
  dashboards,
  surveys,
  users
RESTART IDENTITY CASCADE;

INSERT INTO users (email, name, organisation, password_hash, role)
VALUES
('admin1@tcc.org', 'Alice Tan', 'TCC', 'hashed_pw_1', 'Admin'),
('admin2@tcc.org', 'Ben Lim', 'TCC', 'hashed_pw_2', 'Admin'),
('parent1@school.edu', 'Clara Ong', 'Greenfield Primary', 'hashed_pw_3', 'Parent'),
('parent2@school.edu', 'Daniel Lee', 'Greenfield Primary', 'hashed_pw_4', 'Parent'),
('parent3@school.edu', 'Evelyn Ng', 'Riverside Secondary', 'hashed_pw_5', 'Parent');

INSERT INTO surveys (metadata, schema_json, created_by)
VALUES
(
  '{"title":"Recycling Habits","description":"Student recycling habits"}',
  '{"questions":[{"id":"q1","type":"yes_no","question":"Do you recycle?"}]}',
  1
),
(
  '{"title":"Energy Awareness","description":"Energy usage awareness"}',
  '{"questions":[{"id":"q1","type":"scale","min":1,"max":5}]}',
  1
),
(
  '{"title":"Water Conservation","description":"Water saving habits"}',
  '{"questions":[{"id":"q1","type":"yes_no"}]}',
  2
),
(
  '{"title":"Transport","description":"Commute methods"}',
  '{"questions":[{"id":"q1","type":"multiple_choice","options":["Bus","MRT","Car","Walk"]}]}',
  2
),
(
  '{"title":"Food Waste","description":"Canteen food waste"}',
  '{"questions":[{"id":"q1","type":"text"}]}',
  1
);

INSERT INTO survey_responses (form_id, responses, created_by)
VALUES
(1, '{"q1":"Yes"}', 3),
(1, '{"q1":"No"}', 4),
(2, '{"q1":4}', 3),
(3, '{"q1":"Yes"}', 4),
(4, '{"q1":"Bus"}', 5);

INSERT INTO dashboards (owner_id, name, config)
VALUES
(
  1,
  'Recycling Dashboard',
  '{"layout":[{"type":"barchart","question_id":"q1"}]}'
),
(
  1,
  'Energy Dashboard',
  '{"layout":[{"type":"average","question_id":"q1"}]}'
),
(
  2,
  'Water Dashboard',
  '{"layout":[{"type":"pie","question_id":"q1"}]}'
),
(
  2,
  'Transport Dashboard',
  '{"layout":[{"type":"barchart","question_id":"q1"}]}'
),
(
  1,
  'Food Waste Dashboard',
  '{"layout":[{"type":"wordcloud","question_id":"q1"}]}'
);
