import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllComplaints, selectComplaintLoading } from '../../store/slices/complaintSlice';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, sortComplaints } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiSearch, FiX, FiFilter, FiArrowRight } from 'react-icons/fi';

const TABS = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed', 'Escalated'];
const CATEGORIES = ['All', 'Street Light', 'Garbage', 'Road Damage', 'Water Supply', 'Electricity', 'Drainage', 'Public Safety', 'Other'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const OfficialComplaints = () => {
  const complaints = useSelector(selectAllComplaints);
  const loading = useSelector(selectComplaintLoading);

  const [activeTab, setActiveTab] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    const searchLower = debouncedSearch.trim().toLowerCase();

    const filtered = complaints.filter((c) => {
      // Tab / Status filter
      if (activeTab !== 'All' && c.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'All' && c.priority !== selectedPriority) {
        return false;
      }

      // Search match
      if (searchLower) {
        const idMatch = c.id.toLowerCase().includes(searchLower);
        const titleMatch = c.title.toLowerCase().includes(searchLower);
        const addrMatch = c.location?.address && c.location.address.toLowerCase().includes(searchLower);
        const landmarkMatch =
          (c.landmark && c.landmark.toLowerCase().includes(searchLower)) ||
          (c.location?.landmark && c.location.landmark.toLowerCase().includes(searchLower));
        const catMatch = c.category.toLowerCase().includes(searchLower);
        if (!idMatch && !titleMatch && !addrMatch && !landmarkMatch && !catMatch) return false;
      }

      return true;
    });

    return sortComplaints(filtered, sortBy);
  }, [complaints, activeTab, debouncedSearch, selectedCategory, selectedPriority, sortBy]);

  // Paginated results
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(startIndex, startIndex + pageSize);
  }, [filteredComplaints, currentPage]);

  const handleClearFilters = () => {
    setActiveTab('All');
    setSearchInput('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activeTab !== 'All' ||
    searchInput.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedPriority !== 'All' ||
    sortBy !== 'newest';

  if (loading && complaints.length === 0) {
    return <LoadingSpinner text="Loading complaint management console..." />;
  }

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      <header className="mb-lg flex justify-between items-center flex-wrap gap-md">
        <div>
          <h2>Manage Civic Complaints</h2>
          <p className="text-muted">
            Official queue: Review citizen reports, dispatch field technicians, and log resolutions.
          </p>
        </div>
        <div className="badge badge-info" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
          Total Active in Queue: {complaints.filter(c => !['Resolved', 'Closed'].includes(c.status)).length}
        </div>
      </header>

      {/* Status Tabs Navigation */}
      <div className="tabs-nav" role="tablist">
        {TABS.map((tab) => {
          const count =
            tab === 'All'
              ? complaints.length
              : complaints.filter((c) => c.status.toLowerCase() === tab.toLowerCase()).length;

          return (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="card mb-lg flex gap-md flex-wrap items-center">
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, keyword, address, or category..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '130px' }}>
          <select
            className="form-control"
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
          >
            {PRIORITIES.map((pri) => (
              <option key={pri} value={pri}>
                {pri === 'All' ? 'All Priorities' : `${pri} Priority`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '140px' }}>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Critical Priority First</option>
            <option value="supporters">Most Supported</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost flex items-center gap-xs"
            onClick={handleClearFilters}
          >
            <FiX /> Reset
          </button>
        )}
      </div>

      {/* Complaints Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>ID & Title</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Location</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Priority</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Reported Date</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((complaint) => (
                <tr
                  key={complaint.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                    <div style={{ color: 'var(--color-secondary)' }}>#{complaint.id}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-heading)', fontWeight: 500, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {complaint.title}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className="badge badge-neutral">{complaint.category}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ maxWidth: '200px', fontSize: '0.88rem' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                        {complaint.location?.address || complaint.address}
                      </div>
                      {(complaint.landmark || complaint.location?.landmark) && (
                        <div style={{ fontSize: '0.78rem', color: '#0369a1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Near: {complaint.landmark || complaint.location?.landmark}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <PriorityBadge priority={complaint.priority} />
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.88rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {formatDate(complaint.createdAt)}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Link
                      to={`/official/complaint/${complaint.id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <EmptyState
                      title="No complaints match your criteria"
                      description="Try clearing search filters or selecting another tab."
                      actionLabel={hasActiveFilters ? 'Clear Filters' : null}
                      onAction={hasActiveFilters ? handleClearFilters : null}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredComplaints.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default OfficialComplaints;