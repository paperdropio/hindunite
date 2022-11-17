const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('userVerifications', { 
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		userId: {
			allowNull: false,
			type: DataTypes.UUID,
		},
		verificationCode: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		verifiedOn: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		isDeleted: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		expiresOn: {
			allowNull: true,
			type: DataTypes.DATE,
		},
	}, {
		indexes: [
			// Create a unique index on email
			{
			  unique: true,
			  fields: ['verificationCode']
			},
		],
	});
};