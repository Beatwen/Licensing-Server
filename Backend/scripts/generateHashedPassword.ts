import bcrypt from 'bcrypt';

const generateHashedPassword = async (password: string): Promise<void> => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('===== MOT DE PASSE HASHÉ =====');
    console.log(hashedPassword);
    console.log('==============================');
    
    console.log('Utilisez cette requête SQL pour créer un admin :');
    console.log(`
INSERT INTO users (
  "email", 
  "password", 
  "firstName",
  "lastName",
  "userName",
  "emailConfirmed",
  "createdAt",
  "updatedAt",
  "isAdmin"
) VALUES (
  'admin@example.com',
  '${hashedPassword}',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW(),
  true
);
    `);
  } catch (error) {
    console.error('Erreur lors de la génération du hash :', error);
  }
};

// Changez ce mot de passe pour celui que vous souhaitez utiliser
const passwordToHash = 'admin123';

generateHashedPassword(passwordToHash); 