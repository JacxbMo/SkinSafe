const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const requestPromise = require('request-promise');
const path = require('path');

require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());

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

app.post('/sendSale', (req, res) => {
	requestPromise({
		url: `http://steamcommunity.com/inventory/${req.user.id}/730/2?l=english`,
		proxy: process.env.PROXY_ADDRESS,
	}).then(
		function (data) {
			const dataJSON = JSON.parse(data);
			const filteredAsset = dataJSON.assets.find((e) => e.assetid == req.body.assetId);
			console.log(filteredAsset);
			if (filteredAsset && !isNaN(req.body.itemPrice) && Number(req.body.itemPrice) > 0.5) {
				const itemArr = { assetId: req.body.assetId, steamId: req.user.id, itemInfo: dataJSON.descriptions.find((e) => e.classid == filteredAsset.classid) };
				res.json({ status: true });
			} else {
				res.json({ status: true });
			}
		},
		function (err) {
			console.error(err);
		}
	);
});
