import React, { useEffect, useState } from 'react';
import api from '../apiClient';
import useSiteSummary from '../hooks/useSiteSummary';
import { Link, useNavigate } from 'react-router-dom';
import './PlacementOfficerStyles.css';
import PlacementLayout from './PlacementLayout';

const StatCard = ({label, value}) => (
  <div className="po-card">
    <div className="po-value">{value}</div>
    <div className="po-label">{label}</div>
  </div>
);

export default function PlacementOfficerDashboardComp(){
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/');
  };
  // load real stats from API
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    placedStudents: 0,
    activeDrives: 0,
    companies: 0,
    interviewsScheduled: 0,
    offersReleased: 0,
    placementPercent: '0%'
  });

  React.useEffect(()=>{
    let mounted=true;
    const fetch = async ()=>{
      try{
        const [companiesRes, drivesRes, studentsRes, offersRes, interviewsRes, placedRes] = await Promise.all([
          api.get('/companies'),
          api.get('/placement-drives'),
          api.get('/students'),
          api.get('/offers'),
          api.get('/interviews'),
          api.get('/placed-students'),
        ]);

        if(!mounted) return;
        const totalStudents = (studentsRes.data && studentsRes.data.data) ? studentsRes.data.data.length : 0;
        const companies = (companiesRes.data && companiesRes.data.data) ? companiesRes.data.data.length : 0;
        const activeDrives = (drivesRes.data && drivesRes.data.data) ? drivesRes.data.data.length : 0;
        const offersReleased = (offersRes.data && offersRes.data.data) ? offersRes.data.data.length : 0;
        const interviewsScheduled = (interviewsRes.data && interviewsRes.data.data) ? interviewsRes.data.data.length : 0;
        const placedStudents = (placedRes.data && placedRes.data.data) ? placedRes.data.data.length : 0;

        const placementPercent = totalStudents ? Math.round((placedStudents/totalStudents)*100) + '%' : '0%';
        setStats({ totalStudents, placedStudents, activeDrives, companies, interviewsScheduled, offersReleased, placementPercent });
      }catch(e){
        console.error('Failed to load placement stats',e);
      }
    };
    fetch();
    return ()=> mounted=false;
  },[]);

  

  const { summary: siteSummary } = useSiteSummary();

  React.useEffect(() => {
    if (!siteSummary) return;
    setStats((prev) => {
      const total = siteSummary.total_students || prev.totalStudents;
      const placed = siteSummary.total_placements || prev.placedStudents;
      const companiesCount = siteSummary.total_companies || prev.companies;
      const interviewsCount = siteSummary.total_interviews || prev.interviewsScheduled;
      const offersCount = siteSummary.total_offers || prev.offersReleased;
      const percent = total ? Math.round((placed/total)*100) + '%' : '0%';
      return { totalStudents: total, placedStudents: placed, activeDrives: prev.activeDrives, companies: companiesCount, interviewsScheduled: interviewsCount, offersReleased: offersCount, placementPercent: percent };
    });
  }, [siteSummary]);

  return (
    <PlacementLayout title="Placement Officer Dashboard">
      <div className="po-grid">
        <StatCard label="Total Students" value={stats.totalStudents} />
        <StatCard label="Placed Students" value={stats.placedStudents} />
        <StatCard label="Active Placement Drives" value={stats.activeDrives} />
        <StatCard label="Companies Registered" value={stats.companies} />
        <StatCard label="Interviews Scheduled" value={stats.interviewsScheduled} />
        <StatCard label="Offers Released" value={stats.offersReleased} />
        <StatCard label="Placement Percentage" value={stats.placementPercent} />
      </div>
    </PlacementLayout>
  );
}
