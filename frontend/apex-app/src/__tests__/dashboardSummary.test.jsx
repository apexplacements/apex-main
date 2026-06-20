import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardComp from '../admin/DashboardComp'
import HrDashboard from '../hr/HrDashboard'
import TrainerDashboard from '../trainer/TrainerDashboard'
import StudentDashboard from '../student/StudentDashboard'
import PlacementOfficerDashboardComp from '../placementcell/PlacementOfficerDashboardComp'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

const mockSummary = {
  total_students: 42,
  total_trainers: 7,
  total_companies: 13,
  total_placements: 5,
  total_jobs: 9
}

vi.mock('../../apiClient', () => ({
  get: async (url) => {
    if (url === '/api/dashboard/stats') {
      return { data: { success: true, data: { summary: mockSummary, recent_placements: [], top_companies: [], recent_students: [], active_batches: [] } } }
    }
    // Return generic successful responses for other endpoints used by dashboards
    return { data: { success: true, data: [] } }
  }
}))

describe('Dashboards render admin summary', () => {
  beforeEach(() => {
    // ensure sessionStorage has users for trainer/student dashboards
    sessionStorage.setItem('currentUser', JSON.stringify({ id: 1, role: 'student', user_name: 'Test Student' }))
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('Admin Dashboard shows summary counts', async () => {
    render(<MemoryRouter><DashboardComp /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Students')).toBeInTheDocument())
    expect(screen.getByText(String(mockSummary.total_students))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_trainers))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_companies))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_placements))).toBeInTheDocument()
  })

  it('HR Dashboard renders summary (via admin stats)', async () => {
    render(<MemoryRouter><HrDashboard /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Total Students')).toBeInTheDocument())
    expect(screen.getByText(String(mockSummary.total_students))).toBeInTheDocument()
  })

  it('Trainer Dashboard displays admin summary strip', async () => {
    render(<MemoryRouter><TrainerDashboard /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Trainer Dashboard')).toBeInTheDocument())
    expect(screen.getByText(String(mockSummary.total_students))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_trainers))).toBeInTheDocument()
  })

  it('Student Dashboard displays admin summary bar', async () => {
    render(<MemoryRouter><StudentDashboard /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Welcome,')).toBeInTheDocument())
    expect(screen.getByText(String(mockSummary.total_students))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_placements))).toBeInTheDocument()
  })

  it('Placement Officer Dashboard shows counts', async () => {
    render(<MemoryRouter><PlacementOfficerDashboardComp /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Placement Officer Dashboard')).toBeInTheDocument())
    expect(screen.getByText(String(mockSummary.total_students))).toBeInTheDocument()
    expect(screen.getByText(String(mockSummary.total_companies))).toBeInTheDocument()
  })
})
