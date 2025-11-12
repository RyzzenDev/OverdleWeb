// Use 'https' para fazer requisições (já vem com o Node.js)
const https = require('https');
// Use 'fs' (File System) para salvar arquivos (já vem com o Node.js)
const fs = require('fs');
// Use 'path' para gerenciar caminhos de arquivos (já vem com o Node.js)
const path = require('path');

// --- [ PASSO 1: COLE SEU JSON AQUI ] ---
// Cole todo o seu JSON de heróis dentro destes colchetes [ ]
const heroes = [
  // O colchete extra [ que estava aqui foi REMOVIDO
  {
    "id": 1,
    "heroName": "D.va",
    "heroPortrait": "https://tinyurl.com/yc6w8yxf"
  },
  {
    "id": 2,
    "heroName": "Doomfist",
    "heroPortrait": "https://tinyurl.com/4yer2dmm"
  },
  {
    "id": 3,
    "heroName": "Hazard",
    "heroPortrait": "https://tinyurl.com/5d9bmd5e"
  },
  {
    "id": 4,
    "heroName": "Junker Queen",
    "heroPortrait": "https://tinyurl.com/3kdv9dxx"
  },
  {
    "id": 5,
    "heroName": "Mauga",
    "heroPortrait": "https://tinyurl.com/3zet3vzc"
  },
  {
    "id": 6,
    "heroName": "Orisa",
    "heroPortrait": "https://tinyurl.com/3kn3zywy"
  },
  {
    "id": 7,
    "heroName": "Ramattra",
    "heroPortrait": "https://tinyurl.com/23asdnnv"
  },
  {
    "id": 8,
    "heroName": "Reinhardt",
    "heroPortrait": "https://tinyurl.com/3yf84755"
  },
  {
    "id": 9,
    "heroName": "Roadhog",
    "heroPortrait": "https://tinyurl.com/4b7h9xz4"
  },
  {
    "id": 10,
    "heroName": "Sigma",
    "heroPortrait": "https://tinyurl.com/3f5972ef"
  },
  {
    "id": 11,
    "heroName": "Winston",
    "heroPortrait": "https://tinyurl.com/bddxtjxt"
  },
  {
    "id": 12,
    "heroName": "Wrecking Ball",
    "heroPortrait": "https://tinyurl.com/my7ky2kk"
  },
  {
    "id": 13,
    "heroName": "Zarya",
    "heroPortrait": "https://tinyurl.com/4dbu4mc3"
  },
  {
    "id": 14,
    "heroName": "Ashe",
    "heroPortrait": "https://tinyurl.com/5ezvxkdw"
  },
  {
    "id": 15,
    "heroName": "Bastion",
    "heroPortrait": "https://tinyurl.com/jecpcnhj"
  },
  {
    "id": 16,
    "heroName": "Cassidy",
    "heroPortrait": "https://tinyurl.com/3f9wy4r5"
  },
  {
    "id": 17,
    "heroName": "Echo",
    "heroPortrait": "https://tinyurl.com/yc7fxb4k"
  },
  {
    "id": 18,
    "heroName": "Freja",
    "heroPortrait": "https://tinyurl.com/4pnk47hk"
  },
  {
    "id": 19,
    "heroName": "Genji",
    "heroPortrait": "https://tinyurl.com/yhn3pwdm"
  },
  {
    "id": 20,
    "heroName": "Hanzo",
    "heroPortrait": "https://tinyurl.com/9d6umay"
  },
  {
    "id": 21,
    "heroName": "Junkrat",
    "heroPortrait": "https://tinyurl.com/95zff58x"
  },
  {
    "id": 22,
    "heroName": "Mei",
    "heroPortrait": "https://tinyurl.com/3rfrb56k"
  },
  {
    "id": 23,
    "heroName": "Pharah",
    "heroPortrait": "https://tinyurl.com/mr3uudhz"
  },
  {
    "id": 24,
    "heroName": "Reaper",
    "heroPortrait": "https://tinyurl.com/4fj256uk"
  },
  {
    "id": 25,
    "heroName": "Sojourn",
    "heroPortrait": "https://tinyurl.com/3nt7vw9t"
  },
  {
    "id": 26,
    "heroName": "Soldier 76",
    "heroPortrait": "https://tinyurl.com/5mbt2h5y"
  },
  {
    "id": 27,
    "heroName": "Sombra",
    "heroPortrait": "https://tinyurl.com/55rep5uf"
  },
  {
    "id": 28,
    "heroName": "Symmetra",
    "heroPortrait": "https://tinyurl.com/mpbuunun"
  },
  {
    "id": 29,
    "heroName": "Torbjörn",
    "heroPortrait": "https://tinyurl.com/2zce55dn"
  },
  {
    "id": 30,
    "heroName": "Tracer",
    "heroPortrait": "https://tinyurl.com/3zswyh4e"
  },
  {
    "id": 31,
    "heroName": "Venture",
    "heroPortrait": "https://tinyurl.com/m868bpnx"
  },
  {
    "id": 32,
    "heroName": "Widowmaker",
    "heroPortrait": "https://tinyurl.com/4exks3kb"
  },
  {
    "id": 33,
    "heroName": "Ana",
    "heroPortrait": "https://tinyurl.com/2z54pwfm"
  },
  {
    "id": 34,
    "heroName": "Baptiste",
    "heroPortrait": "https://tinyurl.com/yumfwrh4"
  },
  {
    "id": 35,
    "heroName": "Brigitte",
    "heroPortrait": "https://tinyurl.com/4ahmbpd2"
  },
  {
    "id": 36,
    "heroName": "Illari",
    "heroPortrait": "https://tinyurl.com/54hzmprf"
  },
  {
    "id": 37,
    "heroName": "Juno",
    "heroPortrait": "https://tinyurl.com/mr48njws"
  },
  {
    "id": 38,
    "heroName": "Kiriko",
    "heroPortrait": "https://tinyurl.com/33cxh7jb"
  },
  {
    "id": 39,
    "heroName": "Lifeweaver",
    "heroPortrait": "https://tinyurl.com/2xra526n"
  },
  {
    "id": 40,
    "heroName": "Lucio",
    "heroPortrait": "https://tinyurl.com/58m384ud"
  },
  {
    "id": 41,
    "heroName": "Mercy",
    "heroPortrait": "https://tinyurl.com/27znmyt9"
  },
  {
    "id": 42,
    "heroName": "Moira",
    "heroPortrait": "https://tinyurl.com/35p85vzf"
  },
  {
    "id": 43,
    "heroName": "Wuyang",
    "heroPortrait": "https://tinyurl.com/3uvhr6dy"
  },
  {
    "id": 44,
    "heroName": "Zenyatta",
    "heroPortrait": "https://tinyurl.com/3byn8t8p"
  }
  // O colchete extra ] que estava aqui foi REMOVIDO
];
// -----------------------------------------


// --- [ PASSO 2: DEFINA ONDE SALVAR ] ---
// Vamos salvar na pasta 'public/images/portraits'
// O 'path.join' garante que funcione em qualquer S.O.
const outputDir = path.join(__dirname, 'public', 'images', 'portraits');

// Cria as pastas se elas não existirem
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Pasta criada: ${outputDir}`);
}

// Função para "limpar" o nome do arquivo (ex: "D.va" -> "dva")
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\./g, '') // Remove pontos (D.va)
    .replace(/ /g, '-') // Troca espaços por hífens (Junker Queen)
    .replace(/[^a-z0-9-]/g, ''); // Remove caracteres especiais
}

// Função que baixa UMA imagem
function downloadImage(url, heroName) {
  // O 'https.get' segue redirecionamentos (como do tinyurl) automaticamente
  https.get(url, (response) => {
    // Verifica se a resposta foi bem-sucedida (código 200-299)
    if (response.statusCode < 200 || response.statusCode > 299) {
      // Se for um redirecionamento (301, 302), o 'https.get' deve tratar,
      // mas se for outro código (ex: 404, 500), registramos o erro.
      // O 'tinyurl' pode redirecionar para um 'location'
      if (response.headers.location) {
        // console.log(`Redirecionando ${heroName} para: ${response.headers.location}`);
        // Tenta baixar do novo local
        downloadImage(response.headers.location, heroName);
      } else {
        console.error(`[ERRO] Falha ao baixar ${heroName}. Status: ${response.statusCode}`);
      }
      return; // Sai da função
    }

    // Pega a extensão do arquivo pelo 'Content-Type' (ex: image/png)
    const contentType = response.headers['content-type'];
    let extension = '.jpg'; // Padrão
    if (contentType && contentType.includes('png')) extension = '.png';
    if (contentType && contentType.includes('jpeg')) extension = '.jpeg';
    if (contentType && contentType.includes('gif')) extension = '.gif';
    if (contentType && contentType.includes('svg')) extension = '.svg';

    // Limpa o nome do herói para usar como nome do arquivo
    const fileName = slugify(heroName) + extension;
    const filePath = path.join(outputDir, fileName);

    // Cria um "stream" para salvar o arquivo
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`[SUCESSO] Baixado: ${heroName} -> ${fileName}`);
    });

    fileStream.on('error', (err) => {
      console.error(`[ERRO NO ARQUIVO] Falha ao salvar ${fileName}: ${err.message}`);
    });

  }).on('error', (err) => {
    console.error(`[ERRO NA REQUISIÇÃO] Falha ao baixar ${heroName}: ${err.message}`);
  });
}

// --- [ PASSO 3: RODAR O SCRIPT ] ---
console.log(`Iniciando download de ${heroes.length} imagens...`);
console.log(`Salvando em: ${outputDir}\n`);

heroes.forEach(hero => {
  if (hero.heroPortrait && hero.heroName) {
    downloadImage(hero.heroPortrait, hero.heroName);
  } else {
    console.warn('[AVISO] Item JSON ignorado por falta de "heroPortrait" ou "heroName":', hero);
  }
});