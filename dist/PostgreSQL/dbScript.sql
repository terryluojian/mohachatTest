CREATE TABLE "chat_moha" (
  "ID" serial NOT NULL PRIMARY KEY,
  "time" bigint default NULL,
  "message" text,
  "from" character varying(30) NOT NULL,
  "to" character varying(30) NOT NULL default 'moha',
  "checked" int NOT NULL default '0',
  "postedTime" bigint NOT NULL,
  "flash" smallint NOT NULL
);

ALTER TABLE ONLY "chat_moha"
    ADD CONSTRAINT "chat_moha_ID_key" UNIQUE ("ID", "time");


CREATE TABLE "chat_moha_archive" (
  "ID" int NOT NULL,
  "time" bigint NOT NULL,
  "message" text NOT NULL,
  "from" character varying(30) NOT NULL,
  "to" character varying(30) NOT NULL,
  "checked" int NOT NULL,
  "postedTime" bigint NOT NULL,
  "flash" smallint NOT NULL
);


CREATE TABLE "chat_moha_buddy" (
  "UID" character varying(30) NOT NULL,
  "BID" character varying(30) NOT NULL,
  "status" smallint NOT NULL default '0',
  "cust_status" int NOT NULL default '0',
  "cust_status_message" character varying(18) default NULL
);

ALTER TABLE ONLY "chat_moha_buddy"
    ADD CONSTRAINT "chat_moha_buddy_UID_key" PRIMARY KEY ("UID", "BID");


CREATE TABLE "chat_moha_file_hist" (
  "id" int NOT NULL,
  "content" bytea NOT NULL,
  "part" int NOT NULL
);


CREATE TABLE "chat_moha_file_up" (
  "id" serial NOT NULL PRIMARY KEY,
  "name" character varying(50) NOT NULL,
  "mime" character varying(30) NOT NULL,
  "size" int NOT NULL,
  "from" character varying(30) NOT NULL
);


CREATE TABLE "chat_moha_poll" (
  "UID" character varying(30) NOT NULL PRIMARY KEY,
  "time" bigint NOT NULL,
  "cust_status" int NOT NULL default '0',
  "cust_status_message" text
);


CREATE TABLE "chat_moha_users" (
  "UID" character varying(30) NOT NULL PRIMARY KEY,
  "PW" character varying(32) NOT NULL
);
