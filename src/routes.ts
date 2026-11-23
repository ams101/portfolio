// Views live in the URL hash (#/work/zo-trips, #/writing/chatbots, #/built/tara),
// like the Ops app, so Back works, refresh keeps your place and links can be shared
// without server rewrites. #/work and #/writing on their own mean "home, at that section".
export const hrefFor = {
  home: '#/',
  homeSection: (section: 'work' | 'writing') => `#/${section}`,
  caseStudy: (id: string) => `#/work/${id}`,
  article: (id: string) => `#/writing/${id}`,
  built: (section?: string) => (section ? `#/built/${section}` : '#/built'),
};
