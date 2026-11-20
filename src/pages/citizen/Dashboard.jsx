import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { selectAllComplaints, selectComplaintLoading } from '../../store/slices/complaintSlice';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiHeart,
  FiMapPin,
  FiPlusCircle,
  FiArrowRight,
  FiCompass
} from 'react-icons/fi';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const complaints = useSelector(selectAllComplaints);
  const loading = useSelector(selectComplaintLoading);

  // Compute citizen statistics from live Redux state
  const { myComplaints, supportedComplaints, stats } = useMemo(() => {
    if (!user) return { myComplaints: [], supportedComplaints: [], stats: { total: 0, inProgress: 0, resolved: 0, supported: 0 } };

    const mine = complaints.filter((c) => c.userId === user.id || c.ownerId === user.id);
    const supported = complaints.filter(
      (c) => c.supporters && c.supporters.includes(user.id) && c.userId !== user.id && c.ownerId !== user.id
    );

    return {
      myComplaints: mine,
      supportedComplaints: supported,
      stats: {
        total: mine.length,
        inProgress: mine.filter((c) => c.status === 'In Progress').length,
        resolved: mine.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
        supported: supported.length
      }
    };
  }, [complaints, user]);

  if (loading && complaints.length === 0) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Citizen';

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      <header className="mb-xl flex justify-between items-center flex-wrap gap-md">
        <div>
          <h2>Good day, {firstName} 👋</h2>
          <p className="text-muted">
            Track your civic reports, community upvotes, and municipal resolutions.
          </p>
        </div>
        <Link to="/report" className="btn btn-primary flex items-center gap-xs">
          <FiPlusCircle /> Report New Issue
        </Link>
      </header>

      {/* Dynamic Metric Cards */}
      <div
        className="grid-cards mb-xl"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div className="card flex items-center gap-md">
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-info-light)',
              color: 'var(--color-info)',
              borderRadius: '50%',
              display: 'flex'
            }}
          >
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              My Complaints
            </p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '2px' }}>{stats.total}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-warning-light)',
              color: 'var(--color-warning)',
              borderRadius: '50%',
              display: 'flex'
            }}
          >
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              In Progress
            </p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '2px' }}>{stats.inProgress}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              borderRadius: '50%',
              display: 'flex'
            }}
          >
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Resolved Issues
            </p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '2px' }}>{stats.resolved}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              color: 'var(--color-danger)',
              borderRadius: '50%',
              display: 'flex'
            }}
          >
            <FiHeart size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Supported
            </p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '2px' }}>{stats.supported}</h3>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="mb-md flex justify-between items-center">
        <h3>Recent Complaints Filed</h3>
        {myComplaints.length > 0 && (
          <Link
            to="/my-complaints"
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            View All ({myComplaints.length})
          </Link>
        )}
      </div>

      {myComplaints.length === 0 ? (
        <EmptyState
          title="No complaints submitted yet"
          description="Spot a pothole, broken streetlight, or garbage pile? Report it now and help make your ward cleaner and safer."
          actionLabel="Report Your First Issue"
          actionLink="/report"
        />
      ) : (
        <div className="flex-col gap-md">
          {myComplaints.slice(0, 4).map((complaint) => (
            <div
              key={complaint.id}
              className="card flex justify-between items-center"
              style={{ flexWrap: 'wrap', gap: '1rem' }}
            >
              <div className="flex-col gap-xs" style={{ flex: 1, minWidth: '240px' }}>
                <div className="flex items-center gap-sm flex-wrap">
                  <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                    #{complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                  <span className="badge badge-neutral">{complaint.category}</span>
                </div>

                <h4 style={{ margin: '0.25rem 0' }}>{complaint.title}</h4>

                <div
                  className="flex items-center gap-md text-muted flex-wrap"
                  style={{ fontSize: '0.85rem' }}
                >
                  <div className="flex items-center gap-xs">
                    <FiMapPin /> <span>{complaint.location?.address || complaint.address}</span>
                  </div>
                  {(complaint.landmark || complaint.location?.landmark) && (
                    <>
                      <div>•</div>
                      <span style={{ color: '#0369a1', fontWeight: 500 }}>
                        Near: {complaint.landmark || complaint.location?.landmark}
                      </span>
                    </>
                  )}
                  <div>•</div>
                  <div>Filed {formatDate(complaint.createdAt)}</div>
                  <div>•</div>
                  <div className="flex items-center gap-xs text-danger">
                    <FiHeart /> <span>{complaint.supportCount || 1} supporters</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to={`/complaint/${complaint.id}`}
                  className="btn btn-outline flex items-center gap-xs"
                >
                  Track Status <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
