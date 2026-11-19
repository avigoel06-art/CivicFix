import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import {
  selectAllComplaints,
  selectComplaintLoading,
  updateComplaintStatus,
  supportComplaint
} from '../../store/slices/complaintSlice';
import { addToast } from '../../store/slices/uiSlice';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiHeart,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiClock
} from 'react-icons/fi';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const complaints = useSelector(selectAllComplaints);
  const loading = useSelector(selectComplaintLoading);
  const complaint = complaints.find((c) => c.id === id);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null, // 'close' | 'reopen'
    note: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' && id) {
      navigate(`/admin/complaint/${id}`, { replace: true });
    } else if (user?.role === 'official' && id) {
      navigate(`/official/complaint/${id}`, { replace: true });
    }
  }, [user, id, navigate]);

  if (!complaint) {
    if (loading) {
      return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <LoadingSpinner text={`Locating complaint #${id}...`} />
        </div>
      );
    }
    return (
      <div className="container" style={{ padding: '3rem 0', maxWidth: '600px', margin: '0 auto' }}>
        <div className="card text-center flex-col items-center gap-md" style={{ padding: '3rem 2rem' }}>
          <FiAlertTriangle size={48} color="#f59e0b" />
          <h3>Complaint #{id} Not Found</h3>
          <p className="text-muted">
            The civic issue you are looking for may have been deleted, moved, or the link is invalid.
          </p>
          <Link to="/my-complaints" className="btn btn-primary mt-sm flex items-center gap-xs">
            <FiArrowLeft /> Return to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  const isSupporter = user && complaint.supporters && complaint.supporters.includes(user.id);
  const isAuthor = user && (complaint.userId === user.id || complaint.ownerId === user.id);

  const handleToggleSupport = async () => {
    if (!user) return;
    try {
      await dispatch(supportComplaint({ id: complaint.id, userId: user.id })).unwrap();
      dispatch(addToast({
        type: 'success',
        title: isSupporter ? 'Support Removed' : 'Issue Supported!',
        message: isSupporter
          ? 'You un-voted this civic issue.'
          : 'Thank you for supporting this issue! Higher upvotes alert officials faster.'
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        title: 'Error',
        message: err || 'Could not update support'
      }));
    }
  };

  const handleConfirmAction = async () => {
    setIsUpdating(true);
    const isFixed = confirmModal.action === 'close';
    const nextStatus = isFixed ? 'Closed' : 'Reopened';
    const defaultNote = isFixed
      ? (confirmModal.note.trim() || 'Citizen confirmed issue has been satisfactorily resolved.')
      : (confirmModal.note.trim() || 'Citizen reported the issue was not actually fixed and reopened the ticket.');

    try {
      await dispatch(
        updateComplaintStatus({
          id: complaint.id,
          newStatus: nextStatus,
          officialId: null,
          note: defaultNote
        })
      ).unwrap();

      dispatch(addToast({
        type: isFixed ? 'success' : 'warning',
        title: isFixed ? 'Issue Closed' : 'Issue Reopened',
        message: isFixed
          ? 'Thank you for confirming the resolution with municipal officials!'
          : 'Complaint returned to active queue for re-inspection.'
      }));

      setConfirmModal({ isOpen: false, action: null, note: '' });
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        title: 'Update Failed',
        message: err || 'Could not update status'
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      <Link to="/my-complaints" className="btn btn-ghost mb-md flex items-center gap-xs">
        <FiArrowLeft /> Back to Complaints List
      </Link>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-lg flex-wrap gap-md">
        <div>
          <div className="flex items-center gap-sm mb-xs flex-wrap">
            <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>
              #{complaint.id}
            </span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <span className="badge badge-neutral">{complaint.category}</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{complaint.title}</h2>

          <div
            className="flex items-center gap-md text-muted mt-sm flex-wrap"
            style={{ fontSize: '0.9rem' }}
          >
            <span className="flex items-center gap-xs">
              <FiMapPin /> {complaint.location?.address || complaint.address}
            </span>
            {(complaint.landmark || complaint.location?.landmark) && (
              <>
                <span>•</span>
                <span style={{ color: '#0369a1', fontWeight: 500 }}>
                  Near: {complaint.landmark || complaint.location?.landmark}
                </span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-xs">
              <FiCalendar /> Filed {formatDate(complaint.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-xs">
              <FiUser /> {complaint.supportCount || 1} Community Supporters
            </span>
          </div>
        </div>

        {/* Support Button */}
        <div>
          <button
            type="button"
            className={`btn ${isSupporter ? 'btn-primary' : 'btn-outline'} flex items-center gap-xs`}
            onClick={handleToggleSupport}
          >
            <FiHeart style={{ fill: isSupporter ? 'currentColor' : 'none' }} />
            {isSupporter ? 'Supported' : 'Support Issue'} ({complaint.supportCount || 1})
          </button>
        </div>
      </div>

      <div
        className="grid-cards"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)',
          gap: '1.5rem'
        }}
      >
        {/* Left Column: Details & Evidence */}
        <div className="flex-col gap-lg">
          <div className="card">
            <h3 className="mb-sm">Description</h3>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--color-text)' }}>
              {complaint.description}
            </p>

            <div
              className="mt-md pt-md"
              style={{
                borderTop: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem'
              }}
            >
              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Nearest Landmark:</span>
                <p style={{ fontWeight: 600 }}>{complaint.landmark || complaint.location?.landmark || 'None specified'}</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Severity:</span>
                <p style={{ fontWeight: 600 }}>{complaint.severity || 'Medium'}</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Duration:</span>
                <p style={{ fontWeight: 600 }}>{complaint.duration || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Coordinates:</span>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {complaint.location?.lat ? `${Number(complaint.location.lat).toFixed(4)}, ${Number(complaint.location.lng).toFixed(4)}` : 'No GPS pinned'}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Comparison Card */}
          {(complaint.evidenceUrl || complaint.resolutionEvidence) && (
            <div className="card">
              <h3 className="mb-md">Photographic Evidence</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    complaint.evidenceUrl && complaint.resolutionEvidence
                      ? '1fr 1fr'
                      : '1fr',
                  gap: '1.25rem'
                }}
              >
                {complaint.evidenceUrl && (
                  <div className="flex-col gap-xs">
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--color-text-light)',
                        textTransform: 'uppercase'
                      }}
                    >
                      Reported by Citizen
                    </span>
                    <img
                      src={complaint.evidenceUrl}
                      alt="Citizen evidence"
                      style={{
                        width: '100%',
                        maxHeight: '260px',
                        objectFit: 'cover',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </div>
                )}

                {complaint.resolutionEvidence && (
                  <div className="flex-col gap-xs">
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        textTransform: 'uppercase'
                      }}
                    >
                      Official Proof of Work
                    </span>
                    <img
                      src={complaint.resolutionEvidence}
                      alt="Resolution evidence"
                      style={{
                        width: '100%',
                        maxHeight: '260px',
                        objectFit: 'cover',
                        borderRadius: 'var(--border-radius-md)',
                        border: '2px solid var(--color-success-light)'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Citizen Resolution Confirmation Prompt - Author Only */}
          {complaint.status === 'Resolved' && isAuthor && (
            <div
              className="card"
              style={{
                borderLeft: '5px solid var(--color-success)',
                backgroundColor: 'var(--color-success-light)'
              }}
            >
              <div className="flex items-start gap-md">
                <FiInfo size={26} color="#065f46" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#065f46', marginBottom: '0.25rem' }}>
                    Has this issue been fixed on the ground?
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.92rem', marginBottom: '1rem' }}>
                    The assigned municipal department has marked this civic issue as resolved.
                    As the citizen reporter, please confirm whether the problem is fixed or still exists.
                  </p>
                  <div className="flex gap-md flex-wrap">
                    <button
                      type="button"
                      className="btn btn-success flex items-center gap-xs"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          action: 'close',
                          note: 'Citizen confirmed work complete.'
                        })
                      }
                    >
                      <FiCheckCircle /> Yes, Problem Fixed (Close Ticket)
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger-outline flex items-center gap-xs"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          action: 'reopen',
                          note: 'Citizen inspected location and problem is still unresolved.'
                        })
                      }
                    >
                      <FiAlertTriangle /> No, Problem Still Exists (Reopen)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit Timeline */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 className="mb-md flex items-center gap-xs">
              <FiClock /> Audit Timeline
            </h3>

            <div
              className="timeline"
              style={{
                position: 'relative',
                paddingLeft: '24px',
                borderLeft: '2px solid #e2e8f0',
                marginLeft: '10px'
              }}
            >
              {complaint.timeline && complaint.timeline.length > 0 ? (
                complaint.timeline.map((item, index) => {
                  const isLatest = index === complaint.timeline.length - 1;
                  return (
                    <div
                      key={index}
                      className="timeline-item mb-md"
                      style={{ position: 'relative' }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '3px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: isLatest ? 'var(--color-secondary)' : '#94a3b8',
                          border: '3px solid #ffffff',
                          boxShadow: '0 0 0 1px #cbd5e1'
                        }}
                      ></div>
                      <div className="flex items-center justify-between gap-xs">
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {item.status}
                        </span>
                        <span
                          className="badge badge-neutral"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {item.actor || 'System'}
                        </span>
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.78rem', margin: '2px 0' }}>
                        {new Date(item.timestamp).toLocaleString()}
                        {item.officialId ? ` • ID: ${item.officialId}` : ''}
                      </p>
                      {item.note && (
                        <p
                          style={{
                            fontSize: '0.88rem',
                            marginTop: '4px',
                            color: 'var(--color-text)',
                            backgroundColor: '#f8fafc',
                            padding: '6px 10px',
                            borderRadius: '4px'
                          }}
                        >
                          {item.note}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted">No timeline entries recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, note: '' })}
        title={
          confirmModal.action === 'close'
            ? 'Confirm Ticket Resolution'
            : 'Reopen Civic Complaint'
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setConfirmModal({ isOpen: false, action: null, note: '' })}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn ${confirmModal.action === 'close' ? 'btn-success' : 'btn-danger'}`}
              onClick={handleConfirmAction}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="flex items-center gap-xs">
                  <span className="spinner spinner-sm"></span> Submitting...
                </span>
              ) : confirmModal.action === 'close' ? (
                'Confirm & Close Ticket'
              ) : (
                'Reopen Complaint'
              )}
            </button>
          </>
        }
      >
        <p className="mb-sm">
          {confirmModal.action === 'close'
            ? 'Closing this ticket acknowledges that municipal repairs were completed satisfactorily.'
            : 'Reopening this ticket will notify department supervisors that the issue persists and requires urgent re-inspection.'}
        </p>

        <div className="form-group mt-sm">
          <label className="form-label">Feedback / Inspection Note</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder={
              confirmModal.action === 'close'
                ? 'Optional: Thank the crew or add details on completed repair...'
                : 'Explain what is still broken or unsafe...'
            }
            value={confirmModal.note}
            onChange={(e) =>
              setConfirmModal({ ...confirmModal, note: e.target.value })
            }
          ></textarea>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintDetails;