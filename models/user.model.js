const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('users', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},
		password: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		lastLoginOn: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		lastLogOut: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		isLockedOut: {
			allowNull: false,
            defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
		isConfirmed: {
			allowNull: false,
            defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
		isDeleted: {
			allowNull: false,
            defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
		numOfFailedPasswordAttempt: {
			allowNull: false,
            defaultValue: 0,
			type: DataTypes.INTEGER,
		},
	});
};