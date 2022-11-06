-- Active: 1667099795059@@127.0.0.1@3306@hu
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS UserVerification;


Create table IF NOT EXISTS Settings(
	id varchar(36) not null AUTO_INCREMENT primary key,
	settingName VARCHAR(256) not null,
	settingDataType VARCHAR(256) not null,
	settingValue VARCHAR(256) not null,
	sortOrder integer,
	isDeleted boolean NOT NULL default(FALSE),
	modifiedOn datetime not null
);

CREATE TABLE IF NOT EXISTS Users(
    id INTEGER  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email NVARCHAR(512) NOT NULL UNIQUE,
    password blob,
	name NVARCHAR(512) NOT NULL,
	lastLoginOn datetime,
    lastLogOut datetime, 
    isLockedOut boolean not null,
	isConfirmed boolean not null,
	numOfFailedPasswordAttempt integer not null DEFAULT(0),
	isDeleted boolean NOT NULL default(FALSE),
	modifiedOn datetime not null,
    createdOn datetime not null
);

CREATE TABLE IF NOT EXISTS UserVerification(
    id INTEGER  NOT NULL PRIMARY KEY,
    userId INTEGER NOT NULL,
    verificationCode NVARCHAR(512) NOT NULL UNIQUE,
	verifiedOn datetime,	
	isDeleted boolean NOT NULL default(FALSE),
	modifiedOn datetime not null,
    createdOn datetime not null,
	expiresOn datetime not null
);

ALTER USER 'simba'@'localhost' IDENTIFIED WITH mysql_native_password BY 'jupiter22@';

flush privileges;

