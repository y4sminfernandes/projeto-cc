const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const pool = new Pool({
connectionString: 'postgresql://postgres.zswimtruiwtwrqxadmnl:Coolmida1234@aws-0-sa-east-1.pooler.supabase.com:5432/postgres',

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

app.post('/api/restaurantes', async (req, res) => {
  const { nome, cnpj, telefone, celular, email_comercial, confirm_email, senha, confirm_senha } = req.body;

  if (email_comercial !== confirm_email) {
    return res.status(400).send("Os e-mails estão diferentes");
  }

 if (senha !== confirm_senha) {
    return res.status(400).send("As senhas estão diferentes");
  }
  if (!nome || !cnpj || !telefone || !celular || !email_comercial || !senha) {
  return res.status(400).send("Todos os campos precisam ser preenchidos");
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
  console.log(req.body); 
});

app.post('/api/usuarios', async (req, res) => {
  const {
    nome,
    sobrenome,
    dt_nascimento,
    celular,
    email,
    confirm_email,
    senha,
    confirmar_senha,
    genero
  } = req.body;

  if (email !== confirm_email) {
    return res.status(400).send("Os e-mails estão diferentes");
  }

  if (senha !== confirmar_senha) {
    return res.status(400).send("As senhas estão diferentes");
  }

  const client = await getConnection();

  if (client) {
    try {
      const query = `
        INSERT INTO usuarios (nome, dt_nascimento, genero, celular, email, senha)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const nomeCompleto = `${nome} ${sobrenome}`;
      const values = [nomeCompleto, dt_nascimento, genero, celular, email, senha];

      await client.query(query, values);
      res.status(201).send("Usuário cadastrado");
    } catch (err) {
      console.error('erro ao inserir :', err);
      res.status(500).send('erro no cadastro');
    } finally {
      client.release();
    }
  } else {
    res.status(500).send('erro conexão com o banco');
  }
});

app.get('/api/usuarios', async (req, res) => {
  const client = await getConnection();

  if (client) {
    try {
      const result = await client.query('SELECT * FROM usuarios');
      if (result.rows.length === 0) {
        return res.status(404).send('Nenhum usuário encontrado');
      }
      res.json(result.rows);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro ao buscar usuários');
    } finally {
      client.release();
    }
  } else {
    res.status(500).send('Erro na conexão com o banco');
  }
});
app.get('/api/login-restaurante', async (req, res) => {
  const {email, senha} = req.query;

  const client = await getConnection();
  if (client){
    try{ const query = 'SELECT * FROM restaurantes WHERE email_comercial = $1 and senha = $2';
        const values = [email, senha];
        const result = await client.query(query, values);
  if (result.rows.length === 0){
    return res.status(401).send("E-mail ou senha errados");
  }
  res.status(200).send("Sucesso no login do restaurante");
  }catch(err){
      console.error('Erro no login do restaurante:', err);
      res.status(500).send('Erro no login do restaurante');
    }finally{
      client.release();
    }
  }else{
    res.status(500).send('Erro de conexão banco');
  }
});
