module.exports = function (app) {
   app.get('/', function (req, res) {
      res.render('index', { title: 'Not So Super Smash Bros' });
   });
}
