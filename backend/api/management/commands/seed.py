import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import (
    Alumni,
    ConvenerInfo,
    Event,
    GalleryItem,
    Member,
    Profile,
    UpdatePost,
    WebsiteSettings,
)


MEMBERS = [
    ('m1', 'Nayeem Murshed', 'President', 'Batch 52', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'A frame is a sentence; leadership is the story we tell together.', 'Guiding the Faculty of Computing Club with vision and integrity, ensuring every initiative reflects our shared passion for creativity and technology.'),
    ('m2', 'Ripa Rani Biswas', 'Vice President', 'Batch 53', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', 'Every angle holds a perspective worth honoring.', 'Supporting the president in steering club operations, bridging teams, and championing an inclusive, creative culture across the faculty.'),
    ('m3', 'Tasnim Rahman', 'General Secretary', 'Batch 54', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Great memories are built on great organization.', 'Keeping the club\u2019s rhythm \u2014 records, correspondence, and coordination \u2014 so every member\u2019s voice is heard and every plan comes alive.'),
    ('m4', 'Sadia Afrin', 'Organizing Secretary', 'Batch 55', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400', 'The best photographs come from carefully crafted moments.', 'Turning ideas into well-run events \u2014 from concept to closing frame \u2014 with a sharp eye for detail and seamless execution.'),
    ('m5', 'Sazzad Hossain', 'Head of Photography', 'Batch 54', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400', 'Chasing light, framing truth.', 'Leading the photography wing \u2014 mentoring shooters, curating visual stories, and pushing the craft of the image forward.'),
    ('m6', 'Rayhan Ahmed', 'Head of Videography', 'Batch 55', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400', 'Motion tells the stories stillness cannot.', 'Directing the club\u2019s moving images \u2014 from documentaries to recaps \u2014 capturing the energy of campus life frame by frame.'),
    ('m7', 'Tanvir Islam', 'Joint Secretary', 'Batch 55', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Every brief becomes a frame worth revisiting.', 'Assisting the general secretary in administration, minute-keeping, and keeping the club\u2019s creative pipeline moving across every wing.'),
    ('m8', 'Mehnaz Tabassum', 'Treasurer', 'Batch 56', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', 'Good budgeting keeps the picture in focus.', 'Managing club finances and sponsorships so every exhibition, workshop, and photowalk has the resources it deserves.'),
    ('m9', 'Asif Iqbal', 'Event Coordinator', 'Batch 56', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400', 'A well-planned shoot begins long before the shutter.', 'Designing and executing club events end-to-end, from venue and logistics to the final applause and the closing frame.'),
    ('m10', 'Nusrat Jahan', 'Creative Head', 'Batch 55', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400', 'Concepts come alive when ideas meet a camera.', 'Leading art direction and creative concepts \u2014 translating the club\u2019s vision into posters, brand stories, and visual campaigns.'),
    ('m11', 'Fahim Rahman', 'Media Head', 'Batch 57', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Content is the long exposure of the club.', 'Owning the club\u2019s social presence \u2014 planning content calendars and amplifying every story to the wider campus community.'),
    ('m12', 'Shuvro Das', 'Web Master', 'Batch 57', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', 'Pixels and code, both made to capture.', 'Building and maintaining the club\u2019s digital home \u2014 from this very website to the archives that keep our stories alive online.'),
    ('m13', 'Maruf Hasan', 'Executive Member', 'Batch 56', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400', 'The candid moments are the honest ones.', 'Supporting event crews, mentoring newcomers, and bringing an energetic presence to every club initiative.'),
    ('m14', 'Anika Rahman', 'Executive Member', 'Batch 57', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'Soft light, softer stories.', 'Coordinating shoots and community projects, with a special love for portraiture and human stories.'),
    ('m15', 'Jubayer Ahmed', 'Member', 'Batch 58', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Learning one frame at a time.', 'An active club member learning the craft alongside a passionate team \u2014 always ready with a camera and a curious eye.'),
]

EVENTS = [
    ('e1', 'The View Finder \u2014 Season 7', 'February 15, 2024', 'The flagship annual photography carnival and gallery exhibition showcasing visual stories by CSE students.', '/images/contest-1st-namira-islam.jpg', ['/images/contest-1st-namira-islam.jpg', '/images/contest-cat2-jannatul-shormi.jpg', '/images/contest-cat1-mehedi-munna.jpg'], 'https://www.w3schools.com/html/mov_bbb.mp4', 'UAP Plaza & Auditorium', 'The View Finder Season 7 is the premier annual exhibition of the Film & Photography Club. This year, the carnival displayed over 150 curated photographs and 8 short films. Renowned national photojournalists and visual artists conducted feedback sessions for our student photographers.'),
    ('e2', 'Photography Workshop: Photo Adda', 'November 12, 2023', 'An interactive photography masterclass and feedback session on visual storytelling with industry professionals.', '/images/contest-2nd-tahmid-jashim.jpg', ['/images/contest-2nd-tahmid-jashim.jpg', '/images/contest-cat3-kayes-biplob.jpg', '/images/contest-cat1-zarin-anjum.jpg'], 'https://www.w3schools.com/html/movie.mp4', 'CSE Seminar Hall, UAP', 'Photo Adda brought professional photographers and students together for a day of sharing visual narratives. The workshop focused on lighting techniques, portfolio curation, and framing human emotions with minimal gear.'),
    ('e3', '7th Photowalk: Dhaka', 'September 05, 2023', 'A street photography expedition capturing the vibrant cultural heritage and shadows of Old Dhaka.', '/images/contest-cat1-faisal-hossain.jpg', ['/images/contest-cat1-faisal-hossain.jpg', '/images/contest-cat2-md-arkive.jpg', '/images/contest-cat3-nazmul-nadim.jpg'], '', 'Shankhari Bazar & Ahsan Manzil, Old Dhaka', 'Our 7th Photowalk took 40 passionate students through the historical, narrow lanes of Old Dhaka. Guided by senior club mentors, students practiced composition, environmental portraits, and utilizing high-contrast natural light.'),
    ('e4', '8th Photowalk: Narayanganj', 'January 18, 2024', 'Capturing the ancient architectural ruins of Panam City and the landscapes of Sonargaon.', '/images/contest-cat2-jannatul-shormi.jpg', ['/images/contest-cat2-jannatul-shormi.jpg', '/images/contest-cat3-adnan-sami.jpg', '/images/contest-cat2-julias-khan.jpg'], '', 'Panam City, Sonargaon', 'The 8th Photowalk explored the historic ruins of Panam City and the banks of the Shitalakshya river. Students focused on architectural photography, textures, and landscape composition under golden hour lighting.'),
]

GALLERY = [
    ('g5', 'First Place Winner', '1st Place', '/images/contest-1st-namira-islam.jpg', 'Namira Islam', 'April 2026', 'Grand prize entry from the FPC photography contest, April 2026.'),
    ('g6', 'Second Place Winner', '2nd Place', '/images/contest-2nd-tahmid-jashim.jpg', 'Tahmid Ebne Jashim', 'April 2026', 'Runner-up entry from the FPC photography contest, April 2026.'),
    ('g7', 'Category 1 Entry', 'Category 1', '/images/contest-cat1-mehedi-munna.jpg', 'Md. Mehedi Hasan Munna', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g8', 'Category 2 Entry', 'Category 2', '/images/contest-cat2-jannatul-shormi.jpg', 'Jannatul Ferdous Shormi', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g9', 'Category 2 Entry', 'Category 2', '/images/contest-cat2-julias-khan.jpg', 'Julias Uddin Khan', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g10', 'Category 2 Entry', 'Category 2', '/images/contest-cat2-md-arkive.jpg', 'Md Arkive', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g11', 'Category 3 Entry', 'Category 3', '/images/contest-cat3-kayes-biplob.jpg', 'Md Kayes Ahammed Biplob', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g12', 'Category 3 Entry', 'Category 3', '/images/contest-cat3-nazmul-nadim.jpg', 'Mohammad Nazmul Hossain Nadim', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g13', 'Category 3 Entry', 'Category 3', '/images/contest-cat3-adnan-sami.jpg', 'Md. Adnan Karim Sami', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g14', 'Category 1 Entry', 'Category 1', '/images/contest-cat1-faisal-hossain.jpg', 'Faisal Hossain', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g15', 'Category 1 Entry', 'Category 1', '/images/contest-cat1-zarin-anjum.jpg', 'Zarin Anjum', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g16', 'Category 1 Entry', 'Category 1', '/images/contest-cat1-tahsin-siddika.jpg', 'Tahsin Siddika', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g17', 'Category 2 Entry', 'Category 2', '/images/contest-cat2-tahmid-jashim-b.jpg', 'Tahmid Ebne Jashim', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g18', 'Contest Entry', '1st Place', '/images/contest-namira-islam-2.jpg', 'Namira Islam', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
    ('g19', 'Contest Entry', '1st Place', '/images/contest-namira-islam-3.jpg', 'Namira Islam', 'April 2026', 'Official entry from the FPC photography contest, April 2026.'),
]

ALUMNI = [
    ('a1', 'Tanjim Ahmed', 'Batch 42', 'Senior Cinematographer', 'Red Dot Productions', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'),
    ('a2', 'Farhana Yasmin', 'Batch 45', 'Documentary Photographer', 'Freelance & NatGeo Contributor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
    ('a3', 'Mahmudul Hasan', 'Batch 48', 'Software Engineer & Travel Photographer', 'Google', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'),
    ('a4', 'Anika Tabassum', 'Batch 50', 'Visual Designer & Film Editor', 'Asiatic JWT', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'),
]

UPDATES = [
    ('u1', 'CSE-UAP FPC Secures 1st Prize at National Inter-University Photo Exhibition!', 'March 10, 2024', 'Achievement', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 'We are thrilled to announce that our executive member, Sazzad Hossain (Batch 54), has bagged the Champion trophy in the Portrait category at the National Inter-University Photography Exhibition 2024. His winning entry "The Analog Soul" was praised by judges for its dramatic lighting and emotional depth. Congratulations, Sazzad!', 'published'),
    ('u2', 'Recruitment Open: Join the Visual Storytellers of CSE-UAP!', 'March 01, 2024', 'Announcement', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800', 'Are you passionate about capturing moments? Do you dream of making films or telling stories through a lens? The Film & Photography Club, CSE-UAP is officially opening its recruitment doors for Spring 2024! No professional gear is required\u2014only your passion and creative vision. Apply online or visit our desk at the UAP Plaza.', 'published'),
    ('u3', 'World Photography Day Celebrated with Grand Campus Photowalk', 'August 19, 2023', 'Celebration', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', 'To celebrate World Photography Day, FPC organized a special campus photowalk and pop-up exhibition. Over 50 students participated, exploring the play of architectural shadows, campus life, and geometric reflections across the UAP campus. A temporary gallery displayed the best 20 shots of the day at the plaza.', 'published'),
    ('u4', 'Annual Exhibition "Through the Lens" \u2014 Submissions Opening Soon', 'May 12, 2024', 'Announcement', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800', 'The club\u2019s flagship annual exhibition returns. Twelve months of student frames \u2014 portraits, streets, and silent films \u2014 will fill the UAP campus. Submissions open soon; every member is invited to hang one frame on the wall.', 'upcoming'),
]


class Command(BaseCommand):
    help = 'Seeds the database with the default FPC content and demo users.'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Replace existing data instead of skipping if present.')

    def handle(self, *args, **options):
        force = options['force']
        existing = Member.objects.exists()

        if existing and not force:
            self.stdout.write(self.style.WARNING('Database already has content. Use --force to re-seed.'))
            return

        Member.objects.all().delete()
        Event.objects.all().delete()
        GalleryItem.objects.all().delete()
        Alumni.objects.all().delete()
        UpdatePost.objects.all().delete()
        ConvenerInfo.objects.all().delete()
        WebsiteSettings.objects.all().delete()

        for i, (pk, name, position, batch, photo, quote, bio) in enumerate(MEMBERS, start=1):
            Member.objects.create(
                id=pk, name=name, position=position, batch=batch,
                email=f'{pk}@cse.uap-bd.edu',
                facebook='https://facebook.com/fpc.uap', linkedin='https://linkedin.com',
                instagram='https://instagram.com', photo=photo, quote=quote, bio=bio, order=i,
            )

        for i, (pk, title, date, desc, cover, images, video, loc, details) in enumerate(EVENTS, start=1):
            Event.objects.create(
                id=pk, title=title, date=date, description=desc, coverImage=cover,
                images=images, videoUrl=video, location=loc, details=details, order=i,
            )

        for i, (pk, title, cat, image, photog, date, desc) in enumerate(GALLERY, start=5):
            GalleryItem.objects.create(
                id=pk, title=title, category=cat, image=image, photographer=photog,
                date=date, description=desc, order=i,
            )

        for i, (pk, name, batch, pos, org, photo) in enumerate(ALUMNI, start=1):
            Alumni.objects.create(
                id=pk, name=name, batch=batch, currentPosition=pos, organization=org,
                photo=photo, order=i,
            )

        for i, (pk, title, date, cat, image, content, status) in enumerate(UPDATES, start=1):
            UpdatePost.objects.create(
                id=pk, title=title, date=date, category=cat, image=image,
                content=content, order=i, status=status,
            )

        ConvenerInfo.objects.create(
            id=1,
            name='Shammi Akhter',
            designation='Convener & Assistant Professor, Department of CSE, UAP',
            quote='A photograph is not just a captured moment; it is a story waiting to be told, a legacy waiting to be preserved, and a window into the soul of the creator.',
            welcomeMessage='Welcome to the Film & Photography Club of CSE, UAP. Our club is a sanctuary for creative minds who see the world through a different lens. Here, we don\'t just teach technical shutter speeds and focal lengths; we nurture the art of visual storytelling. Through our annual exhibitions, hands-on workshops, and collaborative projects, we empower students to transform everyday moments into cinematic masterpieces. I invite you to explore our digital exhibition and join us in capturing the timeless stories of CSE-UAP.',
            photo='/images/convener.jpg',
            email='shammi@uap-bd.edu',
            phone='+880 1712-345678',
        )

        WebsiteSettings.objects.create(
            id=1,
            siteName='Film & Photography Club',
            tagline='Capturing Stories. Creating Memories.',
            contactEmail='fpc@uap-bd.edu',
            contactPhone='+880 2-22222222',
            address='Department of CSE, University of Asia Pacific, 74/A Green Road, Dhaka 1215, Bangladesh',
            facebookUrl='https://facebook.com/fpc.uap',
            instagramUrl='https://instagram.com',
            youtubeUrl='https://youtube.com',
            linkedinUrl='https://linkedin.com/company/fpc-uap',
            heroTitle='FILM & PHOTOGRAPHY CLUB',
            heroSubtitle='CSE-UAP',
            motto='The Film & Photography Club, CSE-UAP is a creative community of students from the Department of Computer Science & Engineering at the University of Asia Pacific, dedicated to capturing stories, fostering visual creativity, and inspiring innovation through photography, filmmaking, and digital media. We provide a collaborative platform where aspiring photographers, filmmakers, designers, and storytellers can develop their skills, exchange ideas, and transform creative visions into meaningful visual experiences.',
            mottoBgImages=[
                '/images/contest-1st-namira-islam.jpg',
                '/images/contest-cat2-jannatul-shormi.jpg',
                '/images/contest-cat3-kayes-biplob.jpg',
                '/images/contest-cat1-mehedi-munna.jpg',
            ],
        )

        admin, created_a = User.objects.get_or_create(username='admin')
        admin.set_password(os.environ.get('ADMIN_PASSWORD', 'Fpc@admin2026'))
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        Profile.objects.update_or_create(user=admin, defaults={'role': 'admin'})

        editor, created_e = User.objects.get_or_create(username='editor')
        editor.set_password(os.environ.get('EDITOR_PASSWORD', 'Fpc@editor2026'))
        editor.save()
        Profile.objects.update_or_create(user=editor, defaults={'role': 'editor'})

        self.stdout.write(self.style.SUCCESS(
            'Seeded: 15 members, 4 events, 15 gallery items, 4 alumni, 4 updates, convener, settings.\n'
            'Users -> admin / Fpc@admin2026   editor / Fpc@editor2026'
        ))
