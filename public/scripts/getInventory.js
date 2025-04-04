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

const inventoryArr = [];

const getInventory = async () => {
	const options = {
		method: 'GET',
	};

	const inventoryReq = await fetch('/getInventory', options);
	const inventoryRes = await inventoryReq.json();

	console.log(inventoryRes);
	inventoryArr.push(inventoryRes);

	document.getElementById('market-content-grid').innerHTML = '';

	for (let i = 0; i < inventoryRes.assets.length; i++) {
		const classCheck = inventoryRes.descriptions.find((e) => e.classid == inventoryRes.assets[i].classid);
		const itemPrice = getPrices().find((e) => e.market_hash_name == classCheck.market_hash_name);
		if (itemPrice == undefined) {
			continue;
		}
		if (classCheck.tradable === 0 || classCheck.market_hash_name.includes('Pin')) {
			continue;
		}

		function checkImg() {
			if (JSON.stringify(classCheck).includes('icon_url_large')) {
				return classCheck.icon_url_large;
			} else {
				return classCheck.icon_url;
			}
		}
		function checkWear() {
			if (classCheck.market_hash_name.includes('Sticker') && !classCheck.market_hash_name.includes('Glitter') && !classCheck.market_hash_name.includes('Foil') && !classCheck.market_hash_name.includes('Holo') && !classCheck.market_hash_name.includes('Gold')) {
				return 'PAPER';
			} else if (classCheck.type == 'Base Grade Container') {
				return 'MISCELLANEOUS';
			} else if (classCheck.market_hash_name.includes('★') && !classCheck.market_hash_name.includes('(')) {
				return 'VANILLA';
			} else if (classCheck.market_hash_name.includes('Sticker')) {
				return classCheck.market_hash_name
					.match(/\((.*)\)/)
					.pop()
					.toUpperCase();
			} else if ((classCheck.market_hash_name.includes('Case') && !classCheck.market_hash_name.includes('Case Hardened')) || classCheck.market_hash_name.includes('Sealed Graffiti') || classCheck.market_hash_name.includes('Music Kit')) {
				return 'MISCELLANEOUS';
			} else if (classCheck.type.includes('Agent')) {
				return classCheck.market_hash_name.split('|').pop().toUpperCase();
			} else if (classCheck.market_hash_name.includes('(')) {
				return classCheck.market_hash_name
					.match(/\(([^)]+)\)/)
					.pop()
					.toUpperCase();
			}
		}
		function checkType() {
			if (classCheck.market_hash_name.includes('Case') || classCheck.type == 'Base Grade Container') {
				return 'CONTAINER';
			} else if (classCheck.type.includes('Agent')) {
				return 'AGENT';
			} else {
				return classCheck.market_hash_name.split('|', 1)[0].toUpperCase();
			}
		}
		function checkName() {
			if (classCheck.market_hash_name.includes('Sticker') && classCheck.market_hash_name.includes('(')) {
				return `${classCheck.market_hash_name.substring(classCheck.market_hash_name.indexOf('|') + 1, classCheck.market_hash_name.lastIndexOf('(')).toUpperCase()} ${classCheck.name
					.substring(classCheck.name.indexOf('|') + 1)
					.toUpperCase()
					.split('|')
					.pop()
					.replace(/ *\([^)]*\) */g, '')
					.replace('♥', ' ')}`;
			} else if (classCheck.market_hash_name.includes('★') && !classCheck.market_hash_name.includes('(')) {
				return 'VANILLA KNIFE';
			} else if (classCheck.market_hash_name.includes('Sticker')) {
				return `${classCheck.market_hash_name.substring(classCheck.market_hash_name.indexOf('|') + 1, classCheck.market_hash_name.lastIndexOf('|')).toUpperCase()} ${classCheck.name
					.substring(classCheck.name.indexOf('|') + 1)
					.toUpperCase()
					.split('|')
					.pop()
					.replace(/ *\([^)]*\) */g, '')
					.replace('♥', ' ')}`;
			} else if (classCheck.type.includes('Agent')) {
				return classCheck.market_hash_name.split('|')[0].replace(`'`, '').replace(`'`, '').toUpperCase();
			}
			return classCheck.name
				.substring(classCheck.name.indexOf('|') + 1)
				.toUpperCase()
				.split('|')
				.pop()
				.replace(/ *\([^)]*\) */g, '')
				.replace('♥', ' ');
		}
		function checkStickersOne() {
			if (foundStickers(classCheck)[0]) {
				return foundStickers(classCheck)[0];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersTwo() {
			if (foundStickers(classCheck)[1]) {
				return foundStickers(classCheck)[1];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersThree() {
			if (foundStickers(classCheck)[2]) {
				return foundStickers(classCheck)[2];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersFour() {
			if (foundStickers(classCheck)[3]) {
				return foundStickers(classCheck)[3];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}

		function checkSticker() {
			if (foundStickers(classCheck)[0]) {
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
				return 'NOTHING APPLIED';
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
		gridItem.setAttribute('id', inventoryRes.assets[i].assetid);
		gridItem.className = 'market-grid-item';
		gridItem.innerHTML = `
								<div class="grid-item-content-container">
									<div class="gird-item-top-info">
										<i class="fa-solid fa-circle-plus"></i>
										<p class="grid-item-wear">${checkWear()}</p>
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
		if (classCheck.market_hash_name.includes('StatTrak')) {
			gridItem.querySelector('.grid-item-img').style.filter = 'drop-shadow(0px 0px 25px rgb(227, 224, 67, 0.125)';
		}
		gridItem.setAttribute('data-price', checkPriceExistance());
		document.getElementById('market-content-grid').appendChild(gridItem);
	}
	document.getElementById('tradable-inventory-count').innerHTML = `TRADABLE ITEMS: ${document.getElementsByClassName('market-grid-item').length}`;
};

getInventory();

function getInspectLink(itemDescriptions, assetId) {
	if (itemDescriptions.actions) {
		document.getElementById('item-modal-view-in-game').style.opacity = '0.5';
		document.getElementById('item-modal-view-in-game').style.cursor = 'cursor';
		document.getElementById('item-modal-view-in-game').style.pointerEvents = 'auto';
		return itemDescriptions.actions[0].link.replace('%owner_steamid%', localStorage.getItem('steamId')).replace('%assetid%', assetId);
	} else {
		document.getElementById('item-modal-view-in-game').style.opacity = '0.25';
		document.getElementById('item-modal-view-in-game').style.cursor = 'default';
		document.getElementById('item-modal-view-in-game').style.display = 'none';
		return '';
	}
}

function checkDescription(description, descriptionTwo) {
	if (description && description.includes('<i>')) {
		return `${description.replace('<i>', '').replace('</i>', '')}.`;
	} else if (description.length > 2 && !description.includes('Agents')) {
		return description;
	} else if (descriptionTwo.includes('graffiti')) {
		return descriptionTwo.replace('<b>', '').replace('</b>', '');
	} else if (descriptionTwo.includes('sticker')) {
		return descriptionTwo;
	} else if (descriptionTwo.includes('</i>')) {
		return descriptionTwo.replace('</i>', '').replace('<i>', '');
	} else {
		return `Looks like this item doesn't have a description!`;
	}
}

function checkModalStickerType(sticker) {
	if (sticker.includes('(') && !sticker.includes('(T)') && !sticker.includes('(CT)')) {
		return sticker.substring(sticker.indexOf('(') + 1, sticker.lastIndexOf(')')).toUpperCase();
	} else {
		return 'PAPER';
	}
}

function checkModalStickerName(sticker) {
	if (sticker.includes('(')) {
		return sticker.substring(0, sticker.indexOf('(')).toUpperCase();
	} else if (sticker.includes('|')) {
		return sticker.substring(0, sticker.indexOf('|')).toUpperCase();
	} else {
		return sticker.toUpperCase();
	}
}

function checkModalStickerSet(sticker) {
	if (sticker.includes('|')) {
		return sticker.split('|')[1].toUpperCase();
	} else {
		return 'STICKER';
	}
}

function addStickers(stickerimg, stickerText) {
	const stickerNames = stickerText.substring(stickerText.indexOf(`.png"><br>`), stickerText.lastIndexOf('</center>')).replace(`.png"><br>Sticker: `, '');

	let tagsArray = stickerNames.split(/,\s*/).map((s) => ({ sticker: s }));

	if (stickerText.includes('Sticker') && !stickerText.includes('Patch')) {
		for (let i = 0; i < foundStickers(stickerimg).length; i++) {
			const sticker = document.createElement('div');
			sticker.className = 'item-modal-sticker';
			sticker.innerHTML = `<div class="item-modal-sticker">
						<p class="item-modal-sticker-type">${checkModalStickerType(tagsArray[i].sticker)}</p>
						<div class="item-modal-sticker-img">
							<img src="${foundStickers(stickerimg)[i]}">
						</div>
						<p class="item-modal-sticker-name">${checkModalStickerName(tagsArray[i].sticker)}</p>
						<p class="item-modal-sticker-extra">${checkModalStickerSet(tagsArray[i].sticker)}</p>
						<p class="item-modal-sticker-scrape">SCRAPE : 0%</p>
					</div>`;
			document.getElementById('item-modal-image-bottom').appendChild(sticker);
		}
	} else if (stickerText.includes('Patch')) {
		const patchText = tagsArray[0].sticker.replace(`.png\"><br>`, '').replace('Patch: ', '');
		tagsArray[0] = { sticker: patchText };
		console.log(tagsArray);
		for (let i = 0; i < foundStickers(stickerimg).length; i++) {
			const sticker = document.createElement('div');
			sticker.className = 'item-modal-sticker';
			sticker.innerHTML = `<div class="item-modal-sticker">
						<p class="item-modal-sticker-type">${'DEFAULT'}</p>
						<div class="item-modal-sticker-img">
							<img src="${foundStickers(stickerimg)[i]}">
						</div>
						<p class="item-modal-sticker-name">${checkModalStickerName(tagsArray[i].sticker)}</p>
						<p class="item-modal-sticker-extra">${'PATCH'}</p>
						<p class="item-modal-sticker-scrape">CONSTANT WEAR</p>
					</div>`;
			document.getElementById('item-modal-image-bottom').appendChild(sticker);
		}
	} else {
		document.getElementById('item-modal-image-bottom').innerHTML = `<div id="item-modal-no-stickers">THIS ITEM HAS NOTHING APPLIED TO IT</div>`;
	}
}

window.addEventListener('click', (event) => {
	if (event.target.className == 'fa-solid fa-circle-info') {
		const assetId = event.target.closest('.market-grid-item').id;
		console.log(inventoryArr);
		const filteredAsset = inventoryArr[0].assets.find((e) => e.assetid == assetId);
		const itemDescriptions = inventoryArr[0].descriptions.find((e) => e.classid == filteredAsset.classid);

		console.log(filteredAsset);
		console.log(itemDescriptions);

		function checkModalImg(item) {
			if (item.icon_url_large) {
				return item.icon_url_large;
			}
			return item.icon_url;
		}

		document.getElementById('item-modal').innerHTML = `
				<div id="item-modal-image-container">
					<div id="item-modal-image-top">
						<p id="item-modal-close-button"><i class="fa-solid fa-arrow-left"></i>GO BACK</p>
						<div id="item-modal-main-image-container">
							<img id="item-modal-main-top" src="https://community.akamai.steamstatic.com/economy/image/${checkModalImg(itemDescriptions)}">
						</div>
						<a id="item-modal-view-in-game" href="">VIEW IN GAME<i class="fa-solid fa-arrow-up-right-from-square"></i></a>
						<div id="item-modal-float-container">
							<p>0.0328904</p>
							<div id="item-modal-float-bar-container">
								<i class="fa-solid fa-caret-up"></i>
								<div class="factory-new-float-bar"></div>
								<div class="minimal-wear-float-bar"></div>
								<div class="field-tested-float-bar"></div>
								<div class="well-worn-float-bar"></div>
								<div class="battle-scared-float-bar"></div>
							</div>
						</div>
					</div>
					<div id="item-modal-image-bottom">

					</div>
				</div>
				<div id="item-modal-info-container">
					<p id="item-modal-wear">${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-type').innerHTML} - ${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-wear').innerHTML}</p>
					<p id="item-modal-name">${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-name').innerHTML}</p>
					<p id="item-modal-price">${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-price').innerHTML}</p>
					<p id="item-modal-suggested-price">${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-suggested-price').innerHTML}</p>
					<div id="item-modal-extra-info">
						<p><span>PATTERN INDEX - </span> TBD</p>
						<p id="item-modal-finish"><span>FINISH - </span> TBD</p>
					</div>
					<p id="item-modal-description-title">DESCRIPTION :</p>
					<p id="item-modal-description">${checkDescription(itemDescriptions.descriptions[2].value, itemDescriptions.descriptions[0].value)}</p>
					<form id="send-item-sell-form">
						<div class="item-modal-recieve-pay">
							<p class="item-modal-split-title">YOU RECEIVE</p>
							<div><p>€</p><input placeholder="0.00" type="number" step=".01" id="item-modal-input-recieve" oninput="calculateRecievePay()" maxlength="10"></div>
						</div>
						<div class="item-modal-recieve-pay">
							<p class="item-modal-split-title">THEY PAY</p>
							<div><p>€</p><input placeholder="0.00" type="number" name="itemPrice" step=".01" id="item-modal-input-pay" oninput="calculateRecieveSend()" maxlength="10"></div>
						</div>
					</form>
					<input id="item-modal-add-to-sale" type="submit" value="PUT UP FOR SALE">
				</div>
			`;
		if (itemDescriptions.actions) {
			document.getElementById('item-modal-view-in-game').href = itemDescriptions.actions[0].link.replace('%owner_steamid%', localStorage.getItem('steamId')).replace('%assetid%', assetId);
		} else {
			document.getElementById('item-modal-view-in-game').style.pointerEvents = 'none';
		}
		addStickers(itemDescriptions, itemDescriptions.descriptions[itemDescriptions.descriptions.length - 1].value);
	}
});
