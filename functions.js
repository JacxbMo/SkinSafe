const checkIconUrl = function (description) {
	if (description.icon_url_large) {
		return description.icon_url_large;
	} else {
		return description.icon_url;
	}
};

const checkInspect = function (description, userId, assetId) {
	if (description.actions) {
		return description.actions[0].link.replace('%assetid%', assetId).replace('%owner_steamid%', userId);
	} else {
		return 0;
	}
};

const checkStickers = function (description) {
	if (description.descriptions[description.descriptions.length - 1].value && description.descriptions[description.descriptions.length - 1].value.includes('Sticker')) {
		return description.descriptions[description.descriptions.length - 1].value;
	} else {
		return 0;
	}
};

module.exports = {
	checkIconUrl,
	checkInspect,
	checkStickers,
};
