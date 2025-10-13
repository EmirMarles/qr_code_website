import React, { useState } from 'react';
import './StaffSelection.css';

const StaffSelection = ({ staff, onSelectStaff, selectedStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleStaffSelect = (staffMember) => {
    onSelectStaff(staffMember);
    setIsCollapsed(true);
  };

  const handleChangeStaff = () => {
    setIsCollapsed(false);
  };

  const filteredStaff = staff?.filter(staffMember =>
    staffMember.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const displayedStaff = showAll ? filteredStaff : filteredStaff.slice(0, 6);

  if (!staff || staff.length === 0) {
    return (
      <div className="staff-selection">
        <h3>Выберите мастера</h3>
        <div className="no-staff">
          <p>Мастера не доступны в данный момент.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-selection">
      <div className="section-header">
        <div className="section-title">
          <h3>Выберите мастера</h3>
          {selectedStaff && (
            <button className="change-btn" onClick={handleChangeStaff}>
              Изменить
            </button>
          )}
        </div>
        <p className="section-description">Выберите мастера для записи</p>
      </div>

      {selectedStaff && isCollapsed ? (
        <div className="selected-staff-display">
          <div className="selected-staff-item">
            <div className="staff-content">
              <h4>Мастер</h4>
              <div className="staff-details">
                <span className="selected-staff-name">{selectedStaff.fullName || 'Staff Member'}</span>
                {selectedStaff.position && (
                  <span className="selected-staff-position">{selectedStaff.position}</span>
                )}
              </div>
            </div>
            <div className="selection-checkmark">✓</div>
          </div>
        </div>
      ) : (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск мастеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="staff-list">
            {filteredStaff.map(staffMember => (
              <div 
                key={staffMember._id}
                className={`staff-list-item ${selectedStaff?._id === staffMember._id ? 'selected' : ''}`}
                onClick={() => handleStaffSelect(staffMember)}
              >
                <div className="staff-avatar-small">
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
                  <div className="default-avatar-small" style={{ display: staffMember.photos?.avatar?.url ? 'none' : 'flex' }}>
                    {staffMember.fullName?.charAt(0) || 'S'}
                  </div>
                </div>
                <div className="staff-content">
                  <h4>{staffMember.fullName || 'Staff Member'}</h4>
                  {staffMember.position && (
                    <p className="staff-position">{staffMember.position}</p>
                  )}
                </div>
                {selectedStaff?._id === staffMember._id && (
                  <div className="selection-checkmark-small">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffSelection;
