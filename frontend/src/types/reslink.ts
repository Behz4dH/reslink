export interface Reslink {
  id: string;
  title: string; // e.g., "Amy Jones - Product Manager - Meta"
  name: string;
  position: string;
  company: string;
  createdDate: string;
  videoUrl: string; // Local path for now, later Google Drive
  resumeUrl: string; // Local path for now, later Google Drive
  status: 'active' | 'draft' | 'completed';
}

export const mockReslinks: Reslink[] = [
  {
    id: '1',
    title: 'Amy Jones - Product Manager - Meta',
    name: 'Amy Jones',
    position: 'Product Manager',
    company: 'Meta',
    createdDate: '2024-01-15',
    videoUrl: '/videos/amy-jones-meta-pitch.mp4',
    resumeUrl: '/resumes/amy-jones-resume.pdf',
    status: 'completed'
  },
  {
    id: '2',
    title: 'John Smith - Software Engineer - Google',
    name: 'John Smith',
    position: 'Software Engineer',
    company: 'Google',
    createdDate: '2024-01-20',
    videoUrl: '/videos/john-smith-google-pitch.mp4',
    resumeUrl: '/resumes/john-smith-resume.pdf',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Sarah Wilson - UX Designer - Apple',
    name: 'Sarah Wilson',
    position: 'UX Designer',
    company: 'Apple',
    createdDate: '2024-02-01',
    videoUrl: '/videos/sarah-wilson-apple-pitch.mp4',
    resumeUrl: '/resumes/sarah-wilson-resume.pdf',
    status: 'active'
  },
  {
    id: '4',
    title: 'Michael Chen - Data Scientist - Netflix',
    name: 'Michael Chen',
    position: 'Data Scientist',
    company: 'Netflix',
    createdDate: '2024-02-05',
    videoUrl: '',
    resumeUrl: '/resumes/michael-chen-resume.pdf',
    status: 'draft'
  },
  {
    id: '5',
    title: 'Jessica Martinez - Marketing Manager - Spotify',
    name: 'Jessica Martinez',
    position: 'Marketing Manager',
    company: 'Spotify',
    createdDate: '2024-02-10',
    videoUrl: '/videos/jessica-martinez-spotify-pitch.mp4',
    resumeUrl: '/resumes/jessica-martinez-resume.pdf',
    status: 'completed'
  },
  {
    id: '6',
    title: 'David Kim - DevOps Engineer - Amazon',
    name: 'David Kim',
    position: 'DevOps Engineer',
    company: 'Amazon',
    createdDate: '2024-02-15',
    videoUrl: '/videos/david-kim-amazon-pitch.mp4',
    resumeUrl: '/resumes/david-kim-resume.pdf',
    status: 'active'
  },
  {
    id: '7',
    title: 'Lisa Thompson - Frontend Developer - Microsoft',
    name: 'Lisa Thompson',
    position: 'Frontend Developer',
    company: 'Microsoft',
    createdDate: '2024-02-18',
    videoUrl: '',
    resumeUrl: '/resumes/lisa-thompson-resume.pdf',
    status: 'draft'
  },
  {
    id: '8',
    title: 'Robert Garcia - Project Manager - Tesla',
    name: 'Robert Garcia',
    position: 'Project Manager',
    company: 'Tesla',
    createdDate: '2024-02-20',
    videoUrl: '/videos/robert-garcia-tesla-pitch.mp4',
    resumeUrl: '/resumes/robert-garcia-resume.pdf',
    status: 'completed'
  },
  {
    id: '9',
    title: 'Emily Davis - Product Designer - Airbnb',
    name: 'Emily Davis',
    position: 'Product Designer',
    company: 'Airbnb',
    createdDate: '2024-02-22',
    videoUrl: '/videos/emily-davis-airbnb-pitch.mp4',
    resumeUrl: '/resumes/emily-davis-resume.pdf',
    status: 'active'
  },
  {
    id: '10',
    title: 'Carlos Rodriguez - Backend Developer - Uber',
    name: 'Carlos Rodriguez',
    position: 'Backend Developer',
    company: 'Uber',
    createdDate: '2024-02-25',
    videoUrl: '',
    resumeUrl: '/resumes/carlos-rodriguez-resume.pdf',
    status: 'draft'
  },
  {
    id: '11',
    title: 'Amanda Lee - Business Analyst - Salesforce',
    name: 'Amanda Lee',
    position: 'Business Analyst',
    company: 'Salesforce',
    createdDate: '2024-03-01',
    videoUrl: '/videos/amanda-lee-salesforce-pitch.mp4',
    resumeUrl: '/resumes/amanda-lee-resume.pdf',
    status: 'completed'
  },
  {
    id: '12',
    title: 'James Wilson - Full Stack Developer - Stripe',
    name: 'James Wilson',
    position: 'Full Stack Developer',
    company: 'Stripe',
    createdDate: '2024-03-03',
    videoUrl: '/videos/james-wilson-stripe-pitch.mp4',
    resumeUrl: '/resumes/james-wilson-resume.pdf',
    status: 'active'
  }
];