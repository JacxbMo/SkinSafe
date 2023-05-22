//hide the item modal
document.getElementById('item-modal-close-button').addEventListener('click', () => {
	document.getElementById('item-modal-container').style.display = 'none';
});

//hide the item modal
document.getElementById('item-modal-container').addEventListener('click', (event) => {
	if (event.target == document.getElementById('item-modal-container') && event.target !== document.getElementById('item-modal')) {
		document.getElementById('item-modal-container').style.display = 'none';
	}
});

//display the item modal
window.addEventListener('click', (event) => {
	if (event.target.className == 'fa-solid fa-circle-info') {
		localStorage.setItem('selectedSale', event.target.closest('.market-grid-item').id);
		document.getElementById('item-modal-container').style.display = 'flex';
	}
});

//calculate value of user pay based on recieved cash
function calculateRecievePay() {
	document.getElementById('item-modal-input-pay').value = (Number(document.getElementById('item-modal-input-recieve').value) / 0.925).toFixed(2);
	if (document.getElementById('item-modal-input-recieve').value == '') {
		document.getElementById('item-modal-input-pay').value = '';
	}
}

//calculate value of recieved cash based on user pay
function calculateRecieveSend() {
	document.getElementById('item-modal-input-recieve').value = Number(document.getElementById('item-modal-input-pay').value * 0.925).toFixed(2);
	if (document.getElementById('item-modal-input-pay').value == '') {
		document.getElementById('item-modal-input-recieve').value = '';
	}
}

window.addEventListener('click', (event) => {
	if (event.target.id === 'item-modal-add-to-sale') {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ assetId: localStorage.getItem('selectedSale'), itemPrice: document.getElementById('item-modal-input-pay').value }),
		};

		const sendSale = async () => {
			const reqSale = await fetch('/sendSale', options);
			const resSale = await reqSale.json();

			if (resSale.status === true) {
				console.log(resSale);
				saleFail();
			} else {
				console.log(false);
			}
		};
		sendSale();
	}
});

// //send sell request
// document.getElementById('item-modal-add-to-sale').addEventListener('click', () => {
// 	console.log('hello');
// 	const options = {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({ assetId: localStorage.getItem('selectedSale'), itemPrice: document.getElementById('item-modal-input-pay').value }),
// 	};

// 	const sendSale = async () => {
// 		const reqSale = await fetch('/sendSale', options);
// 		const resSale = await reqSale.json();

// 		if (resSale.status === true) {
// 			console.log(resSale);
// 			saleFail();
// 		} else {
// 			console.log(false);
// 		}
// 	};
// 	sendSale();
// });

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function saleFail() {
	const notificationItem = document.createElement('div');
	notificationItem.className = 'notification';
	notificationItem.setAttribute('id', 'sail-fail');
	notificationItem.innerHTML = `<p>SALE LISTED SUCCESSFULLY</p><div></div>`;
	document.getElementById('notifications-container').appendChild(notificationItem);
	removeFadeOut(document.getElementById('sail-fail'), 1000);
}

function removeFadeOut(el, speed) {
	var seconds = speed / 1000;
	el.style.transition = 'opacity ' + seconds + 's ease';

	el.style.opacity = 0;
	setTimeout(function () {
		el.parentNode.removeChild(el);
	}, speed);
}
