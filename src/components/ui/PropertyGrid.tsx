'use client'
import { useState } from 'react'
import Link from 'next/link'
import './PropertyGrid.css'

interface Property {
  image: string
  name: string
  location: string
  status: string
  type: string
  price: string
  link?: string
}

const properties: Property[] = [
  {
    image: '/canopus-magha.png',
    name: 'Canopus Magha',
    location: 'Guduvanchery, Chennai',
    status: 'Ongoing',
    type: 'Residential Plots',
    price: '₹25L onwards',
  },
  {
    image: '/regalia.png',
    name: 'OmShakthy Regalia',
    location: 'Avadi, Chennai',
    status: 'Ongoing',
    type: 'Gated Community',
    price: '₹32L onwards',
    link: '/regalia',
  },
  {
    image: '/elite-grand.png',
    name: 'Elite Grand',
    location: 'Thirumullaivoyal, Chennai',
    status: 'Ongoing',
    type: 'Premium Plots',
    price: '₹28L onwards',
  },
  {
    image: '/mathura.png',
    name: 'OmShakthy Mathura',
    location: 'Tambaram, Chennai',
    status: 'Sold',
    type: 'Residential Plots',
    price: 'Sold Out',
  },
  {
    image: '/property-5.png',
    name: 'Canopus Mithila',
    location: 'Vandalur, Chennai',
    status: 'Sold',
    type: 'Gated Community',
    price: 'Sold Out',
  },
  {
    image: '/property-6.png',
    name: 'Industrial Park',
    location: 'Sriperumbudur, Chennai',
    status: 'Sold',
    type: 'Industrial',
    price: 'Sold Out',
  },
]

const PropertyGrid = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="property-section" id="property-grid" data-snap="true">
      <div className="property-list">
        {properties.map((property, i) => (
          <div
            key={property.name}
            className={`property-item ${activeIndex === i ? 'active' : ''} ${property.status === 'Sold' ? 'sold' : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <Link className="property-item__link" href={property.link || '/projects'}>
              <div className="property-item__img">
                <img src={property.image} alt={property.name} loading="lazy" />
                <div className="property-item__gradient" />
              </div>

              {/* Vertical rotated label — visible when NOT active */}
              <span className="property-item__label">{property.status}</span>

              {/* Text overlay — visible only when active */}
              <div className="property-item__text">
                <h4>{property.name}</h4>
                <p>{property.location}</p>
                <p className="property-item__price">{property.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* View More CTA */}
      <div className="property-cta">
        <a href="/projects" className="property-cta__btn">View More</a>
      </div>
    </section>
  )
}

export default PropertyGrid
