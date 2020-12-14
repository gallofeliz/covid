var proxy = require('express-http-proxy');
var app = require('express')();

app.get('/', (req, res) => {
    res.redirect('/deplacement-covid-19/');
})

app.get('/deplacement-covid-19/', proxy('https://media.interieur.gouv.fr/deplacement-covid-19/', {
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        const script = `<script>
            const keys = ['firstname', 'lastname', 'birthday', 'placeofbirth', 'address', 'city', 'zipcode'];

            document.querySelector('#generate-btn').addEventListener('click', () => {
                const o = keys.reduce((o, key) => Object.assign(o, {[key]: document.querySelector('[name=' + key + ']').value }), {});
                localStorage.setItem('o', JSON.stringify(o));
            });

            const o = localStorage.getItem('o') ? JSON.parse(localStorage.getItem('o')) : {};

            Object.keys(o).forEach(key => {
                 document.querySelector('[name=' + key + ']').value = o[key];
            });

            const now = new Date;
            document.querySelector('[name=heuresortie]').value = ('0' + now.getHours()).substr(-2, 2) + ':' + ('0' + now.getMinutes()).substr(-2, 2)

        </script>`;


        return proxyResData.toString().replace('</body>', script + '</body>');
  }
}));

app.use('/', proxy('https://media.interieur.gouv.fr'));

app.listen(8080, () => {
    console.log('Cool Cool Cool')
})
