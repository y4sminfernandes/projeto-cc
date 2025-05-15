const port = 3000;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Coolmida1234@db.zswimtruiwtwrqxadmnl.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function getConnection() {
  try {
    const client = await pool.connect();
    console.log('Conectado ao PostgreSQL');
    return client;
  } catch (err) {
    console.error('Erro na conexão:', err);
    return null;
  }
}

app.get('/test', async (req, res) => {
  const client = await getConnection();
  if (client) {
    res.send('Conectado no PostgreSQL');
    client.release();
  } else {
    res.status(500).send('Erro na conexão');
  }
});

app.get('/api/restaurantes', async (req, res) => {
  const client = await getConnection();
  if (client) {
    try {
      const result = await client.query('SELECT * FROM restaurantes');
      console.log('Dados de restaurantes:', result.rows);
      
      if (result.rows.length === 0) {
        return res.status(404).send('Nenhum restaurante encontrado');
      }
      
      res.json(result.rows);
    } catch (err) {
      console.error('Erro ao consultar o banco:', err);
      res.status(500).send('Erro na consulta dos restaurantes');
    } finally {
      client.release();
    }
  } else {
    res.status(500).send('Erro de conexão com o banco de dados');
  }
});
app.get('/', (req, res) => {
  console.log('Acessou rota ');
  res.send('Servidor rodando');
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
app.use(express.json());

app.post('/api/restaurantes', async (req, res) => {
  const { nome, cnpj, telefone, celular, email_comercial, confirm_email, senha, confirm_senha } = req.body;

  if (email_comercial !== confirm_email) {
    return res.status(400).send("Os e-mails estão diferentes");
  }

  if (senha !== confirm_senha) {
    return res.status(400).send("As senhas estão diferentes");
  }

  const client = await getConnection();

  if (client) {
    try {
      const query = `
        INSERT INTO restaurantes (nome, cnpj, telefone, celular, email_comercial, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [nome, cnpj, telefone, celular, email_comercial, senha];
      await client.query(query, values);
      res.status(201).send("Restaurante cadastrado");
    } catch (err) {
      console.error('Erro ao inserir no banco', err);
      res.status(500).send('Erro no cadastro do restaurante');
    } finally {
      client.release();
    }
  } else {
    res.status(500).send('erro na conexão com o banco');
  }
});
