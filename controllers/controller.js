const crypto = require("crypto")

const genId = () => crypto.randomUUID();
const data = []

function CreateData (req, res) {
	const {title} = req.body
	if (!title) return res.send('missing required field title')

	const bookData = {_id: genId(), title}

	data.push(bookData)
	res.json(bookData)
}

function ReadData (req, res) {
	const booksdata = data.map((book) => {
		const books = {...book}
		books.comments ? books.commentcount = books.comments.length : books.commentcount = 0
		delete books.comments
		return books
	})
	res.json(booksdata)
}

function DeleteData (req, res) {
	data.length = 0
	res.send('complete delete successfully')
}

function CreateComment (req, res) {
	const {id} = req.params
	const {comment} = req.body

	if (!comment) return res.send('missing required field comment')
	const findBook = data.findIndex((book) => book._id === id.trim())
	if (findBook < 0) return res.send('no book exist')

	!data[findBook].comments ? data[findBook].comments = [comment] : data[findBook].comments.push(comment)

	return res.json(data[findBook])
}

function ReadById (req, res) {
	const {id} = req.params

	const bookData = data.findIndex((book) => book._id === id)
	if (bookData < 0) return res.send('no book exist')

	const result = {...data[bookData]}
	if (!result.comments) result.comments = []

	res.json(result)
}

function DeleteById (req, res) {
	const {id} = req.params
	const findBook = data.findIndex((book) => book._id === id)
	if (findBook < 0) return res.send('no book exist')

	data.splice(findBook, 1)
	res.send('delete successful')
}

module.exports = {CreateData, ReadData, DeleteData, ReadById, CreateComment, DeleteById}