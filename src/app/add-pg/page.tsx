'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPGPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);

    const [formData, setFormData] = useState({
        submittedBy: 'owner',
        pgName: '',
        city: '',
        area: '',
        landmark: '',
        genderType: 'boys',
        securityDeposit: '0',
        facilities: {
            food: false,
            wifi: false,
            washingMachine: false,
            roomCleaning: false,
            powerBackup: false,
            airConditioning: false,
            attachedWashroom: false,
        },
        rules: {
            nightEntryTime: '',
            visitorPolicy: 'not_allowed',
            smokingDrinking: 'not_allowed',
        },
        contact: {
            phone: '',
            whatsapp: '',
        },
        photos: [] as string[],
        rooms: [] as { roomType: string; price: string }[],
    });

    // Helper to update nested state
    const updateForm = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateNested = (parent: string, key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [key]: value },
        }));
    };

    // Steps Handlers
    const nextStep = () => setStep((p) => p + 1);
    const prevStep = () => setStep((p) => p - 1);

    const validateStep3 = () => {
        if (formData.rooms.length === 0) {
            alert('Please add at least one room type');
            return;
        }
        nextStep();
    };

    const validateStep2 = () => {
        if (!formData.pgName || !formData.city || !formData.area || !formData.landmark || !formData.securityDeposit) {
            alert('Please fill all fields');
            return;
        }
        nextStep();
    };

    const validateStep6 = () => {
        if (formData.photos.length < 1) {
            alert('Please upload at least one photo');
            return;
        }
        nextStep();
    };

    const validateStep7 = () => {
        if (formData.contact.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        nextStep();
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const maxPhotos = 6;
        const currentCount = formData.photos.length;
        const uploadCount = e.target.files.length;

        if (currentCount + uploadCount > maxPhotos) {
            alert(`You can only upload ${maxPhotos} photos in total. You have ${maxPhotos - currentCount} slots remaining.`);
            return;
        }

        setUploading(true);
        const form = new FormData();
        Array.from(e.target.files).forEach((f) => form.append('file', f));

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...data.urls] }));
            }
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pgs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                router.push('/submission-success');
            } else {
                alert('Submission failed: ' + data.error);
            }
        } catch (error) {
            alert('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>List Your PG</h1>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <div key={s} style={{ height: '4px', flex: 1, background: s <= step ? 'var(--accent)' : '#ddd' }}></div>
                ))}
            </div>

            <div className="card">
                {step === 1 && (
                    <div>
                        <h2>Who are you?</h2>
                        <div className="flex flex-col gap-2 mt-4">
                            {['owner', 'manager', 'tenant'].map((role) => (
                                <label key={role} className="flex items-center gap-2 p-3 border rounded" style={{ cursor: 'pointer', borderColor: formData.submittedBy === role ? 'var(--accent)' : 'var(--border)' }}>
                                    <input type="radio" name="role" value={role} checked={formData.submittedBy === role} onChange={(e) => updateForm('submittedBy', e.target.value)} />
                                    <span style={{ textTransform: 'capitalize' }}>{role}</span>
                                </label>
                            ))}
                        </div>
                        <button className="btn w-full mt-4" onClick={nextStep}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2>Basic Details</h2>
                        <div className="flex flex-col gap-4 mt-4">
                            <label className="label">PG Name <input className="input" value={formData.pgName} onChange={e => updateForm('pgName', e.target.value)} placeholder="e.g. Sri Lakshmi PG" /></label>
                            <label className="label">City
                                <select className="input" value={formData.city} onChange={e => updateForm('city', e.target.value)}>
                                    <option value="">Select City</option>
                                    {['Bangalore', 'Delhi', 'Noida', 'Gurgaon', 'Pune', 'Hyderabad', 'Chennai', 'Mumbai', 'Indore', 'Jaipur'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </label>
                            <label className="label">Area / Locality <input className="input" value={formData.area} onChange={e => updateForm('area', e.target.value)} placeholder="e.g. Koramangala or HSR Layout" /></label>
                            <label className="label">Landmark <input className="input" value={formData.landmark} onChange={e => updateForm('landmark', e.target.value)} placeholder="e.g. Near Sony Signal" /></label>
                            <label className="label">
                                Security Deposit (₹)
                                <input type="number" className="input" required value={formData.securityDeposit} onChange={e => updateForm('securityDeposit', e.target.value)} placeholder="0" />
                            </label>
                            <label className="label">Gender Allowed
                                <select className="input" value={formData.genderType} onChange={e => updateForm('genderType', e.target.value)}>
                                    <option value="boys">Boys</option>
                                    <option value="girls">Girls</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={validateStep2}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2>Room Options & Prices</h2>
                        <div className="flex flex-col gap-6 mt-4">
                            {['single', 'double_sharing', 'triple_sharing', 'four_sharing'].map((type) => {
                                const isSelected = formData.rooms.some(r => r.roomType === type);
                                const currentPrice = formData.rooms.find(r => r.roomType === type)?.price || '';

                                const handleToggle = (val: string) => {
                                    if (val === 'yes') {
                                        if (!isSelected) {
                                            setFormData(prev => ({ ...prev, rooms: [...prev.rooms, { roomType: type, price: '0' }] }));
                                        }
                                    } else {
                                        setFormData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.roomType !== type) }));
                                    }
                                };

                                const handlePriceChange = (val: string) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        rooms: prev.rooms.map(r => r.roomType === type ? { ...r, price: val } : r)
                                    }));
                                };

                                return (
                                    <div key={type} className="p-4 border rounded bg-white">
                                        <div className="flex flex-col gap-2">
                                            <p className="font-medium" style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Do you have <strong style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')}</strong> room option?</p>

                                            <div className="flex gap-4 mb-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`room_${type}`}
                                                        checked={isSelected}
                                                        onChange={() => handleToggle('yes')}
                                                    />
                                                    <span>Yes</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`room_${type}`}
                                                        checked={!isSelected}
                                                        onChange={() => handleToggle('no')}
                                                    />
                                                    <span>No</span>
                                                </label>
                                            </div>

                                            {isSelected && (
                                                <div className="mt-2 pl-4 border-l-2 border-gray-200" style={{ animation: 'fadeIn 0.2s' }}>
                                                    <label className="label">Price (Monthly)
                                                        <input
                                                            type="number"
                                                            className="input"
                                                            value={currentPrice}
                                                            onChange={e => handlePriceChange(e.target.value)}
                                                            placeholder="0"
                                                            style={{ marginTop: '0.25rem' }}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Prices must be fixed per room type.</p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={validateStep3}>Next</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2>Facilities</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {Object.keys(formData.facilities).map(key => (
                                <label key={key} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 transition-colors" style={{
                                    cursor: 'pointer',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    userSelect: 'none'
                                }}>
                                    <input type="checkbox" checked={(formData.facilities as any)[key]} onChange={e => updateNested('facilities', key, e.target.checked)} />
                                    <span style={{ textTransform: 'capitalize', lineHeight: '1.2', whiteSpace: 'nowrap' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={nextStep}>Next</button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <h2>Rules</h2>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex flex-col gap-2">
                                <label className="label">Night Entry Time</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="nightEntryType"
                                            checked={formData.rules.nightEntryTime === 'No Restriction' || !formData.rules.nightEntryTime}
                                            onChange={() => updateNested('rules', 'nightEntryTime', 'No Restriction')}
                                        />
                                        No Restriction
                                    </label>
                                    <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="nightEntryType"
                                            checked={formData.rules.nightEntryTime !== 'No Restriction' && !!formData.rules.nightEntryTime}
                                            onChange={() => updateNested('rules', 'nightEntryTime', '10:00 PM')}
                                        />
                                        Specific Time
                                    </label>
                                </div>

                                {formData.rules.nightEntryTime !== 'No Restriction' && !!formData.rules.nightEntryTime && (
                                    <div className="flex gap-2 items-center mt-2">
                                        {(() => {
                                            const timeStr = formData.rules.nightEntryTime;
                                            const parts = timeStr.match(/(\d+):(\d+)\s(AM|PM)/);
                                            const h = parts ? parts[1] : '10';
                                            const m = parts ? parts[2] : '00';
                                            const p = parts ? parts[3] : 'PM';

                                            const updateTime = (newH: string, newM: string, newP: string) => {
                                                updateNested('rules', 'nightEntryTime', `${newH}:${newM} ${newP}`);
                                            };

                                            return (
                                                <>
                                                    <select className="input" style={{ width: '80px', padding: '0.5rem' }} value={h} onChange={e => updateTime(e.target.value, m, p)}>
                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                                                            const val = num < 10 ? `0${num}` : `${num}`;
                                                            return <option key={val} value={val}>{val}</option>;
                                                        })}
                                                    </select>
                                                    <span>:</span>
                                                    <select className="input" style={{ width: '80px', padding: '0.5rem' }} value={m} onChange={e => updateTime(h, e.target.value, p)}>
                                                        {['00', '15', '30', '45'].map(val => (
                                                            <option key={val} value={val}>{val}</option>
                                                        ))}
                                                    </select>
                                                    <select className="input" style={{ width: '80px', padding: '0.5rem' }} value={p} onChange={e => updateTime(h, m, e.target.value)}>
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                    </select>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                            <label className="label">Visitor Policy
                                <select className="input" value={formData.rules.visitorPolicy} onChange={e => updateNested('rules', 'visitorPolicy', e.target.value)}>
                                    <option value="not_allowed">Not Allowed</option>
                                    <option value="allowed">Allowed</option>
                                </select>
                            </label>
                            <label className="label">Smoking/Drinking
                                <select className="input" value={formData.rules.smokingDrinking} onChange={e => updateNested('rules', 'smokingDrinking', e.target.value)}>
                                    <option value="not_allowed">Not Allowed</option>
                                    <option value="allowed">Allowed</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={nextStep}>Next</button>
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div>
                        <h2>Photos</h2>
                        <p className="mb-2 text-sm text-gray-600">Upload 3-6 photos. Max 6 photos allowed.</p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4">
                            <p className="text-sm text-yellow-700">
                                Note: The first image selected will be used as the cover image.
                            </p>
                        </div>
                        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="mb-4" disabled={formData.photos.length >= 6} />
                        {uploading && <p>Uploading...</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {formData.photos.map((url, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '240px', height: '180px' }}>
                                    <img src={url} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent)', boxShadow: idx === 0 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none' }} />
                                    {idx === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.75rem', padding: '4px', textAlign: 'center', fontWeight: '500', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>Cover Image</span>}
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))}
                                        style={{ position: 'absolute', top: -8, right: -8, background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={validateStep6}>Next</button>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div>
                        <h2>Contact Details</h2>
                        <div className="flex flex-col gap-4 mt-4">
                            <label className="label">Phone Number
                                <div className="flex items-center gap-2">
                                    <span className="p-3 bg-gray-100 border rounded text-gray-600 h-[46px] flex items-center">+91</span>
                                    <input
                                        className="input"
                                        type="tel"
                                        value={formData.contact.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData(prev => ({
                                                ...prev,
                                                contact: {
                                                    ...prev.contact,
                                                    phone: val,
                                                    whatsapp: isWhatsappSame ? val : prev.contact.whatsapp
                                                }
                                            }));
                                        }}
                                        placeholder="Enter 10-digit number"
                                    />
                                </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer my-2">
                                <input
                                    type="checkbox"
                                    checked={isWhatsappSame}
                                    onChange={(e) => {
                                        setIsWhatsappSame(e.target.checked);
                                        if (e.target.checked) {
                                            updateNested('contact', 'whatsapp', formData.contact.phone);
                                        }
                                    }}
                                />
                                <span className="text-sm">WhatsApp number same as Phone Number</span>
                            </label>

                            <label className="label">WhatsApp Number
                                <div className="flex items-center gap-2">
                                    <span className="p-3 bg-gray-100 border rounded text-gray-600 h-[46px] flex items-center">+91</span>
                                    <input
                                        className="input"
                                        type="tel"
                                        value={formData.contact.whatsapp}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            updateNested('contact', 'whatsapp', val);
                                        }}
                                        placeholder="Enter 10-digit number"
                                        disabled={isWhatsappSame}
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={validateStep7}>Next</button>
                        </div>
                    </div>
                )}

                {step === 8 && (
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Review & Submit</h2>

                        {/* Basic Info */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>Basic Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>PG Name</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{formData.pgName}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Submitted By</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>{formData.submittedBy}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Location</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{formData.area}, {formData.city}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Landmark</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{formData.landmark || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Gender Allowed</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>{formData.genderType}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Security Deposit</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>₹{formData.securityDeposit || '0'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>Room Configurations</h3>
                            {formData.rooms.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                    {formData.rooms.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Room Type</div>
                                                <div style={{ textTransform: 'capitalize', fontWeight: '600', fontSize: '15px', color: '#111827', marginBottom: '12px' }}>{r.roomType.replace(/_/g, ' ')}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Monthly Rent</div>
                                                <div style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '20px' }}>₹{r.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <div style={{ color: '#6b7280', fontSize: '14px' }}>No rooms added</div>}
                        </div>

                        {/* Facilities */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>Facilities</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Object.entries(formData.facilities).filter(([_, v]) => v).map(([k]) => (
                                    <span key={k} style={{ padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '50px', fontSize: '14px', textTransform: 'capitalize', fontWeight: '500', color: 'var(--primary-text)' }}>
                                        {k.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                ))}
                                {Object.values(formData.facilities).every(v => !v) && <span style={{ color: '#6b7280', fontSize: '14px' }}>No facilities selected</span>}
                            </div>
                        </div>

                        {/* Rules */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>House Rules</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Night Entry</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600' }}>{formData.rules.nightEntryTime || 'No Restriction'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Visitors</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>{formData.rules.visitorPolicy.replace('_', ' ')}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Smoking/Drinking</div>
                                    <div style={{ fontSize: '16px', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>{formData.rules.smokingDrinking.replace('_', ' ')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Photos */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>Photos ({formData.photos.length})</h3>
                            {formData.photos.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: '16px' }}>
                                    {formData.photos.map((url, idx) => (
                                        <div key={idx} style={{ position: 'relative', width: '240px', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                                            <img src={url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {idx === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px', fontSize: '12px', textAlign: 'center', fontWeight: '600', letterSpacing: '0.5px' }}>COVER IMAGE</div>}
                                        </div>
                                    ))}
                                </div>
                            ) : <div style={{ color: '#6b7280', fontSize: '14px' }}>No photos uploaded</div>}
                        </div>

                        {/* Contact */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', display: 'inline-block' }}>Contact Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ fontSize: '24px' }}>📞</div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                                        <div style={{ fontWeight: '600', fontSize: '18px', color: '#111827' }}>+91 {formData.contact.phone}</div>
                                    </div>
                                </div>
                                {formData.contact.whatsapp && (
                                    <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '24px' }}>💬</div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp Number</div>
                                            <div style={{ fontWeight: '600', fontSize: '18px', color: '#111827' }}>+91 {formData.contact.whatsapp}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button className="btn btn-secondary w-full" onClick={prevStep}>Back</button>
                            <button className="btn w-full" onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit PG'}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
