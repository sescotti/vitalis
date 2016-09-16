INSERT INTO "user"("email","password","altura","birth_date","blood_factor", "blood_type", "dni", "gender","name", "peso")  VALUES('ailin@gmail', '123456', 1.56, '1987-09-28', 0, 3, '33.261.813', 1, 'ailin', 48.5);
INSERT INTO "user"("email","password","altura","birth_date","blood_factor", "blood_type", "dni", "gender","name", "peso")  VALUES('seba@gmail', '123456', 1.76, '1987-02-17', 0, 4, '34.444.568', 0, 'seba', 70);
INSERT INTO "user"("email","password","altura","birth_date","blood_factor", "blood_type", "dni", "gender","name", "peso")  VALUES('juan@gmail', '123456', 1.5, '2001-09-15', 0, 1, '43.261.813', 0, 'juan', 45);

INSERT INTO  "module"("registration_date", "update_date") VALUES ('2016-05-01', '2016-08-20');
INSERT INTO  "module"("registration_date", "update_date") VALUES ('2016-05-01', '2016-08-20');


INSERT INTO "monitoring"("start_date", "id_module_id", "id_patient_id") VALUES ('2016-07-01', 1,1);

INSERT INTO "measurement"("measurement_date", "measurement_type", "value", "id_monitoring_id") VALUES ('2016-07-01', 0, 36.5, 1);