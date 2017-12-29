webpack config:
     entry: {
            admin: path.join(__dirname, 'Admin/client/index.js'),
            bundle: path.join(__dirname, 'client/index.js')
        },

        output: {
            path: '/',
            publicPath: '/',
            filename: '[name].js'
        }


server/index.js:

    import adminRoute from '../Admin/server/routes/admin';
    app.use(express.static(config.uploads.destination));
    app.use('/admin', adminRoute);


    Models: define in config file models array

    import sessionStore from './common/sessionStore';
    import session from 'express-session';

    app.use(session({
            secret: config.session.secret,
            saveUninitialized: false,
            resave: true,
            key: config.session.key,
            cookie: config.session.cookie,
            store: sessionStore
        }));

models/index.js:

    import mongoose from 'mongoose';
    import models from '../data/products';

    const ProductModel = () => {
        return new mongoose.Schema({
            title: String,
            description: String,
            category: String,
            price: {
                type: Number,
                default: 0
            },
            discount: {
                type: Number,
                default: 0
            },
            imagePath: {
                type: String,
                default: ''
            }
        });
    };

    export default [{ name: 'Все', title: 'all' }].concat(models.map(item => { return { ...item, model: mongoose.model(item.title, new ProductModel()) } }))


../data/products:

    export default [
        {
            name: 'Альбомы',
            title: 'album'
        },
        {
            name: 'Рамки',
            title: 'frame'
        },
        {
            name: 'Сувенирная продукция',
            title: 'souvenir'
        },
        {
            name: 'Дизайнерские изделия',
            title: 'design'
        },
        {
            name: 'Элементы питания',
            title: 'battery'
        },
        {
            name: 'Накопители информации',
            title: 'flash'
        }
    ];
