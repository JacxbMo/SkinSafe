const getUser = async () => {
	const reqUser = await fetch('http://localhost:8080/getUser');
	const resUser = await reqUser.json();

	document.getElementById('profile-container').innerHTML = `<img src="${resUser.photos[2].value}" />`;
};

getUser();
