// Using Express, Mongoose
const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// Define a route handler for the root URL
/*app.get('/', (req, res) => {
    res.send('Hello, World!');
});*/

//Sample in-memory storage for todo items
//let todos = [];

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

//Define a schema for todo items
const todoSchema = new mongoose.Schema({
    title: String,
    description: String
})

//Create a model based on the schema
const todoModel = mongoose.model('Todo', todoSchema);


//Create a new todo item
app.post('/todos', async (req, res) => {
    // Logic to create a new todo item
    const {title, description} = req.body;
    /*const newTodo = {
        id: todos.length + 1,
        title,
        description,
    };
    todos.push(newTodo);
    console.log(todos);*/

    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
   


    res.status(201).json(newTodo);
    
})

//Get all Items
app.get('/todos', async(req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
    console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
});


//Update todo item
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true } // Return the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//Delete todo item
app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).send(); // No content to return
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Start the server and listen on port 3000
const port = 8000;
app.listen(port, () => {
    console.log("Server is listening to port "+port);

})