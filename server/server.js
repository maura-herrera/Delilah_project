//Importamos express
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//const { response } = require('express');

//Sequelize
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/delilah', {timezone: '-05:00',});

//traemos el archivo de los middlewares
const middlewares = require('./middlewares');
const { validateToken } = require('./middlewares');

//Ejecutamos express
const app = express();
app.use(express.json());

//crear llave secreta
const llave = '11AV3C1i3NT3';


//Users login
app.post('/login', (req, res) => {
    const { username, email, password } = req.body;

    const exist =
        'SELECT * FROM users WHERE username = ? AND email = ? AND password = ?';

    sequelize.query(exist, {
        replacements: [username, email, password],
        type: Sequelize.QueryTypes.SELECT,
       
    })
   
        .then((data) => {
           // console.log(data);
            if (!data.length) return res.status(404).json({ error: 'Credenciales inválidas' });
            const { code_rol, id } = data[0];
            const playload = { id, username, email, code_rol };
           // console.log(playload);
            const token = jwt.sign(playload, llave, { expiresIn: 1440 });
            res.json(token);
        })
        .catch(e => {
            return res.status(400).json({ error: 'Usuario o contraseña inválidos' });
        });
});


//Get users list
app.get('/users', middlewares.validateToken, middlewares.validateAdmin, (req, res) => {
    const query =
          'SELECT users.*, roles.rol FROM users JOIN roles ON roles.id = users.code_rol';
        sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
          .then((users) => {
            res.status(200).json(users);
          })
          .catch((e) => console.log(e));
      }
);


//get dishes list
app.get('/dishes', middlewares.validateToken, async (req, res) => {
    const query = 'SELECT * FROM dishes';
    try {
        const dishesget = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

        res.json(dishesget);
    } catch (e) {
        console.error(e);
    }
});
//Add new dish
app.post('/dishes', middlewares.validateToken, middlewares.validateAdmin, middlewares.dishRepeat, (req, res) => {
      const query = 'INSERT INTO dishes (dish, price) VALUES (?, ?)';
      const { dish, price } = req.body;
      sequelize.query(query, { replacements: [dish, price] })
        .then((response) => {
          res.json({ status: 'Dish created', user: req.body });
        })
        .catch((e) => console.log(e));
    }
  );
//Delete dishes
  app.delete('/dishes', middlewares.validateToken, middlewares.validateAdmin, middlewares.dishExist,
    (req, res) => {
      const query = 'DELETE FROM dishes WHERE id_dish = ? ';
      const { id_dish } = req.body;
      console.log(id_dish);
      console.log(query);
      sequelize.query(query, { replacements: [id_dish] })
        .then((data) => {
          console.log(data);
          res.status(404).json({ status: 'Dish delete' });
        })
        .catch((e) => console.log('Something went wrong ...', e));
    }
  );
//Change dish data
  app.put('/dishes', middlewares.validateToken, middlewares.validateAdmin, middlewares.dishExist,
    (req, res) => {
      const { id_dish }= req.body;
      const query = 'UPDATE dishes SET dish = ?, price = ? WHERE id_dish = ?';
      const { dish, price } = req.body;
      sequelize.query(query, { replacements: [dish, price, id_dish] })
        .then((response) => {
          res.json({ status: 'Dish update successful' });
        })
        .catch((e) => console.error(e));
    }
  );
//registra cuenta de usuario
app.post('/users', middlewares.existingUser, (req, res) => {

    const query = 'INSERT INTO users (username, email, name, phone, password, address, code_rol) VALUES (?, ?, ?, ?, ?, ?, 1)';

    const { username, email, name, phone, password, address } = req.body;

    sequelize.query(query, { replacements: [username, email, name, phone, password, address] })
        .then((response) => {

            res.json({ status: 'User created', users: req.body });

        }).catch((e) => console.error(e));

});


//ORDERS
//Add new order
app.post('/orders', middlewares.validateToken, middlewares.validatePaymethod, middlewares.insertNew, middlewares.insertDishes,
  (req, res) => {
    res.json({ status: 'Order created', order: req.body });
  }
);
//change status of order
app.put('/orders', middlewares.validateToken, middlewares.validateAdmin, middlewares.orderExist, middlewares.validateStatus,
  (req, res) => {
    const { id_O } = req.body;
    const query = 'UPDATE orders SET code_status = ? WHERE id_O = ?';
    const { code_status } = req.body;
    sequelize.query(query, { replacements: [code_status, id_O] })
      .then((data) => {
        res.json({ status: 'Order status update successful' });
      })
      .catch((e) => console.log(e));
  }
);

app.get('/orders', middlewares.validateToken, middlewares.validateAdmin, (req, res) => {
  const orders =
    "SELECT status.state, orders.hour, orders.id_O, GROUP_CONCAT(dishes.dish SEPARATOR ', ') AS description, pay.method, SUM(dishes.price) AS total, users.name, users.address FROM orders orders JOIN status status ON orders.code_status = status.id JOIN users users ON orders.id_user= users.id JOIN pay_methods pay ON orders.id_paymethod = pay.id JOIN orders_description orders_description ON orders.id_O = orders_description.id_order JOIN dishes dishes ON orders_description.id_dishes = dishes.id_dish GROUP BY orders.id_O";
  sequelize.query(orders, { type: Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.json(data);
      console.log(data);
    })
    .catch((e) => console.log(e));
});

//get the orders of user and the total list for admin
app.get('/myOrders', middlewares.validateToken, (req, res) => {
  const { id, code_rol } = req.body;
  console.log(code_rol);
  console.log(id);
  if (code_rol === 2) {
    res.redirect('/orders/');
  }
  const orders =
    "SELECT  status.state, orders.hour, orders.id_O, GROUP_CONCAT(dishes.dish SEPARATOR ', ') AS description, pay.method,SUM(dishes.price) AS total, users.name, users.address FROM orders orders JOIN status status ON orders.code_status = status.id JOIN users users ON orders.id_user= users.id JOIN pay_methods pay ON orders.id_paymethod = pay.id JOIN orders_description orders_description ON orders.id_O = orders_description.id_order JOIN dishes dishes ON orders_description.id_dishes = dishes.id_dish WHERE users.id = ? GROUP BY orders.id_O";
  sequelize
    .query(orders, { replacements: [id] })
    .then((data) => {
      res.json(data[0]);
      console.log(id_O);

    })
    .catch((e) => console.log(e));

});

//configuración del puerto
app.listen(3000, () => {
    console.log('Servidor iniciado por el puerto 3000');
})