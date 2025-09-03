import { reslinkRepository } from '../repositories/ReslinkRepository';
import DatabaseInitializer from './initializeDatabase';

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Ensure database is initialized first
    console.log('🔧 Checking database initialization...');
    await DatabaseInitializer.initializeDatabase();
    
    const sampleReslinks = [
      {
        title: 'Amy Jones - Product Manager - Meta',
        name: 'Amy Jones',
        position: 'Product Manager',
        company: 'Meta',
        video_url: '/videos/amy-jones-meta-pitch.mp4',
        resume_url: '/resumes/amy-jones-resume.pdf',
        status: 'published' as const,
        view_count: 0,
        last_viewed: null,
        unique_id: Math.random().toString(36).substring(2, 10),
        user_id: 1
      },
      {
        title: 'John Smith - Software Engineer - Google',
        name: 'John Smith',
        position: 'Software Engineer',
        company: 'Google',
        video_url: '/videos/john-smith-google-pitch.mp4',
        resume_url: '/resumes/john-smith-resume.pdf',
        status: 'viewed' as const,
        view_count: 3,
        last_viewed: null,
        unique_id: Math.random().toString(36).substring(2, 10),
        user_id: 1
      },
      {
        title: 'Sarah Wilson - UX Designer - Apple',
        name: 'Sarah Wilson',
        position: 'UX Designer',
        company: 'Apple',
        video_url: '/videos/sarah-wilson-apple-pitch.mp4',
        resume_url: '/resumes/sarah-wilson-resume.pdf',
        status: 'multiple_views' as const,
        view_count: 12,
        last_viewed: null,
        unique_id: Math.random().toString(36).substring(2, 10),
        user_id: 1
      },
      {
        title: 'Michael Chen - Data Scientist - Netflix',
        name: 'Michael Chen',
        position: 'Data Scientist',
        company: 'Netflix',
        video_url: '',
        resume_url: '/resumes/michael-chen-resume.pdf',
        status: 'draft' as const,
        view_count: 0,
        last_viewed: null,
        unique_id: Math.random().toString(36).substring(2, 10),
        user_id: 1
      },
      {
        title: 'Lisa Garcia - Frontend Developer - Spotify',
        name: 'Lisa Garcia',
        position: 'Frontend Developer',
        company: 'Spotify',
        video_url: '/videos/lisa-garcia-spotify-pitch.mp4',
        resume_url: '/resumes/lisa-garcia-resume.pdf',
        status: 'published' as const,
        view_count: 0,
        last_viewed: null,
        unique_id: Math.random().toString(36).substring(2, 10),
        user_id: 1
      }
    ];

    console.log(`📦 Seeding ${sampleReslinks.length} sample reslinks...`);
    
    for (const reslink of sampleReslinks) {
      const created = await reslinkRepository.create(reslink);
      console.log(`✅ Created reslink: ${created.title} (ID: ${created.unique_id})`);
    }
    
    // Show final stats
    console.log('📊 Seeding completed! Final stats:');
    const allReslinks = await reslinkRepository.findMany({ limit: 100 });
    console.log(`   Total reslinks: ${allReslinks.data.length}`);
    
    const statusCounts = await reslinkRepository.getStatusCounts();
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedData;