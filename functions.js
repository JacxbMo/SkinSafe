const checkInspect = function (description, userId, assetId) {
	if (description.actions[0]) {
		return description.actions[0].link.replace('%assetid%', assetId).replace('%owner_steamid%', userId);
	} else {
		return 'false';
	}
};

module.exports = {
	checkInspect,
};
