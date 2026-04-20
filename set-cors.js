const MyStorage = require('@google-cloud/storage').Storage;

// Substitua pelo ID do seu projeto e o nome do seu bucket
const projectId = 'site-rosana-8a91e';
const bucketName = 'site-rosana-8a91e.appspot.com';

// Inicializa o Storage com a sua chave de serviço
const storage = new MyStorage({
  projectId: projectId,
  keyFilename: 'service-account.json', // O arquivo que você vai baixar
});

const corsConfiguration = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
    maxAgeSeconds: 3600,
  },
];

async function setCors() {
  try {
    await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
    console.log(`✅ Sucesso! O CORS foi configurado para o bucket: ${bucketName}`);
    console.log('Agora você já pode fazer uploads pelo navegador.');
  } catch (err) {
    console.error('❌ Erro ao configurar CORS:', err);
    console.log('\nVerifique se o arquivo service-account.json está na raiz e se o nome do bucket está correto.');
  }
}

setCors();
