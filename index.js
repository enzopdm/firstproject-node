const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

app.listen(3000, () => {
  console.log("🤖 Server started on port 3000")
})

const checkOrderId = (request, response, next) => {
  const { id } = request.params

  const index = orders.findIndex(order => order.id === id)

  if (index < 0) {
    return response.status(404).json({ error: "Order not found" })
  }

  request.orderIndex = index
  request.orderId = id

  next()
}

const showMethodUrl = (request, response, next) => {
  console.log(request.method, request.originalUrl)

  next()
}

const orders = []

app.post('/order', showMethodUrl, (request, response) => {
  const { order, clientName, price, status } = request.body

  const clientOrder = { id: uuid.v4(), order, clientName, price, status }

  orders.push(clientOrder)
  return response.status(201).json(clientOrder)
})

app.get('/order', showMethodUrl, (request, response) => {
  return response.json(orders)
})

app.put('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
  const { order, clientName, price, status } = request.body
  const index = request.orderIndex
  const id = request.orderId

  const updatedOrder = { id: id, order, clientName, price, status }

  orders[index] = updatedOrder

  return response.json(updatedOrder)
})

app.delete('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
  const index = request.orderIndex

  orders.splice(index, 1)

  return response.status(201).json()
})

app.get('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
  const index = request.orderIndex

  return response.json(orders[index])
})

app.patch('/order/:id', showMethodUrl, checkOrderId, (request, response) => {
  const index = request.orderIndex

  orders[index].status = "Pronto"

  return response.json(orders[index])
})