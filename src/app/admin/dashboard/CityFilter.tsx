'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CityFilterProps {
    cities: string[];
    currentCity: string;
}

export default function CityFilter({ cities, currentCity }: CityFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (city && city !== 'all') {
            params.set('city', city);
        } else {
            params.delete('city');
        }

        // Reset page to 1 on filter change
        params.set('page', '1');

        router.push(`/admin/dashboard?${params.toString()}`);
    };

    return (
        <select
            className="input"
            style={{ padding: '0.4rem', border: '1px solid var(--accent)', borderRadius: '4px' }}
            value={currentCity}
            onChange={handleChange}
        >
            <option value="all">All Cities</option>
            {cities.map((city) => (
                <option key={city} value={city}>
                    {city}
                </option>
            ))}
        </select>
    );
}
