let marketArr = [];

function foundStickers(item) {
	const stickers = [];
	let stickerString = null;
	if (item && item.sticker_html) {
		if (item.sticker_html.includes('sticker')) {
			stickerString = item.sticker_html;
		}
	}
	if (stickerString) {
		const regex = /<img width=64 height=48 src="(.*?)">/g;
		let m;

		while ((m = regex.exec(stickerString)) !== null) {
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

function checkWear(item) {
	if (item.market_hash_name.includes('Sticker') && !item.market_hash_name.includes('Glitter') && !item.market_hash_name.includes('Foil') && !item.market_hash_name.includes('Holo') && !item.market_hash_name.includes('Gold')) {
		return 'PAPER';
	} else if (item.type == 'Base Grade Container') {
		return 'MISCELLANEOUS';
	} else if (item.market_hash_name.includes('★') && !item.market_hash_name.includes('(')) {
		return 'VANILLA';
	} else if (item.market_hash_name.includes('Sticker')) {
		return item.market_hash_name
			.match(/\((.*)\)/)
			.pop()
			.toUpperCase();
	} else if ((item.market_hash_name.includes('Case') && !item.market_hash_name.includes('Case Hardened')) || item.market_hash_name.includes('Sealed Graffiti') || item.market_hash_name.includes('Music Kit')) {
		return 'MISCELLANEOUS';
	} else if (item.weapon_type.includes('CustomPlayer')) {
		return item.market_hash_name.split('|').pop().toUpperCase();
	} else if (item.market_hash_name.includes('(')) {
		return item.market_hash_name
			.match(/\(([^)]+)\)/)
			.pop()
			.toUpperCase();
	}
}

function checkType(item) {
	if (item.market_hash_name.includes('Case') || item.type == 'Base Grade Container') {
		return 'CONTAINER';
	} else if (item.weapon_type.includes('CustomPlayer')) {
		return 'AGENT';
	} else {
		return item.market_hash_name.split('|', 1)[0].toUpperCase();
	}
}

function checkName(item) {
	if (item.market_hash_name.includes('Sticker') && item.market_hash_name.includes('(')) {
		return `${item.market_hash_name.substring(item.market_hash_name.indexOf('|') + 1, item.market_hash_name.lastIndexOf('(')).toUpperCase()} ${item.name
			.substring(item.name.indexOf('|') + 1)
			.toUpperCase()
			.split('|')
			.pop()
			.replace(/ *\([^)]*\) */g, '')
			.replace('♥', ' ')}`;
	} else if (item.market_hash_name.includes('★') && !item.market_hash_name.includes('(')) {
		return 'VANILLA KNIFE';
	} else if (item.market_hash_name.includes('Sticker')) {
		return `${item.market_hash_name.substring(item.market_hash_name.indexOf('|') + 1, item.market_hash_name.lastIndexOf('|')).toUpperCase()} ${item.name
			.substring(item.name.indexOf('|') + 1)
			.toUpperCase()
			.split('|')
			.pop()
			.replace(/ *\([^)]*\) */g, '')
			.replace('♥', ' ')}`;
	} else if (item.weapon_type.includes('CustomPlayer')) {
		return item.market_hash_name.split('|')[0].replace(`'`, '').replace(`'`, '').toUpperCase();
	}
	return item.market_hash_name
		.substring(item.market_hash_name.indexOf('|') + 1)
		.toUpperCase()
		.split('|')
		.pop()
		.replace(/ *\([^)]*\) */g, '')
		.replace('♥', ' ');
}

const getMarket = async () => {
	const reqMarket = await fetch('/getMarket');
	const resMarket = await reqMarket.json();
	marketArr.push(resMarket);
	console.log(resMarket);
	document.getElementById('market-content-grid').innerHTML = '';
	for (let i = 0; i < resMarket.length; i++) {
		const itemPrice = getPrices().find((e) => e.market_hash_name == resMarket[i].market_hash_name);

		function checkStickersOne() {
			if (foundStickers(resMarket[i])[0]) {
				return foundStickers(resMarket[i])[0];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersTwo() {
			if (foundStickers(resMarket[i])[1]) {
				return foundStickers(resMarket[i])[1];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersThree() {
			if (foundStickers(resMarket[i])[2]) {
				return foundStickers(resMarket[i])[2];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}
		function checkStickersFour() {
			if (foundStickers(resMarket[i])[3]) {
				return foundStickers(resMarket[i])[3];
			} else {
				return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/BLANK_ICON.png/120px-BLANK_ICON.png';
			}
		}

		function checkSticker() {
			if (foundStickers(resMarket[i])[0]) {
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

		const gridItem = document.createElement('div');
		gridItem.setAttribute('id', resMarket[i].assetid);
		gridItem.className = 'market-grid-item';
		gridItem.innerHTML = `
								<div class="grid-item-content-container">
									<div class="gird-item-top-info">
										<i class="fa-solid fa-circle-plus"></i>
										<p class="grid-item-wear">${checkWear(resMarket[i])}</p>
										<i class="fa-solid fa-circle-info"></i>
									</div>
									<div class="grid-item-img-container">
										<img class="grid-item-img" src="https://community.akamai.steamstatic.com/economy/image/${resMarket[i].icon_url_large}" />
									</div>

									<div class="grid-item-info-container">
										<p class="grid-item-type">${checkType(resMarket[i])}</p>
										<p class="grid-item-name">${checkName(resMarket[i]).replace('|', '')}</p>
										<p class="grid-item-price">€${resMarket[i].price}</p>
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
		if (resMarket[i].market_hash_name.includes('StatTrak')) {
			gridItem.querySelector('.grid-item-img').style.filter = 'drop-shadow(0px 0px 25px rgb(227, 224, 67, 0.125)';
		}
		document.getElementById('market-content-grid').appendChild(gridItem);
	}
};

getMarket();

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
		const filteredDescription = marketArr[0].find((e) => e.assetid == assetId);

		console.log(filteredDescription);

		document.getElementById('item-modal').innerHTML = `
				<div id="item-modal-image-container">
					<div id="item-modal-image-top">
						<p id="item-modal-close-button"><i class="fa-solid fa-arrow-left"></i>GO BACK</p>
						<div id="item-modal-main-image-container">
							<img id="item-modal-main-top" src="https://community.akamai.steamstatic.com/economy/image/${document.getElementById(assetId).closest('.market-grid-item').querySelector('.grid-item-img').src}">
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
					<p id="item-modal-description">${filteredDescription.item_description}</p>
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
		if (filteredDescription.inspect_link !== 0) {
			document.getElementById('item-modal-view-in-game').href = filteredDescription.inspect_link;
		} else {
			document.getElementById('item-modal-view-in-game').style.pointerEvents = 'none';
		}
		addStickers(filteredDescription, filteredDescription.sticker_html);
	}
});
