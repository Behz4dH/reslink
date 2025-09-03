import AuthService from '../services/authService';
import DatabaseService from '../services/databaseService';

export async function seedUsers() {
  try {
    console.log('🌱 Seeding initial users...');

    // Check if users already exist
    const existingUsers = await DatabaseService.executeQuery('SELECT COUNT(*) as count FROM users');
    if (existingUsers.length > 0 && (existingUsers[0] as any).count > 0) {
      console.log('ℹ️  Users already exist, skipping seed');
      return;
    }

    // Create superuser
    const superuser = await AuthService.createUser({
      username: 'admin',
      email: 'admin@reslink.com',
      password: 'admin123', // Change in production!
      role: 'superuser'
    });
    console.log('✅ Created superuser:', superuser.username);

    // Create guest user
    const guestUser = await AuthService.createUser({
      username: 'guest',
      email: 'guest@reslink.com', 
      password: 'guest123', // Change in production!
      role: 'guest'
    });
    console.log('✅ Created guest user:', guestUser.username);

    console.log('🎉 User seeding completed!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('👑 Superuser: admin / admin123');
    console.log('👤 Guest: guest / guest123');
    console.log('');

  } catch (error) {
    console.error('❌ User seeding failed:', error);
    throw error;
  }
}

// CLI interface - run if called directly
async function main() {
  try {
    await seedUsers();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default seedUsers;