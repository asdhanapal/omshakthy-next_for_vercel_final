'use client'
import { useState } from 'react'
import { blogs } from './PriceTrends'
import './BlogSection.css'

const BlogSection = () => {
  const [openIdx, setOpenIdx] = useState(0)
  const post = blogs[openIdx]

  return (
    <section className="bl" aria-label="Latest blogs">

      <header className="bl__header">
        <span className="bl__eyebrow">From Our Journal</span>
        <h2 className="bl__title">Latest <em>Blogs</em></h2>
        <a className="bl__all" href="/blog">View all →</a>
      </header>

      <div className="bl__body">
        {/* Featured article */}
        <div className="bl__feature">
          <a href="/blog" className="bl__feature-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="bl__feature-img" />
            <div className="bl__feature-shade" />
            <div className="bl__feature-body">
              <div className="bl__feature-meta">
                <span className="bl__feature-cat">{post.cat}</span>
                <span>{post.date}</span>
                <span>· {post.read}</span>
              </div>
              <h3 className="bl__feature-title">{post.title}</h3>
              <p className="bl__feature-excerpt">{post.excerpt}</p>
              <span className="bl__feature-read">Read article →</span>
            </div>
          </a>
        </div>

        {/* Selector list */}
        <ul className="bl__list">
          {blogs.map((b, i) => (
            <li
              key={b.title}
              className={`bl__item ${openIdx === i ? 'is-active' : ''}`}
              onMouseEnter={() => setOpenIdx(i)}
              onClick={() => setOpenIdx(i)}
            >
              <span className="bl__item-index">0{i + 1}</span>
              <div className="bl__item-content">
                <span className="bl__item-cat">{b.cat}</span>
                <span className="bl__item-title">{b.title}</span>
                <span className="bl__item-meta">{b.date} · {b.read}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt={b.title} className="bl__item-thumb" />
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}

export default BlogSection
