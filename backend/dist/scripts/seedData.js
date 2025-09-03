"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReslinkRepository_1 = require("../repositories/ReslinkRepository");
const initializeDatabase_1 = __importDefault(require("./initializeDatabase"));
async function seedData() {
    try {
        console.log('🌱 Starting database seeding...');
        // Ensure database is initialized first
        console.log('🔧 Checking database initialization...');
        await initializeDatabase_1.default.initializeDatabase();
        const sampleReslinks = [
            {
                title: 'Amy Jones - Product Manager - Meta',
                name: 'Amy Jones',
                position: 'Product Manager',
                company: 'Meta',
                video_url: '/videos/amy-jones-meta-pitch.mp4',
                resume_url: '/resumes/amy-jones-resume.pdf',
                status: 'published',
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
                status: 'viewed',
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
                status: 'multiple_views',
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
                status: 'draft',
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
                status: 'published',
                view_count: 0,
                last_viewed: null,
                unique_id: Math.random().toString(36).substring(2, 10),
                user_id: 1
            }
        ];
        console.log(`📦 Seeding ${sampleReslinks.length} sample reslinks...`);
        for (const reslink of sampleReslinks) {
            const created = await ReslinkRepository_1.reslinkRepository.create(reslink);
            console.log(`✅ Created reslink: ${created.title} (ID: ${created.unique_id})`);
        }
        // Show final stats
        console.log('📊 Seeding completed! Final stats:');
        const allReslinks = await ReslinkRepository_1.reslinkRepository.findMany({ limit: 100 });
        console.log(`   Total reslinks: ${allReslinks.data.length}`);
        const statusCounts = await ReslinkRepository_1.reslinkRepository.getStatusCounts();
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`   ${status}: ${count}`);
        });
        console.log('🎉 Database seeded successfully!');
    }
    catch (error) {
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
exports.default = seedData;
//# sourceMappingURL=seedData.js.map