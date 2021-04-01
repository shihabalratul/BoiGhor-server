const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
app.use(cors())
app.use(express.json())

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const port = 5000


app.get('/', (req, res) => {
	res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z7rjt.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
	const bookCollection = client.db('boi-ghor').collection('books');
	app.post('/bookDetails', (req, res) => {

		bookCollection.insertOne(req.body)
			.then(data => {
				res.send(data)
			})
	})

	app.get('/products', (req, res) => {
		bookCollection.find({})
			.toArray((err, document) => {
				res.send(document)
			})
	})

	app.delete('/remove/:id', (req, res) => {
		console.log(req.params.id)
		const id = ObjectId(req.params.id)
		bookCollection.findOneAndDelete({ _id: id })
			.then(res => console.log(res))
	})

	app.get('/find/:id', (req, res) => {
		const id = ObjectId(req.params.id);
		bookCollection.find({ _id: id })
			.toArray((err, document) => {
				res.send(document)
			})
	})


});
client.connect(err => {
	const orderCollection = client.db('boi-ghor').collection('userData');
	app.post('/checkoutDetails', (req, res) => {

		orderCollection.insertOne(req.body)
			.then(data => {
				res.send(data)
			})
	})

	app.get('/orderDetails/:email', (req, res) => {
		const email = req.params.email
		orderCollection.find({ email: email })
			.toArray((err, document) => {
				res.send(document)
				// console.log(document)
			})
	})

	app.delete('/cancelOrder/:id', (req, res) => {
		console.log(req.params.id)
		const id = ObjectId(req.params.id)
		orderCollection.findOneAndDelete({ _id: id })
			.then(res => console.log(res))
	})

});
app.listen(process.env.PORT || port)