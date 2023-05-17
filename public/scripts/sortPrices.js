document.getElementById('price-high-low').addEventListener('click', () => {
	const gridItems = document.getElementsByClassName('market-grid-item');
	const priceArr = [];
	for (let i = 0; i < gridItems.length; i++) {
		const priceId = gridItems[i].id;
		const price = gridItems[i].getAttribute('data-price');
		priceArr.push({ priceId: priceId, price: price });
	}
	priceArr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
	for (let i = 0; i < priceArr.length; i++) {
		document.getElementById(priceArr[i].priceId).style.order = i;
	}
});

document.getElementById('price-low-high').addEventListener('click', () => {
	const gridItems = document.getElementsByClassName('market-grid-item');
	const priceArr = [];
	for (let i = 0; i < gridItems.length; i++) {
		const priceId = gridItems[i].id;
		const price = gridItems[i].getAttribute('data-price');
		priceArr.push({ priceId: priceId, price: price });
	}
	priceArr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
	for (let i = 0; i < priceArr.length; i++) {
		document.getElementById(priceArr[i].priceId).style.order = i;
	}
});
