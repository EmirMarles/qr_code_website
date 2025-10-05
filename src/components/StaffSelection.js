import React from 'react';
import './StaffSelection.css';

const StaffSelection = ({ staff, onSelectStaff, selectedStaff }) => {
  const handleStaffSelect = (staffMember) => {
    onSelectStaff(staffMember);
  };

  if (!staff || staff.length === 0) {
    return (
      <div className="staff-selection">
        <h3>Choose a Staff Member</h3>
        <div className="no-staff">
          <p>No staff members available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-selection">
      <h3>Choose a Staff Member</h3>
      <p className="section-description">Select your preferred staff member</p>
      
      <div className="staff-grid">
        {staff.map(staffMember => (
          <div 
            key={staffMember._id}
            className={`staff-card ${selectedStaff?._id === staffMember._id ? 'selected' : ''}`}
            onClick={() => handleStaffSelect(staffMember)}
          >
            <div className="staff-avatar">
              {staffMember.photos?.avatar?.url ? (
                <img 
                  src={staffMember.photos.avatar.url} 
                  alt={staffMember.fullName}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="default-avatar" style={{ display: staffMember.photos?.avatar?.url ? 'none' : 'flex' }}>
                {staffMember.fullName?.charAt(0) || 'S'}
              </div>
            </div>
            <div className="staff-info">
              <h4>{staffMember.fullName || 'Staff Member'}</h4>
              {staffMember.position && (
                <p className="staff-position">{staffMember.position}</p>
              )}
              {staffMember.bio && (
                <p className="staff-bio">{staffMember.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSelection;
