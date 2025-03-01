const db = require('../config/connection');
const { Inventory , Formulas, Glasses} = require('../models');
const inventorySeeds = require('./inventory.json');
const formulas = require('./formulas.js');
const glasses = require('./glass.json')
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Inventory', 'inventories');
    await cleanDB('Formulas','formulas');
    await cleanDB('Glasses','glasses')

    await Inventory.create(inventorySeeds);
    await Formulas.create(formulas);
    await Glasses.create(glasses);

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});