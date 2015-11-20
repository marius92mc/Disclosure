/**
 * GainController
 *
 * @description :: Server-side logic for managing gains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		var id = req.param('id');
		var amount = req.param('amount');

		User.findOne({id: id}).exec(function(error, user) {
			if(error)
				console.log(error);
			user.budget += amount;
			user.save(function(err, user) {
					res.send(user);
			});

		});
	}
};
