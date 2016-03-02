var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('./models');

 //console.log(models);

for(var m in models) {
    mongoose.model(m, new Schema(models[m]));
    //console.log(m)   user
}
module.exports = {
    getModel: function (type) {
        return _getModel(type);
    }
};
var _getModel = function (type) {
    return mongoose.model(type);
};