export default (express, bodyParser, fs, crypto, http, mongodb, path, cors) => {
  const app = express()
  const author = 'glazkopolina'

  const __dirname = path.resolve();
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'public'));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.json());
  app.use(express.urlencoded());

  app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

      next()
  })
  
  app.use(cors());
  app.options('*', cors());
  
  app.get('/login/', (req, res) => {
      res.send(author)
  })

  app.get('/code/', (req, res) => {
      let filePath = import.meta.url.replace(/^file:\/+/, '')

      if (! filePath.includes(':')) {
          filePath = `/${filePath}`
      }

      createReadStream(filePath).pipe(res)
  })

  app.get('/sha1/:input', ({ params }, res) => {
      const { input } = params

      const hash = crypto.createHash('sha1').update(input).digest('hex')

      res.send(hash);
  })
  
    app.get('/req/', ({ query }, res) => {
        const { addr } = query

        http.get(addr, httpRes => {
            httpRes.setEncoding('utf8')

            let data = ''

            httpRes.on('data', chunk => { data += chunk })

            httpRes.on('end', () => {
                res.send(data)
            })
        })
    })
    
    app.get('/wordpress/wp-json/wp/v2/posts/1', (req, res) => res.status(200).json({title: {id: 1, rendered: "glazkopolina"}}))
    app.get('/wordpress/', (req, res) => res.status(200).render('wordpress'))
  
    app.post('/render/', (req, res) => {
        const {random2, random3} = req.body;


        let { addr } = req.query;

        console.log(addr);

        res.render('random', {random2: random2, random3: random3,});
      
    })
    
    app.post('/req/', ({ body }, res) => {
        const { addr } = body

        http.get(addr, httpRes => {
            httpRes.setEncoding('utf8')

            let data = ''

            httpRes.on('data', chunk => { data += chunk })

            httpRes.on('end', () => {
                res.send(data)
            })
        })
    })
  
    app.post('/insert/', async ({ body }, res) => {
        const { login, password, URL  } = body

        const UserSchema = mongo.Schema({
            login: String,
            password: String,
        })

        const User = mongo.model('User', UserSchema)

        const connection = await mongo.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })

        const user = new User({ login, password })
        
        user.save((e) => {
            connection.disconnect()

            if (e) {
                return res.send(e.message)
            }

            return res.send(user)
        })
    })
    
    app.all('*', (req, res) => {
        res.send(author)
    })

    return app
}
