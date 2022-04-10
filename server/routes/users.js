
const router = require('express').Router();
const { check, validationResult } = require('express-validator');
var uuid = require('uuid');

const { Model, Sequelize, DataTypes } = require('sequelize');

const User = require('../models/User');

// router.get('/get', async (req, res) => {
//   try {
//     let squares = await Square.findAll({
//       // limit: 72,
//       // order: [['createdAt', 'ASC']]
//     });
//     res.json(squares);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

router.get('/find/:id', async (req, res) => {
  try {
    let user = await User.findAll({
      where: {
        id: req.params.id
      }
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/add', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);

  try {
    const newUser = new User({
      id: req.body.id,
      pin: req.body.pin,
      placed: req.body.placed
    });

    const user = await newUser.save();

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// router.put('/update', async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { id, x, y, color, changed } = req.body;
//   const updatedAt = new Date();
//   try {
//     const square = Square.update({ x, y, color, changed, updatedAt }, { where: { id } });
//     return res.json(square);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server error');
//   }
// });

// router.put('/', async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { id, title, body } = req.body;
//   try {
//     const square = Square.update({ title, body }, { where: { id } });
//     // console.log(square);
//     return res.json(square);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server error');
//   }
// });

// router.delete('/:id', async (req, res) => {
//   const id = req.params.id;
//   // console.log(id);
//   try {
//     const square = Square.destroy({ where: { id } });
//     console.log(square);
//     res.status(200).json(JSON.stringify(square));
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error');
//   }
// });

getCurrentDatetime = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = router;