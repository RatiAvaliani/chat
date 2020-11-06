class homeController {
    init (req, res) {
        res.render('home');
    }
}

module.exports = new homeController();