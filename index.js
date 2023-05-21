const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const requestPromise = require('request-promise');
const path = require('path');

const fetch = require('node-fetch');

require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8080, () => {
	console.log('Server Live!');
});

// Required to get data from user for sessions
passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});
// Initiate Strategy
passport.use(
	new SteamStrategy(
		{
			returnURL: 'http://localhost:8080/api/auth/steam/return',
			realm: 'http://localhost:8080/',
			apiKey: process.env.STEAM_API_KEY,
		},
		function (identifier, profile, done) {
			process.nextTick(function () {
				profile.identifier = identifier;
				return done(null, profile);
			});
		}
	)
);
app.use(
	session({
		secret: 'OqchR1HgLjCZrkF9',
		saveUninitialized: true,
		resave: false,
		cookie: {
			maxAge: 3600000,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

async function getFloat() {
	const options = {
		headers: {
			origin: 'http://steamcommunity.com',
		},
	};

	const getFloat = await fetch('https://api.csgofloat.com/?url=steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M625254122282020305A6760346663D30614827701953021', options);
	const seeFloat = await getFloat.json();
	console.log(seeFloat);
}

getFloat();

// Routes
app.get('/getUser', (req, res) => {
	if (req.user) {
		res.json(req.user);
	} else {
		res.json({ getUser: 'failed' });
	}
});
app.get('/api/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
	res.redirect('/');
});
app.get('/api/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
	res.redirect('/sell');
});

app.get('/sell', (req, res) => {
	if (req.user) {
		res.sendFile(path.join(__dirname, './online_html/sell.html'));
	} else {
		res.sendFile(path.join(__dirname, './offline_html/sell.html'));
	}
});

app.get('/getInventory', (req, res) => {
	console.log(req.user);
	requestPromise({
		url: `http://steamcommunity.com/inventory/${'76561198153039097'}/730/2?l=english`,
		proxy: process.env.PROXY_ADDRESS,
	}).then(
		function (data) {
			res.send(data);
		},
		function (err) {
			console.error(err);
		}
	);
});

const indexFunctions = require('./functions.js');

app.post('/sendSale', (req, res) => {
	console.log(req.body);
	requestPromise({
		url: `http://steamcommunity.com/inventory/${'76561198416694622'}/730/2?l=english`,
		proxy: process.env.PROXY_ADDRESS,
	}).then(
		function (data) {
			const dataJSON = JSON.parse(data);
			const filteredAsset = dataJSON.assets.find((e) => e.assetid == req.body.assetId);
			const itemDescription = dataJSON.descriptions.find((e) => e.classid == filteredAsset.classid);
			if (filteredAsset && !isNaN(req.body.itemPrice) && Number(req.body.itemPrice) > 0.5 && itemDescription.tradable === 1) {
				console.log(itemDescription);
				const itemArr = {
					assetid: req.body.assetId,
					steamid: '76561198416694622',
					weapon_type: itemDescription.tags[0].internal_name,
					market_hash_name: itemDescription.market_hash_name,
					icon_url_large: itemDescription.icon_url_large,
					sticker_html: indexFunctions.checkStickers(itemDescription),
					inspect_link: indexFunctions.checkInspect(itemDescription, '76561198416694622', req.body.assetId),
					wear: null,
					pattern_index: null,
					finish_catalog: null,
				};
				console.log(itemArr);
				res.json({ status: true });
			} else {
				res.json({ status: false });
			}
		},
		function (err) {
			console.error(err);
		}
	);
});

// const mysql = require('mysql');
// const connectSql = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	database: 'sneakersail',
// 	supportBigNumbers: true,
// });
