'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FiltersProps {
    initialFilters: { [key: string]: string | string[] | undefined };
}

export default function Filters({ initialFilters }: FiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className="card search-sidebar">
            <div
                className="flex justify-between items-center cursor-pointer md:cursor-default"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer' }} // Inline for explicit behavior confirmation
            >
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Filters</h3>
                <span className="md:hidden filter-toggle-icon" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>

            <div className={`filter-content ${isOpen ? 'block' : 'hidden'} md:block`}>
                <form className="flex flex-col gap-2" key={JSON.stringify(initialFilters)}>
                    <input type="hidden" name="city" value={initialFilters.city as string || ''} />

                    <label className="label">
                        Gender
                        <select name="gender" className="input" defaultValue={initialFilters.gender as string || 'boys'}>
                            <option value="boys">Boys</option>
                            <option value="girls">Girls</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </label>

                    <label className="label">
                        Room Type
                        <select name="roomType" className="input" defaultValue={initialFilters.roomType as string}>
                            <option value="">Any</option>
                            <option value="single">Single</option>
                            <option value="double_sharing">Double Sharing</option>
                            <option value="triple_sharing">Triple Sharing</option>
                            <option value="four_sharing">4 Sharing</option>
                        </select>
                    </label>

                    <label className="label">
                        Max Price
                        <input type="number" name="maxPrice" placeholder="e.g. 10000" className="input" defaultValue={initialFilters.maxPrice as string} />
                    </label>

                    <div className="mt-2">
                        <label className="label mb-2">Facilities</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" name="food" value="true" defaultChecked={initialFilters.food === 'true'} />
                                <span>Food</span>
                            </label>
                            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" name="wifi" value="true" defaultChecked={initialFilters.wifi === 'true'} />
                                <span>WiFi</span>
                            </label>
                            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" name="washingMachine" value="true" defaultChecked={initialFilters.washingMachine === 'true'} />
                                <span>Washing Machine</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn mt-4 w-full" style={{ width: '100%', padding: '0.6rem 1rem', fontSize: '0.95rem', height: 'auto' }}>Apply Filters</button>
                    <Link href={`/search?city=${initialFilters.city || ''}`} className="btn btn-secondary w-full" style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center', padding: '0.6rem 1rem', fontSize: '0.95rem', height: 'auto' }}>Reset</Link>
                </form>
            </div>
        </aside>
    );
}
