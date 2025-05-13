"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../src/Header';
import { getCurrentUser } from '../../src/services/auth';
import { getProfile, updateProfile } from '../../src/services/api';
import { clubs } from '../../src/data/clubs';

interface ProfileData {
  name: string;
  email: string;
  photo_url: string;
  clubs: { id: string; name: string }[];
  education: {
    degree: string;
    major: string;
    graduation_year: number;
  };
  linkedin_url?: string;
  github_url?: string;
  elo_rating: number;
  match_count: number;
  experiences: { title: string; company: string }[];
  is_northeastern_verified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.profile_id);
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedProfile || !profile) return;

    try {
      const user = getCurrentUser();
      if (!user) return;

      // Filter out any empty club entries and experience entries
      const cleanedProfile = {
        ...editedProfile,
        clubs: editedProfile.clubs.filter(club => club.id !== ""),
        experiences: editedProfile.experiences.filter(exp => exp.title.trim() !== "" || exp.company.trim() !== "")
      };

      await updateProfile(user.profile_id, cleanedProfile);
      setProfile(cleanedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editedProfile) return;

    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof ProfileData;
      const parentValue = editedProfile[parentKey];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        setEditedProfile({
          ...editedProfile,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        });
      }
    } else {
      setEditedProfile({
        ...editedProfile,
        [name]: value
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-black">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto max-w-3xl px-4 py-8">
        <div className="bg-white border border-black p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Profile</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-black text-black hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Profile Picture and Stats Section */}
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="w-32">
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="w-32 h-32 object-cover border border-black"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label htmlFor="photo-upload" className="block text-sm font-medium text-black mb-1">
                      Change Photo
                    </label>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        if (!editedProfile || !e.target.files || !e.target.files[0]) return;
                        
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setEditedProfile({
                              ...editedProfile,
                              photo_url: reader.result
                            });
                          }
                        };
                        
                        reader.readAsDataURL(file);
                      }}
                      className="w-full text-sm text-black file:mr-2 file:py-1 file:px-2 file:border file:border-black file:bg-white file:text-black"
                    />
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-black mb-1">
                  Stats
                </label>
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600">ELO Rating</div>
                    <div className="text-xl font-mono text-black">{profile.elo_rating}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Matches</div>
                    <div className="text-xl font-mono text-black">{profile.match_count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="text-xl font-mono text-black">
                      {profile.is_northeastern_verified ? '✓ Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProfile?.name || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">{profile.name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <div className="text-black">{profile.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Degree
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="education.degree"
                    value={editedProfile?.education.degree || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">{profile.education.degree}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Major
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="education.major"
                    value={editedProfile?.education.major || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">{profile.education.major}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Graduation Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="education.graduation_year"
                    value={editedProfile?.education.graduation_year || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">{profile.education.graduation_year}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  LinkedIn URL
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="linkedin_url"
                    value={editedProfile?.linkedin_url || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">
                    {profile.linkedin_url ? (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.linkedin_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  GitHub URL
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="github_url"
                    value={editedProfile?.github_url || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-black text-black"
                  />
                ) : (
                  <div className="text-black">
                    {profile.github_url ? (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.github_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Clubs */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Clubs
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Select your clubs in order of involvement (up to 3)</p>
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2 font-medium text-black">{index + 1}.</span>
                      <select
                        value={editedProfile?.clubs[index]?.id || ""}
                        onChange={(e) => {
                          if (!editedProfile) return;
                          
                          const newClubs = [...(editedProfile.clubs || [])];
                          const selectedClub = clubs.find(c => c.id === e.target.value);
                          
                          if (e.target.value === "") {
                            // Remove selection
                            if (index < newClubs.length) {
                              newClubs.splice(index, 1);
                            }
                          } else if (selectedClub) {
                            // Add or replace selection
                            if (index < newClubs.length) {
                              newClubs[index] = { id: selectedClub.id, name: selectedClub.name };
                            } else {
                              // Fill any gaps with empty selections
                              while (newClubs.length < index) {
                                newClubs.push({ id: "", name: "" });
                              }
                              newClubs.push({ id: selectedClub.id, name: selectedClub.name });
                            }
                          }
                          
                          // Remove duplicates (if a club is selected in multiple dropdowns, keep only the earliest one)
                          const uniqueClubs = [];
                          const seen = new Set();
                          
                          for (const club of newClubs) {
                            if (club.id && !seen.has(club.id)) {
                              seen.add(club.id);
                              uniqueClubs.push(club);
                            }
                          }
                          
                          setEditedProfile({
                            ...editedProfile,
                            clubs: uniqueClubs
                          });
                        }}
                        className="w-full p-2 border border-black text-black"
                      >
                        <option value="">-- Select a club --</option>
                        {clubs.map((club) => {
                          // Skip clubs that are already selected in previous dropdowns
                          const isSelectedInEarlierDropdown = editedProfile?.clubs
                            .slice(0, index)
                            .some(c => c.id === club.id);
                            
                          if (isSelectedInEarlierDropdown) return null;
                          
                          return (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                profile.clubs && profile.clubs.length > 0 ? (
                  <div className="space-y-3">
                    {profile.clubs.map((club, index) => {
                      // Find full club details from clubs data
                      const clubDetails = clubs.find(c => c.id === club.id);
                      
                      return (
                        <div key={club.id} className="flex items-center p-3 border border-gray-200 rounded">
                          <span className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-full mr-3">
                            {index + 1}
                          </span>
                          {clubDetails ? (
                            <div className="flex items-center flex-1">
                              <img 
                                src={clubDetails.logo} 
                                alt={clubDetails.name} 
                                className="w-10 h-10 object-contain mr-3" 
                              />
                              <div className="flex-1">
                                <div className="font-medium text-black">{clubDetails.name}</div>
                                <a 
                                  href={clubDetails.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="font-medium text-black">{club.name}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 text-gray-500">
                    No clubs added yet.
                  </div>
                )
              )}
            </div>

            {/* Experiences */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Experiences
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Add your professional experiences</p>
                  {editedProfile?.experiences && editedProfile.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border border-gray-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Experience {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!editedProfile) return;
                            const newExperiences = [...editedProfile.experiences];
                            newExperiences.splice(index, 1);
                            setEditedProfile({
                              ...editedProfile,
                              experiences: newExperiences
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Title</label>
                        <input
                          type="text"
                          value={exp.title || ''}
                          onChange={(e) => {
                            if (!editedProfile) return;
                            const newExperiences = [...editedProfile.experiences];
                            newExperiences[index] = {
                              ...newExperiences[index],
                              title: e.target.value
                            };
                            setEditedProfile({
                              ...editedProfile,
                              experiences: newExperiences
                            });
                          }}
                          className="w-full p-2 border border-black text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => {
                            if (!editedProfile) return;
                            const newExperiences = [...editedProfile.experiences];
                            newExperiences[index] = {
                              ...newExperiences[index],
                              company: e.target.value
                            };
                            setEditedProfile({
                              ...editedProfile,
                              experiences: newExperiences
                            });
                          }}
                          className="w-full p-2 border border-black text-black"
                        />
                      </div>

                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (!editedProfile) return;
                      const newExperiences = [...(editedProfile.experiences || [])];
                      newExperiences.push({ title: '', company: '' });
                      setEditedProfile({
                        ...editedProfile,
                        experiences: newExperiences
                      });
                    }}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 mt-2"
                  >
                    Add Experience
                  </button>
                </div>
              ) : (
                profile.experiences && profile.experiences.length > 0 ? (
                  <div className="space-y-4">
                    {profile.experiences.map((exp, index) => (
                      <div key={index} className="p-4 border border-gray-200">
                        <div className="font-medium text-black">{exp.title}</div>
                        <div className="text-gray-600">{exp.company}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 text-gray-500">
                    No experiences added yet.
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 