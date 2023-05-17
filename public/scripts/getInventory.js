function foundStickers(item) {
	// stringnick.pro
	const stickers = [];
	let stickerString = null;
	if (item && item.descriptions) {
		for (let k = 0; k < item.descriptions.length; k++) {
			if (item.descriptions[k].value.includes('sticker')) {
				stickerString = item.descriptions[k].value;
				break;
			}
		}
	}
	if (stickerString) {
		const regex = /<img width=64 height=48 src="(.*?)">/g;
		let m;

		while ((m = regex.exec(stickerString)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			m.forEach((match, groupIndex) => {
				if (groupIndex === 1) {
					stickers.push(match);
				}
			});
		}
	}
	return stickers;
}

const getInventory = async () => {
	const options = {
		method: 'GET',
	};

	const inventoryReq = await fetch('/getInventory', options);
	const inventoryRes = await inventoryReq.json();

	console.log(inventoryRes);

	document.getElementById('market-content-grid').innerHTML = '';

	for (let i = 0; i < inventoryRes.descriptions.length; i++) {
		const itemPrice = getPrices().find((e) => e.market_hash_name == inventoryRes.descriptions[i].market_hash_name);
		if (itemPrice == undefined) {
			continue;
		}
		if (inventoryRes.descriptions[i].tradable === 0 || inventoryRes.descriptions[i].market_hash_name.includes('Pin')) {
			continue;
		}
		const filteredAsset = inventoryRes.assets.find((e) => e.classid == inventoryRes.descriptions[i].classid);

		// console.log(inventoryRes.descriptions[i].actions[0].link.replace('%owner_steamid%', '76561198416694622').replace('%assetid%', filteredAsset.assetid));

		function checkImg() {
			if (JSON.stringify(inventoryRes.descriptions[i]).includes('icon_url_large')) {
				return inventoryRes.descriptions[i].icon_url_large;
			} else {
				return inventoryRes.descriptions[i].icon_url;
			}
		}
		function checkWear() {
			if (inventoryRes.descriptions[i].market_hash_name.includes('Sticker') && !inventoryRes.descriptions[i].market_hash_name.includes('Glitter') && !inventoryRes.descriptions[i].market_hash_name.includes('Foil') && !inventoryRes.descriptions[i].market_hash_name.includes('Holo') && !inventoryRes.descriptions[i].market_hash_name.includes('Gold')) {
				return 'PAPER';
			} else if (inventoryRes.descriptions[i].type == 'Base Grade Container') {
				return 'MISCELLANEOUS';
			} else if (inventoryRes.descriptions[i].market_hash_name.includes('★') && !inventoryRes.descriptions[i].market_hash_name.includes('(')) {
				return 'VANILLA';
			} else if (inventoryRes.descriptions[i].market_hash_name.includes('Sticker')) {
				return inventoryRes.descriptions[i].market_hash_name
					.match(/\((.*)\)/)
					.pop()
					.toUpperCase();
			} else if ((inventoryRes.descriptions[i].market_hash_name.includes('Case') && !inventoryRes.descriptions[i].market_hash_name.includes('Case Hardened')) || inventoryRes.descriptions[i].market_hash_name.includes('Sealed Graffiti') || inventoryRes.descriptions[i].market_hash_name.includes('Music Kit')) {
				return 'MISCELLANEOUS';
			} else if (inventoryRes.descriptions[i].type.includes('Agent')) {
				return inventoryRes.descriptions[i].market_hash_name.split('|').pop().toUpperCase();
			} else if (inventoryRes.descriptions[i].market_hash_name.includes('(')) {
				return inventoryRes.descriptions[i].market_hash_name
					.match(/\(([^)]+)\)/)
					.pop()
					.toUpperCase();
			}
		}
		function checkType() {
			if (inventoryRes.descriptions[i].market_hash_name.includes('Case') || inventoryRes.descriptions[i].type == 'Base Grade Container') {
				return 'CONTAINER';
			} else if (inventoryRes.descriptions[i].type.includes('Agent')) {
				return 'AGENT';
			} else {
				return inventoryRes.descriptions[i].market_hash_name.split('|', 1)[0].toUpperCase();
			}
		}
		function checkName() {
			if (inventoryRes.descriptions[i].market_hash_name.includes('Sticker') && inventoryRes.descriptions[i].market_hash_name.includes('(')) {
				return `${inventoryRes.descriptions[i].market_hash_name.substring(inventoryRes.descriptions[i].market_hash_name.indexOf('|') + 1, inventoryRes.descriptions[i].market_hash_name.lastIndexOf('(')).toUpperCase()} ${inventoryRes.descriptions[i].name
					.substring(inventoryRes.descriptions[i].name.indexOf('|') + 1)
					.toUpperCase()
					.split('|')
					.pop()
					.replace(/ *\([^)]*\) */g, '')
					.replace('♥', ' ')}`;
			} else if (inventoryRes.descriptions[i].market_hash_name.includes('★') && !inventoryRes.descriptions[i].market_hash_name.includes('(')) {
				return 'VANILLA KNIFE';
			} else if (inventoryRes.descriptions[i].market_hash_name.includes('Sticker')) {
				return `${inventoryRes.descriptions[i].market_hash_name.substring(inventoryRes.descriptions[i].market_hash_name.indexOf('|') + 1, inventoryRes.descriptions[i].market_hash_name.lastIndexOf('|')).toUpperCase()} ${inventoryRes.descriptions[i].name
					.substring(inventoryRes.descriptions[i].name.indexOf('|') + 1)
					.toUpperCase()
					.split('|')
					.pop()
					.replace(/ *\([^)]*\) */g, '')
					.replace('♥', ' ')}`;
			} else if (inventoryRes.descriptions[i].type.includes('Agent')) {
				return inventoryRes.descriptions[i].market_hash_name.split('|')[0].replace(`'`, '').replace(`'`, '').toUpperCase();
			}
			return inventoryRes.descriptions[i].name
				.substring(inventoryRes.descriptions[i].name.indexOf('|') + 1)
				.toUpperCase()
				.split('|')
				.pop()
				.replace(/ *\([^)]*\) */g, '')
				.replace('♥', ' ');
		}
		function checkStickersOne() {
			if (foundStickers(inventoryRes.descriptions[i])[0]) {
				return foundStickers(inventoryRes.descriptions[i])[0];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersTwo() {
			if (foundStickers(inventoryRes.descriptions[i])[1]) {
				return foundStickers(inventoryRes.descriptions[i])[1];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersThree() {
			if (foundStickers(inventoryRes.descriptions[i])[2]) {
				return foundStickers(inventoryRes.descriptions[i])[2];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersFour() {
			if (foundStickers(inventoryRes.descriptions[i])[3]) {
				return foundStickers(inventoryRes.descriptions[i])[3];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}

		function checkSticker() {
			if (foundStickers(inventoryRes.descriptions[i])[0]) {
				return `										<div>
											<img loading="lazy" src="${checkStickersOne()}"/>
										</div>
										<div>
											<img loading="lazy" src="${checkStickersTwo()}" />
										</div>
										<div>
											<img loading="lazy" src="${checkStickersThree()}" />
										</div>
										<div>
											<img loading="lazy" src="${checkStickersFour()}" />
										</div>`;
			} else {
				return 'NO STICKERS FOUND';
			}
		}
		function checkPriceExistance() {
			if (itemPrice.min_price && itemPrice.min_price !== null) {
				return itemPrice.min_price;
			} else {
				return itemPrice.suggested_price;
			}
		}

		const gridItem = document.createElement('div');
		gridItem.setAttribute('id', filteredAsset.assetid);
		gridItem.className = 'market-grid-item';
		gridItem.innerHTML = `
								<div class="grid-item-content-container">
									<div class="gird-item-top-info">
										<i class="fa-solid fa-circle-plus"></i>
										<p>${checkWear()}</p>
										<i class="fa-solid fa-circle-info"></i>
									</div>
									<div class="grid-item-img-container">
										<img class="grid-item-img" src="https://community.akamai.steamstatic.com/economy/image/${checkImg()}" />
									</div>

									<div class="grid-item-info-container">
										<p class="grid-item-type">${checkType()}</p>
										<p class="grid-item-name">${checkName().replace('|', '')}</p>
										<p class="grid-item-price">€${checkPriceExistance()}</p>
										<p class="grid-item-suggested-price">SUGGESTED PRICE : €${itemPrice.suggested_price}</p>
									</div>
									<div class="grid-item-float-bar-container">
										<i class="fa-solid fa-caret-up"></i>
										<div class="factory-new-float-bar"></div>
										<div class="minimal-wear-float-bar"></div>
										<div class="field-tested-float-bar"></div>
										<div class="well-worn-float-bar"></div>
										<div class="battle-scared-float-bar"></div>
									</div>
									<div class="grid-item-sticker-container">
										${checkSticker()}
									</div>
								</div>
							`;
		if (inventoryRes.descriptions[i].market_hash_name.includes('StatTrak')) {
			gridItem.querySelector('.grid-item-img').style.filter = 'drop-shadow(0px 0px 25px rgb(227, 224, 67, 0.125)';
		}
		gridItem.setAttribute('data-price', checkPriceExistance());
		document.getElementById('market-content-grid').appendChild(gridItem);
	}
	document.getElementById('tradable-inventory-count').innerHTML = `TRADABLE ITEMS: ${document.getElementsByClassName('market-grid-item').length}`;
};

getInventory();
