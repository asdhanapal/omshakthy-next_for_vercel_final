// Sanity schema definitions for OmShakthy CMS content models
// These are exported for use with Sanity Studio (sanity.config.ts)

export const projectSchema = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'status', title: 'Status', type: 'string', options: { list: ['Ongoing', 'Upcoming', 'Sold'] } },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'price', title: 'Price', type: 'string' },
    { name: 'reraId', title: 'RERA ID', type: 'string' },
    { name: 'link', title: 'Page Link', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}

export const heroSlideSchema = {
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}

export const leaderSchema = {
  name: 'leader',
  title: 'Leader',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'points', title: 'Key Points', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}

export const blogPostSchema = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', title: 'Excerpt', type: 'text' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'category', title: 'Category', type: 'string' },
  ],
}

export const testimonialSchema = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'author', title: 'Author', type: 'string' },
    { name: 'designation', title: 'Designation/Unit', type: 'string' },
    { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
  ],
}

export const faqSchema = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'text' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}

export const timelineEventSchema = {
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
}
