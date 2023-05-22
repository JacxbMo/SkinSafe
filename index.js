const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const requestPromise = require('request-promise');
const path = require('path');

const fetch = require('node-fetch');

const mysql = require('mysql');
const connectSql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'skinsafe',
	supportBigNumbers: true,
});

connectSql.connect(function (err) {
	if (err) throw err;
	console.log('Connected to database!');
});

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
	requestPromise({
		url: `http://steamcommunity.com/inventory/${req.user.id}/730/2?l=english`,
		proxy: process.env.PROXY_ADDRESS,
	}).then(
		function (data) {
			connectSql.query('SELECT * FROM marketitems WHERE steamid = ?', [req.user.id], function (err, result) {
				if (err) throw err;
				if (result.length) {
					const dataJSON = JSON.parse(data);
					for (let i = 0; i < result.length; i++) {
						dataJSON.assets = dataJSON.assets.filter(function (el) {
							return el.assetid != result[i].assetid;
						});
						if (i == result.length - 1) {
							res.send(JSON.stringify(dataJSON));
						}
					}
				} else {
					res.send(data);
				}
			});
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
		url: `http://steamcommunity.com/inventory/${req.user.id}/730/2?l=english`,
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
					steamid: req.user.id,
					weapon_type: itemDescription.tags[0].internal_name,
					market_hash_name: itemDescription.market_hash_name,
					icon_url_large: indexFunctions.checkIconUrl(itemDescription),
					sticker_html: indexFunctions.checkStickers(itemDescription),
					inspect_link: indexFunctions.checkInspect(itemDescription, req.user.id, req.body.assetId),
					wear: 0,
					pattern_index: 0,
					finish_catalog: 0,
					price: req.body.itemPrice,
					status: 1,
				};
				console.log(itemArr);
				connectSql.query('SELECT assetid FROM marketitems WHERE assetid = ?', [itemArr.assetid], function (err, result) {
					if (err) throw err;
					if (result.length) {
						console.log(false);
						res.send(false);
					} else {
						console.log(true);
						connectSql.query('INSERT INTO marketitems SET ?', [itemArr], function (err, result) {
							if (err) throw err;
							res.send(true);
						});
					}
				});
			} else {
				res.json({ status: false });
			}
		},
		function (err) {
			console.error(err);
		}
	);
});
