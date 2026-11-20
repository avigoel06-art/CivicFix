import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { selectAllComplaints, selectComplaintLoading } from '../../store/slices/complaintSlice';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, sortComplaints } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiMapPin, FiCalendar, FiSearch, FiX, FiArrowRight, FiInfo } from 'react-icons/fi';

const TABS = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed'];
const CATEGORIES = [
  'All',
  'Street Light',
  'Garbage',
  'Road Damage',
  'Water Supply',
  'Electricity',
  'Drainage',
  'Public Safety',
  'Other'
];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

const MyComplaints = () => {
  const { user } = useAuth();
  const allComplaints = useSelector(selectAllComplaints);
  const loading = useSelector(selectComplaintLoading);

  const [activeTab, setActiveTab] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Strictly filter complaints where the citizen is the author/owner
  const myAuthoredComplaints = useMemo(() => {
    if (!user) return [];
    return allComplaints.filter(
      (c) => c.userId === user.id || c.ownerId === user.id
    );
  }, [allComplaints, user]);

  // Apply search, filters, tab, and sorting
  const filteredList = useMemo(() => {
    const searchLower = debouncedSearch.trim().toLowerCase();

    const filtered = myAuthoredComplaints.filter((c) => {
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

      // Search filter
      if (searchLower) {
        const idMatch = c.id.toLowerCase().includes(searchLower);
        const titleMatch = c.title.toLowerCase().includes(searchLower);
        const addrMatch = c.location?.address && c.location.address.toLowerCase().includes(searchLower);
        const landmarkMatch =
          (c.landmark && c.landmark.toLowerCase().includes(searchLower)) ||
          (c.location?.landmark && c.location.landmark.toLowerCase().includes(searchLower));

        if (!idMatch && !titleMatch && !addrMatch && !landmarkMatch) return false;
      }

      return true;
    });

    return sortComplaints(filtered, sortBy);
  }, [myAuthoredComplaints, activeTab, debouncedSearch, selectedCategory, selectedPriority, sortBy]);

  // Paginated slice
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage]);

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

  if (loading && myAuthoredComplaints.length === 0) {
    return <LoadingSpinner text="Loading your complaints..." />;
  }

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      {/* Information Banner clarifying strictly personal submissions */}
      <div
        className="card mb-lg"
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem'
        }}
      >
        <div className="flex items-center gap-sm">
          <FiInfo size={22} color="var(--color-primary)" />
          <div>
            <h4 style={{ margin: '0 0 0.2rem', color: 'var(--color-heading)' }}>
              My Submissions ({myAuthoredComplaints.length} Total)
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Showing only civic issues filed directly by your account.
            </p>
          </div>
        </div>
        <div className="flex gap-sm">
          <Link to="/all-complaints" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Browse All Community Complaints
          </Link>
          <Link to="/report" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Report New Issue
          </Link>
        </div>
      </div>

      <header className="mb-lg flex justify-between items-center flex-wrap gap-md">
        <div>
          <h2>My Submitted Complaints</h2>
          <p className="text-muted">
            Track resolution status and official actions taken on your reported issues.
          </p>
        </div>
      </header>

      {/* Status Tabs Navigation */}
      <div className="tabs-nav" role="tablist">
        {TABS.map((tab) => {
          const count =
            tab === 'All'
              ? myAuthoredComplaints.length
              : myAuthoredComplaints.filter((c) => c.status.toLowerCase() === tab.toLowerCase()).length;

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

      {/* Filter and Search Bar */}
      <div className="card mb-lg flex gap-md flex-wrap items-center">
        {/* Search Input with Debounce */}
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
            placeholder="Search by ID, title, landmark, or address..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Category Dropdown */}
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

        {/* Priority Dropdown */}
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

        {/* Sort Dropdown */}
        <div style={{ minWidth: '150px' }}>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority</option>
            <option value="supports">Most Supported</option>
          </select>
        </div>

        {/* Clear Filters Button */}
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

      {/* Complaint Cards List */}
      {paginatedItems.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No complaints match your filters' : "You haven't reported any issues yet"}
          description={
            hasActiveFilters
              ? 'Try resetting your search query or status filter to view other complaints.'
              : 'Spot an issue in your neighborhood? Click below to file a civic complaint.'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : 'Report an Issue'}
          actionLink={hasActiveFilters ? null : '/report'}
          onAction={hasActiveFilters ? handleClearFilters : null}
        />
      ) : (
        <div className="flex-col gap-md">
          <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.85rem' }}>
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredList.length)}–
              {Math.min(currentPage * pageSize, filteredList.length)} of {filteredList.length} complaints submitted by you
            </span>
          </div>

          {paginatedItems.map((complaint) => {
            const landmark = complaint.landmark || complaint.location?.landmark;

            return (
              <div
                key={complaint.id}
                className="card flex justify-between items-center"
                style={{ flexWrap: 'wrap', gap: '1rem' }}
              >
                <div className="flex-col gap-sm" style={{ flex: 1, minWidth: '260px' }}>
                  <div className="flex items-center gap-sm flex-wrap">
                    <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                      #{complaint.id}
                    </span>
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                    <span className="badge badge-neutral">{complaint.category}</span>
                  </div>

                  <h3 style={{ margin: '0.2rem 0' }}>{complaint.title}</h3>

                  <div
                    className="flex items-center gap-md text-muted flex-wrap"
                    style={{ fontSize: '0.88rem' }}
                  >
                    <div className="flex items-center gap-xs">
                      <FiMapPin /> <span>{complaint.location?.address || complaint.address || 'Address provided'}</span>
                    </div>
                    {landmark && (
                      <>
                        <div>•</div>
                        <span style={{ color: '#0369a1', fontWeight: 500 }}>
                          Near: {landmark}
                        </span>
                      </>
                    )}
                    <div>•</div>
                    <div className="flex items-center gap-xs">
                      <FiCalendar />{' '}
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                    <div>•</div>
                    <span>{complaint.supportCount || 1} Community Supporters</span>
                  </div>
                </div>

                <div>
                  <Link
                    to={`/complaint/${complaint.id}`}
                    className="btn btn-outline flex items-center gap-xs"
                  >
                    View Details <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredList.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
