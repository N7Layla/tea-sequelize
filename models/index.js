'use strict'

const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/teas', { logging: false });

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal')
}, {
  // add more functionality to our Tea model here!
  getterMethods: {
    dollarPrice: function() {
      return '$' + this.price.toString()[0] + '.' + this.price.toString().slice(1)
    }
  }
})

Tea.findByCategory = (category) => {
  return Tea.findAll({
    where: {category}
  })
}

Tea.prototype.findSimilar = function() {
  return Tea.findAll({
    where: {category: this.category,
      id: {$not: this.id}}
  })
}

Tea.hook('beforeCreate', (tea) => {
  let arr = tea.title.split(' ')
   for (var i = 0; i < arr.length; i++){
      arr[i] = arr[i].split('');
      if (arr[i][0] !== undefined) {
         arr[i][0] = arr[i][0].toUpperCase();
      }
      arr[i] = arr[i].join('');
   }
   tea.title = arr.join(' ');
})

module.exports = { db, Tea };
