const checkInspect = function (description, userId, assetId) {
	if (description.actions[0]) {
		return description.actions[0].link.replace('%assetid%', assetId).replace('%owner_steamid%', userId);
	} else {
		return 'false';
	}
};

const checkStickers = function (description) {
	if (description.descriptions[description.descriptions.length - 1].value && description.descriptions[description.descriptions.length - 1].value.includes('Sticker')) {
		return description.descriptions[description.descriptions.length - 1].value;
	} else {
		return null;
	}
};

module.exports = {
	checkInspect,
	checkStickers,
};
