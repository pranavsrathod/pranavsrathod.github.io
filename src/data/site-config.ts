export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Pranav Rathod',
    subtitle: 'Software Engineering | Photography',
    description: 'Pranav Who?',
    image: {
        src: '/logoPreview.png',
        alt: 'Pranav Rathod Logo (Designed using Procreate)'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/pranavsrathod/'
        },
        {
            text: 'Github',
            href: 'https://github.com/pranavsrathod'
        }
    ],
    hero: {
        title: 'Code, Art, and a Bit of Chaos',
        text: `I’m a creative technologist, engineer, and sometimes a quiet observer of the world — currently pursuing my Master’s in Computer Science at the University of Southern California, specializing in Multimedia and Creative Technologies.

With a foundation in computer graphics, animation, game engine development, and multimedia systems, my work blends technical depth with visual storytelling. I enjoy building tools and experiences that sit at the intersection of logic and expression.

Some of the areas I'm especially drawn to include real-time rendering, XR design and perception, systems thinking in creative tools, and human-computer interaction in motion and space.

Beyond code, I love exploring and capturing urban architecture and everyday symmetry on my phone, documenting the quiet moments that make a city feel alive.`,
        image: {
            src: '/atPondCHI.JPG',
            alt: 'Pranav Look WTF Hollywood is?'
        },
        actions: [
            {
                text: 'View Resume',
                href: '/Resume/Pranav_Rathod_Resume.pdf'
            },
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to Pranav Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
