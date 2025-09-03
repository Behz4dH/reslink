import DatabaseService from '../services/databaseService';

async function updateUserLinkedIn() {
  try {
    console.log('🔗 Updating user LinkedIn URL...');

    // Update user with ID 1 (the user with the reslink)
    await DatabaseService.executeCommand(
      'UPDATE users SET linkedin_url = ? WHERE id = ?',
      ['https://www.linkedin.com/in/testuser', 1]
    );

    console.log('✅ Updated user LinkedIn URL');
    
    // Verify the update
    const user = await DatabaseService.executeQuerySingle(
      'SELECT id, username, linkedin_url FROM users WHERE id = 1'
    );
    console.log('Updated user:', user);

  } catch (error) {
    console.error('❌ Failed to update LinkedIn URL:', error);
    throw error;
  }
}

// CLI interface - run if called directly
async function main() {
  try {
    await updateUserLinkedIn();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default updateUserLinkedIn;