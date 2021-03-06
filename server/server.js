const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);

const { User } = require('./models/user');
const { Game } = require('./models/game');
const { auth } = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

app.use(express.static('client/build'));


// GET
app.get('/api/auth', auth, (req, res) => {
	res.json({
		isAuth: true,
		id: req.user._id,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname
	});
});

app.get('/api/games', (req, res) => {
	let skip = parseInt(req.query.skip);
	let limit = parseInt(req.query.limit);
	let order = req.query.order;

	Game.find()
		.skip(skip)
		.sort({ _id: order })
		.limit(limit)
		.exec((err, doc) => {
			if (err) return res.status(400).send(err);
			res.send(doc);
		});
});

app.get('/api/getGame', (req, res) => {
	let id = req.query.id;

	Game.findById(id, (err, doc) => {
		if (err) return res.status(400).send(err);
		res.send(doc);
	});
});

app.get('/api/getReviewer', (req, res) => {
	let id = req.query.id;
	User.findById(id, (err, doc) => {
		if (err) return res.status(400).send(err);
		res.json({
			name: doc.name,
			lastname: doc.lastname
		});
	});
});

app.get('/api/users', (req,res)=>{
  User.find({}, (err,users)=>{
		if (err) return res.status(400).send(err);
    res.status(200).send(users)
  })
})

app.get('/api/user_posts', (req, res) => {
	Game.find({ ownerId: req.query.user }).exec((err, docs) => {
		if (err) return res.status(400).send(err);
		res.send(docs);
	});
});

app.get('/api/logout', auth, (req, res) => {
	req.user.deleteToken(req.token, (err, user) => {
		if (err) return res.status(400).send(err);
		res.sendStatus(200);
	});
});


// POST
app.post('/api/game', (req, res) => {
	const game = new Game(req.body);

	game.save((err, doc) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({
			post: true,
			gameId: doc._id
		});
	});
});

app.post('/api/register', (req, res) => {
	const user = new User(req.body);
	user.save((err, doc) => {
		if (err) return res.json({ success: false });
		res.status(200).json({
			success: true,
			user: doc
		});
	});
});

app.post('/api/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res.json({
				isAuth: false,
				message: 'Auth failed, email not found'
			});

		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({ isAuth: false, message: 'Wrong password' });

			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);
				res.cookie('auth', user.token).json({
					isAuth: true,
					id: user._id,
					email: user.email
				});
			});
		});
	});
});

// UPDATE GAME
app.post('/api/game_update', (req, res) => {
	Game.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
		if (err) return res.status(400).send(err);
		res.json({
			success: true,
			doc
		});
	});
});

// DELETE GAME
app.delete('/api/game_delete', (req, res) => {
	let id = req.query.id;
	Game.findByIdAndRemove(id, (err, doc) => {
		if (err) return res.status(400).send(err);
		res.json(true);
	});
});


if(process.env.NODE_ENV === 'production'){
  const path = require('path');
  app.get('/*', (req, res) => {
    res.sendfile(path.resolve(__dirname, '../client','build','index.html'));
  })
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server running at ${port}`);
});
