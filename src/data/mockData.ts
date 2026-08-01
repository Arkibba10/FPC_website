import { Member, Event, GalleryItem, Alumni, ConvenerInfo, WebsiteSettings, UpdatePost } from '../types';

export const defaultMembers: Member[] = [
  {
    id: 'm1',
    name: 'Nayeem Murshed',
    position: 'President',
    batch: 'Batch 52',
    email: 'nayeem.murshed@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    quote: 'A frame is a sentence; leadership is the story we tell together.',
    bio: 'Guiding the Faculty of Computing Club with vision and integrity, ensuring every initiative reflects our shared passion for creativity and technology.',
    order: 1
  },
  {
    id: 'm2',
    name: 'Ripa Rani Biswas',
    position: 'Vice President',
    batch: 'Batch 53',
    email: 'ripa.biswas@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    quote: 'Every angle holds a perspective worth honoring.',
    bio: 'Supporting the president in steering club operations, bridging teams, and championing an inclusive, creative culture across the faculty.',
    order: 2
  },
  {
    id: 'm3',
    name: 'Tasnim Rahman',
    position: 'General Secretary',
    batch: 'Batch 54',
    email: 'tasnim.rahman@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    quote: 'Great memories are built on great organization.',
    bio: 'Keeping the club\u2019s rhythm \u2014 records, correspondence, and coordination \u2014 so every member\u2019s voice is heard and every plan comes alive.',
    order: 3
  },
  {
    id: 'm4',
    name: 'Sadia Afrin',
    position: 'Organizing Secretary',
    batch: 'Batch 55',
    email: 'sadia.afrin@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    quote: 'The best photographs come from carefully crafted moments.',
    bio: 'Turning ideas into well-run events \u2014 from concept to closing frame \u2014 with a sharp eye for detail and seamless execution.',
    order: 4
  },
  {
    id: 'm5',
    name: 'Sazzad Hossain',
    position: 'Head of Photography',
    batch: 'Batch 54',
    email: 'sazzad.hossain@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    quote: 'Chasing light, framing truth.',
    bio: 'Leading the photography wing \u2014 mentoring shooters, curating visual stories, and pushing the craft of the image forward.',
    order: 5
  },
  {
    id: 'm6',
    name: 'Rayhan Ahmed',
    position: 'Head of Videography',
    batch: 'Batch 55',
    email: 'rayhan.ahmed@cse.uap-bd.edu',
    facebook: 'https://facebook.com/fpc.uap',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    quote: 'Motion tells the stories stillness cannot.',
    bio: 'Directing the club\u2019s moving images \u2014 from documentaries to recaps \u2014 capturing the energy of campus life frame by frame.',
    order: 6
  }
];

export const defaultEvents: Event[] = [
  {
    id: 'e1',
    title: 'The View Finder — Season 7',
    date: 'February 15, 2024',
    description: 'The flagship annual photography carnival and gallery exhibition showcasing visual stories by CSE students.',
    coverImage: '/images/event1.jpg',
    images: [
      '/images/event1.jpg',
      '/images/gallery1.jpg',
      '/images/gallery2.jpg'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    location: 'UAP Plaza & Auditorium',
    details: 'The View Finder Season 7 is the premier annual exhibition of the Film & Photography Club. This year, the carnival displayed over 150 curated photographs and 8 short films. Renowned national photojournalists and visual artists conducted feedback sessions for our student photographers.',
    order: 1
  },
  {
    id: 'e2',
    title: 'Photography Workshop: Photo Adda',
    date: 'November 12, 2023',
    description: 'An interactive photography masterclass and feedback session on visual storytelling with industry professionals.',
    coverImage: '/images/event2.jpg',
    images: [
      '/images/event2.jpg',
      '/images/gallery3.jpg',
      '/images/gallery4.jpg'
    ],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    location: 'CSE Seminar Hall, UAP',
    details: 'Photo Adda brought professional photographers and students together for a day of sharing visual narratives. The workshop focused on lighting techniques, portfolio curation, and framing human emotions with minimal gear.',
    order: 2
  },
  {
    id: 'e3',
    title: '7th Photowalk: Dhaka',
    date: 'September 05, 2023',
    description: 'A street photography expedition capturing the vibrant cultural heritage and shadows of Old Dhaka.',
    coverImage: '/images/event3.jpg',
    images: [
      '/images/event3.jpg',
      '/images/gallery1.jpg',
      '/images/gallery3.jpg'
    ],
    location: 'Shankhari Bazar & Ahsan Manzil, Old Dhaka',
    details: 'Our 7th Photowalk took 40 passionate students through the historical, narrow lanes of Old Dhaka. Guided by senior club mentors, students practiced composition, environmental portraits, and utilizing high-contrast natural light.',
    order: 3
  },
  {
    id: 'e4',
    title: '8th Photowalk: Narayanganj',
    date: 'January 18, 2024',
    description: 'Capturing the ancient architectural ruins of Panam City and the landscapes of Sonargaon.',
    coverImage: '/images/gallery4.jpg',
    images: [
      '/images/gallery4.jpg',
      '/images/gallery1.jpg',
      '/images/gallery2.jpg'
    ],
    location: 'Panam City, Sonargaon',
    details: 'The 8th Photowalk explored the historic ruins of Panam City and the banks of the Shitalakshya river. Students focused on architectural photography, textures, and landscape composition under golden hour lighting.',
    order: 4
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Mist in the Woods',
    category: 'Landscape',
    image: '/images/gallery1.jpg',
    photographer: 'Sazzad Hossain',
    date: 'January 2024',
    description: 'A serene capture of morning sun rays cutting through dense autumn fog in the forests of Sreemangal.',
    order: 1
  },
  {
    id: 'g2',
    title: 'Shadows of the Arch',
    category: 'Architecture',
    image: '/images/gallery2.jpg',
    photographer: 'Nayeem Murshed',
    date: 'December 2023',
    description: 'An abstract architectural perspective focusing on geometric shadows and minimalist concrete textures.',
    order: 2
  },
  {
    id: 'g3',
    title: 'The Analog Soul',
    category: 'Portrait',
    image: '/images/gallery3.jpg',
    photographer: 'Ripa Rani Biswas',
    date: 'October 2023',
    description: 'A dramatic black and white portrait celebrating the tactile beauty of analog filmmaking and vintage gear.',
    order: 3
  },
  {
    id: 'g4',
    title: 'Golden Hour Dunes',
    category: 'Nature',
    image: '/images/gallery4.jpg',
    photographer: 'Tasnim Rahman',
    date: 'November 2023',
    description: 'The hypnotic patterns of wind-swept sand dunes glowing under the warm embrace of a desert sunset.',
    order: 4
  }
];

export const defaultAlumni: Alumni[] = [
  {
    id: 'a1',
    name: 'Tanjim Ahmed',
    batch: 'Batch 42',
    currentPosition: 'Senior Cinematographer',
    organization: 'Red Dot Productions',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    order: 1
  },
  {
    id: 'a2',
    name: 'Farhana Yasmin',
    batch: 'Batch 45',
    currentPosition: 'Documentary Photographer',
    organization: 'Freelance & NatGeo Contributor',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    order: 2
  },
  {
    id: 'a3',
    name: 'Mahmudul Hasan',
    batch: 'Batch 48',
    currentPosition: 'Software Engineer & Travel Photographer',
    organization: 'Google',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    order: 3
  },
  {
    id: 'a4',
    name: 'Anika Tabassum',
    batch: 'Batch 50',
    currentPosition: 'Visual Designer & Film Editor',
    organization: 'Asiatic JWT',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    order: 4
  }
];

export const defaultUpdates: UpdatePost[] = [
  {
    id: 'u1',
    title: 'CSE-UAP FPC Secures 1st Prize at National Inter-University Photo Exhibition!',
    date: 'March 10, 2024',
    category: 'Achievement',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    content: 'We are thrilled to announce that our executive member, Sazzad Hossain (Batch 54), has bagged the Champion trophy in the Portrait category at the National Inter-University Photography Exhibition 2024. His winning entry "The Analog Soul" was praised by judges for its dramatic lighting and emotional depth. Congratulations, Sazzad!',
    order: 1
  },
  {
    id: 'u2',
    title: 'Recruitment Open: Join the Visual Storytellers of CSE-UAP!',
    date: 'March 01, 2024',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800',
    content: 'Are you passionate about capturing moments? Do you dream of making films or telling stories through a lens? The Film & Photography Club, CSE-UAP is officially opening its recruitment doors for Spring 2024! No professional gear is required—only your passion and creative vision. Apply online or visit our desk at the UAP Plaza.',
    order: 2
  },
  {
    id: 'u3',
    title: 'World Photography Day Celebrated with Grand Campus Photowalk',
    date: 'August 19, 2023',
    category: 'Celebration',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    content: 'To celebrate World Photography Day, FPC organized a special campus photowalk and pop-up exhibition. Over 50 students participated, exploring the play of architectural shadows, campus life, and geometric reflections across the UAP campus. A temporary gallery displayed the best 20 shots of the day at the plaza.',
    order: 3
  }
];

export const defaultConvener: ConvenerInfo = {
  name: 'Shammi Akhter',
  designation: 'Convener & Assistant Professor, Department of CSE, UAP',
  quote: "A photograph is not just a captured moment; it is a story waiting to be told, a legacy waiting to be preserved, and a window into the soul of the creator.",
  welcomeMessage: "Welcome to the Film & Photography Club of CSE, UAP. Our club is a sanctuary for creative minds who see the world through a different lens. Here, we don't just teach technical shutter speeds and focal lengths; we nurture the art of visual storytelling. Through our annual exhibitions, hands-on workshops, and collaborative projects, we empower students to transform everyday moments into cinematic masterpieces. I invite you to explore our digital exhibition and join us in capturing the timeless stories of CSE-UAP.",
  photo: '/images/convener.jpg',
  email: 'shammi@uap-bd.edu',
  phone: '+880 1712-345678'
};

export const defaultSettings: WebsiteSettings = {
  siteName: 'Film & Photography Club',
  tagline: 'Capturing Stories. Creating Memories.',
  contactEmail: 'fpc@uap-bd.edu',
  contactPhone: '+880 2-22222222',
  address: 'Department of CSE, University of Asia Pacific, 74/A Green Road, Dhaka 1215, Bangladesh',
  facebookUrl: 'https://facebook.com/fpc.uap',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com/company/fpc-uap',
  heroTitle: 'FILM & PHOTOGRAPHY CLUB',
  heroSubtitle: 'CSE-UAP',
  motto: 'The Film & Photography Club, CSE-UAP is a creative community of students from the Department of Computer Science & Engineering at the University of Asia Pacific, dedicated to capturing stories, fostering visual creativity, and inspiring innovation through photography, filmmaking, and digital media.',
  mottoBgImages: [
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg',
    '/images/gallery4.jpg'
  ]
};
