const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	return sequelize.define('settings', {
		settingName: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true
		},
		settingDataType: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		settingValue: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		sortOrder: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		isDeleted: {
			allowNull: false,
            defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
	});
};