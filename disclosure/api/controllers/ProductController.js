/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Guid = require('guid');

module.exports = {
	new: function(req, res) {
		res.render('pages/add_product', {_layoutFile: '../shared/home_layout.ejs', user: req.user});
	},

	create: function(req, res) {
		console.log(req.body);
		Guid.create();
		var data = {
			id: Guid.raw(),
			name: req.body.name,
			picture: req.body.picture
		};

		Product.create(data).exec(function(error, model) {
			if(error)
				console.log(error);
			res.send(model);
		});
	},

	get: function(req, res) {
		Product.find().exec(function(error, models) {
			if(error)
				console.log(error);
			res.send(models);
		});
	},

	page: function(req, res) {
		var id = req.param('id');
		Product.findOne().where({id: id}).exec(function(error, model) {
			if(error)
				console.log(error);
			res.render('pages/product', {_layoutFile: '../shared/home_layout', user: req.user, product: model});
		});

	}
};
