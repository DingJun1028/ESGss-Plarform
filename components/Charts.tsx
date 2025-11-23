
import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const HealthRadar = ({ data }: { data: number[] }) => {
  const chartData = {
    labels: ['環境 (E)', '社會 (S)', '治理 (G)', '創新', '再生'],
    datasets: [
      {
        label: 'ESG 體質',
        data: data,
        backgroundColor: 'rgba(42, 191, 117, 0.2)',
        borderColor: '#2ABF75',
        borderWidth: 2,
        pointBackgroundColor: '#F0AC18',
      },
    ],
  };

  return <Radar data={chartData} options={{ scales: { r: { min: 0, max: 100, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />;
};

export const StakeholderRadar = ({ data }: { data: number[] }) => {
  const chartData = {
    labels: ['政府/法規', '社會/NGO', '投資人', '供應鏈', '消費者'],
    datasets: [
      {
        label: '關注壓力指數',
        data: data,
        backgroundColor: 'rgba(240, 172, 24, 0.2)',
        borderColor: '#F0AC18',
        borderWidth: 2,
        pointBackgroundColor: '#2ABF75',
      },
    ],
  };
  
  return <Radar data={chartData} options={{ scales: { r: { min: 0, max: 100 } }, plugins: { legend: { position: 'bottom' } } }} />;
};

export const ScopeDoughnut = ({ scope1, scope2, scope3 }: { scope1: number, scope2: number, scope3: number }) => {
  const data = {
    labels: ['範疇一', '範疇二', '範疇三'],
    datasets: [
      {
        data: [scope1, scope2, scope3],
        backgroundColor: ['#EF4444', '#F59E0B', '#2ABF75'],
        borderWidth: 0,
      },
    ],
  };
  return <Doughnut data={data} options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />;
};

export const TrendBar = () => {
  const data = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: '減碳成效 (噸)',
        data: [120, 150, 180, 220],
        backgroundColor: '#2ABF75',
        borderRadius: 4,
      },
       {
        label: '公益投入 (萬)',
        data: [50, 50, 80, 100],
        backgroundColor: '#F0AC18',
        borderRadius: 4,
      },
    ],
  };
  return <Bar data={data} options={{ responsive: true, scales: { x: { grid: { display: false } } } }} />;
};
