const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('campaigns', { 
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		description: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		tags: {
			allowNull: false,
			type: DataTypes.STRING,
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
	},);
};