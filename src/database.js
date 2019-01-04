const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notas-db-app', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(db => console.log('DB esta conectado'))
    .catch(error => console.error(error));