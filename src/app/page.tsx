'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Select from '@/components/Select';

import bangaloreImg from '@/cities/bangalore.jpeg';
import chennaiImg from '@/cities/chennai.jpeg';
import delhiImg from '@/cities/delhi.jpeg';
import gurgaonImg from '@/cities/gurgaon.jpeg';
import hyderabadImg from '@/cities/hyderabad.jpeg';
import jaipurImg from '@/cities/jaipur.jpeg';
import mumbaiImg from '@/cities/mumbai.jpeg';
import puneImg from '@/cities/pune.jpeg';

const POPULAR_CITIES = [
  { name: 'Bangalore', img: bangaloreImg },
  { name: 'Delhi', img: delhiImg },
  { name: 'Gurgaon', img: gurgaonImg },
  { name: 'Hyderabad', img: hyderabadImg },
  { name: 'Mumbai', img: mumbaiImg },
  { name: 'Pune', img: puneImg },
  { name: 'Chennai', img: chennaiImg },
  { name: 'Jaipur', img: jaipurImg },
];

const CITY_OPTIONS = [
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Noida', label: 'Noida' },
  { value: 'Gurgaon', label: 'Gurgaon' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Indore', label: 'Indore' },
  { value: 'Jaipur', label: 'Jaipur' },
];

export default function Home() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [pgName, setPgName] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) {
      alert('Please select a city first');
      return;
    }
    router.push(`/search?city=${city}&pgName=${pgName}`);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <main className="flex flex-col items-center justify-center catch-copy" style={{ minHeight: '60vh', textAlign: 'center', backgroundImage: 'radial-gradient(rgba(119, 141, 169, 0.25) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>

        <h2 className="hero-title">
          Find your next PG without<br />the noise.
        </h2>
        <p style={{ color: 'var(--secondary-text)', marginBottom: '2rem', maxWidth: '600px' }}>
          Direct contact with owners. Complete Details. Real listings only.
        </p>

        <form onSubmit={handleSearch} className="search-form" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          <Select
            options={CITY_OPTIONS}
            value={city}
            onChange={setCity}
            placeholder="Select City"
          />
          <input
            type="text"
            value={pgName}
            onChange={(e) => setPgName(e.target.value)}
            placeholder="Search by PG Name (Optional)"
            className="input"
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>Search PGs</button>
        </form>

        <section style={{ width: '100%', maxWidth: '900px' }}>
          <h3 style={{ marginBottom: '2rem', color: 'var(--primary-text)' }}>Popular Cities</h3>
          <div className="cities-grid">
            {POPULAR_CITIES.map((c) => (
              <div
                key={c.name}
                onClick={() => router.push(`/search?city=${c.name}`)}
                style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', position: 'relative', aspectRatio: '1/1', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
                className="city-card"
              >
                <Image src={c.img} alt={c.name} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover', transition: 'transform 0.5s' }} className="city-img" />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                  padding: '1rem', color: 'white', fontWeight: 600, textAlign: 'left',
                  fontSize: '1.1rem'
                }}>
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ width: '100%', maxWidth: '1000px', marginTop: '4rem' }}>
          <h3 style={{ marginBottom: '2rem', color: 'var(--primary-text)' }}>Why Choose OnlyPGs?</h3>
          <div className="features-grid">
            <div className="card feature-card">
              <div className="icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h4>Verified Listings</h4>
              <p>Every PG listed is manually verified to ensure authenticity and quality standards.</p>
            </div>

            <div className="card feature-card">
              <div className="icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="M6 13l10.5 8" />
                  <path d="M6 13h3a5.5 5.5 0 0 0 0-11H6" />
                </svg>
              </div>
              <h4>Genuine Prices</h4>
              <p>Transparent pricing based on nature of room sharing. No hidden costs or brokerage.</p>
            </div>

            <div className="card feature-card">
              <div className="icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6h13" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M3 6h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                </svg>
              </div>
              <h4>Facilities Offered</h4>
              <p>Detailed amenities list for every property so you know exactly what you get.</p>
            </div>

            <div className="card feature-card">
              <div className="icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h4>Direct Contact</h4>
              <p>Connect directly with owners via Phone or WhatsApp. No middlemen.</p>
            </div>
          </div>
        </section>
        <style jsx global>{`
           .cities-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
              width: 100%;
           }
           @media (min-width: 768px) {
              .cities-grid {
                 grid-template-columns: repeat(4, 1fr);
              }
              .features-grid {
                 grid-template-columns: repeat(4, 1fr);
              }
           }
           .features-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1.5rem;
              width: 100%;
           }
           .feature-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 2rem !important;
              transition: transform 0.2s;
              background-color: var(--card-bg);
           }
           .feature-card:hover {
              /* No hover movement */
           }
           .icon-bg {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: var(--background); /* Light background */
              color: var(--accent);          /* Dark lines */
              border: 1px solid var(--accent); /* Border to define circle against card */
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 1rem;
           }
           .feature-card h4 {
              margin: 0 0 0.5rem 0;
              color: var(--primary-text);
              font-size: 1.1rem;
           }
           .feature-card p {
              margin: 0;
              color: var(--secondary-text);
              font-size: 0.9rem;
              line-height: 1.4;
           }
           .city-card:hover .city-img {
               transform: scale(1.1);
           }
           
           /* Hero Section Responsive Styles */
           .hero-title {
              margin-top: 0;
              font-size: 3rem;
              font-weight: 800;
              margin-bottom: 1rem;
              line-height: 1.2;
              background: linear-gradient(45deg, var(--primary-text), var(--accent));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
              letter-spacing: -0.02em;
           }
           
           @media (max-width: 768px) {
              .hero-title {
                 font-size: 2.25rem;
              }
           }
        `}</style>
      </main>
    </div>
  );
}
