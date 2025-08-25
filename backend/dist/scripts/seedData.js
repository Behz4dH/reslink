"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reslinkModel_1 = __importDefault(require("../models/reslinkModel"));
async function seedData() {
    const reslinkModel = new reslinkModel_1.default();
    const sampleReslinks = [
        {
            title: 'Amy Jones - Product Manager - Meta',
            name: 'Amy Jones',
            position: 'Product Manager',
            company: 'Meta',
            video_url: '/videos/amy-jones-meta-pitch.mp4',
            resume_url: '/resumes/amy-jones-resume.pdf',
            status: 'published'
        },
        {
            title: 'John Smith - Software Engineer - Google',
            name: 'John Smith',
            position: 'Software Engineer',
            company: 'Google',
            video_url: '/videos/john-smith-google-pitch.mp4',
            resume_url: '/resumes/john-smith-resume.pdf',
            status: 'viewed'
        },
        {
            title: 'Sarah Wilson - UX Designer - Apple',
            name: 'Sarah Wilson',
            position: 'UX Designer',
            company: 'Apple',
            video_url: '/videos/sarah-wilson-apple-pitch.mp4',
            resume_url: '/resumes/sarah-wilson-resume.pdf',
            status: 'multiple_views'
        },
        {
            title: 'Michael Chen - Data Scientist - Netflix',
            name: 'Michael Chen',
            position: 'Data Scientist',
            company: 'Netflix',
            video_url: '',
            resume_url: '/resumes/michael-chen-resume.pdf',
            status: 'draft'
        }
    ];
    try {
        console.log('Seeding database with sample data...');
        for (const reslink of sampleReslinks) {
            const created = await reslinkModel.create(reslink);
            console.log(`Created reslink: ${created.title}`);
        }
        console.log('Database seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
}
seedData();
//# sourceMappingURL=seedData.js.map