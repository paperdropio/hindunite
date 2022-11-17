const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('campaignUsers', { 
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER,
			autoIncrement: true,
		},
		userId: {
			allowNull: false,
			type: DataTypes.UUID,
		},
		campaignId: {
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