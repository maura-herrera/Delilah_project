const express= require('express');

const Sequelize= require('sequelize');
const sequelize= new Sequelize('mysql://root:@localhost:3306/delilah', {timezone: '-05:00',});
const jwt= require('jsonwebtoken');
const llave = '11AV3C1i3NT3';
const app= express();
app.use(express.json());


//middleware for username existing
const existingUser= (req, res, next)=> {
    const  {username}= req.body;
    const exist= 'SELECT * FROM users WHERE username= ?';
    sequelize.query(exist, {replacements:[username], type: Sequelize.QueryTypes.SELECT})
        .then ((data)=>{
            if (data.length){
                return res.status(404).json({error: 'Username no disponible'});
            }
            return next();

        })
        .catch ((e)=>{
            return res.status(400).json({error: 'Something went wrong...'});
        });
};


//middleware for user validation
const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token)
      return res.status(400).json({ error: 'Acceso denegado' });

    await jwt.verify(token, llave, (error, data) => {
     // console.log(data);

      if (error)
        return res.status(401).json({ error: 'Su token ha expirado' });
      req.body.id = data.id;
      req.body.code_rol = data.code_rol;
      next();
    });
  } catch (error) {
    res.status(400).json({ error:'Something went wrong...' });
  }
};

//middleware for admin authentication
const validateAdmin = (req, res, next) => {
  try {
    if ( req.body.code_rol !== 2)
      return res.status(401).json({ error: 'No tienes autorización' });
    next();
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong...' });
  }
};

//middlewares for dishes

const dishExist = (req, res, next) => {
  const { id_dish } = req.body;
  console.log(id_dish);
  const existDish = 'SELECT * FROM dishes WHERE id_dish = ?';
  console.log(existDish);
  sequelize.query(existDish, { replacements: [id_dish], type: Sequelize.QueryTypes.SELECT })
    .then((data) => {
      console.log(data);
      if (!data.length) {
        return res.status(404).json({ error: 'Dish is not register' });
      }
      return next();
    })
    .catch((e) => {
      return res.status(400).json({ error: 'Something went wrong...' });
    });
};

const dishRepeat = (req, res, next) => {
  const { dish } = req.body;
  const existDish = 'SELECT * FROM dishes WHERE dish = ?';
  sequelize.query(existDish, {
      replacements: [dish],
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      if (!data.length) {
        return next();
      }
      return res.status(404).json({ dish: 'Dish is already register' });
    })
    .catch((e) => {
      return res.status(400).json({ error: 'Something went wrong...' });
    });
};

//middlewares to order
const validatePaymethod = (req, res, next) => {
  const { id_paymethod } = req.body;
  if (id_paymethod > 0 && id_paymethod <= 4) {
    return next();
  }
  return res.status(404).json({ error: "This pay method doesn't exist" });
};

const insertNew = (req, res, next) => {
  const query =
    'INSERT INTO orders (code_status, id_user, id_paymethod) VALUES (1, ?, ?)';
  const { id } = req.body;
  const { id_paymethod } = req.body;
  sequelize
    .query(query, { replacements: [id, id_paymethod] })
    .then((data) => {
      console.log(data[0]);
      const id_order = data[0];
      req.id_order = id_order;
      console.log(req.id_order);
      next();
    })
    .catch((e) => console.log(e));
};

const insertDishes = (req, res, next) => {
 const { id_dishes } = req.body;

 for (i in id_dishes) {
    const query =
      'INSERT INTO orders_description (id_order, id_dishes) VALUES (?, ?)';
    
    sequelize.query(query, { replacements: [req.id_order, id_dishes[ i ]] })
      .then((data) => {
        console.log(data);
        next();
      })
      .catch((e) => console.log(e));
   }
};

const orderExist = (req, res, next) => {
  const { id_O } = req.body;
  const exist = 'SELECT * FROM orders WHERE id_O = ? ';
  sequelize
    .query(exist, { replacements: [id_O], type: sequelize.QueryTypes.SELECT })
    .then((data) => {
      if (!data.length) {
        return res.status(404).json({ error: "Order doesn't already exist" });
      }
      return next();
    })
    .catch((e) => {
      return res.status(500).json({ error: 'Something went wrong...', e });
    });
};
const validateStatus = (req, res, next) => {
  const { code_status } = req.body;
  if (code_status > 0 && code_status <= 6) {
    return next();
  }
  return res.status(404).json({ error: "This status doesn't exist" });
};

module.exports = {existingUser, validateToken, validateAdmin, dishExist, dishRepeat, validatePaymethod, insertNew, insertDishes, orderExist, validateStatus};
