const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('campaigns', { 
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID
		},
		createdByUserId: {
			allowNull: false,
			type: DataTypes.UUID,
		},
		campaignType:  {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		description: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
		steps: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
		tags: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		location: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		totalUsersRequired: {
			allowNull: false,
			type: DataTypes.INTEGER,
		}, 
		totalUsersRegistered: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		isDeleted: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		dueDate: {
			allowNull: true,
			type: DataTypes.DATE,
		}
	},);
};