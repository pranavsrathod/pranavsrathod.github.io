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
            text: 'Photos',
            href: 'http://photos.pranavrathod.com/'
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
        text: `I’m a creative technologist, engineer, and sometimes a quiet observer of the world. I recently completed my Master’s in Computer Science at the University of Southern California, specializing in Multimedia and Creative Technologies.`,
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
    // subscribe: {
    //     title: 'Subscribe to Pranav Newsletter',
    //     text: 'One update per week. All the latest posts directly in your inbox.',
    //     formUrl: '#'
    // },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
