


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


const ProgressStatsCard = ({ stats, problemsByDifficulty }) => {

  const { theme } = useSelector(state => state.auth);

  const solvedCounts = { easy: 0, medium: 0, hard: 0 };
  solvedCounts.easy = stats?.difficultyCounts?.easy ;
  solvedCounts.medium = stats?.difficultyCounts?.medium;
  solvedCounts.hard = stats?.difficultyCounts?.hard;




  const totalSolved = (solvedCounts.easy + solvedCounts.medium + solvedCounts.hard) || '-';
  const totalProblems = (problemsByDifficulty?.totalEasy + problemsByDifficulty?.totalHard + problemsByDifficulty?.totalMedium) || 0;

  const easyPercent = totalProblems > 0 ? (solvedCounts.easy / totalProblems) * 100 : 0;
  const mediumPercent = totalProblems > 0 ? (solvedCounts.medium / totalProblems) * 100 : 0;
  const hardPercent = totalProblems > 0 ? (solvedCounts.hard / totalProblems) * 100 : 0;


  const mediumRotation = (easyPercent / 100) * 360;
  const hardRotation = ((easyPercent + mediumPercent) / 100) * 360;

  const chartSize = '8rem'; 
  const chartThickness = '.4rem'; 

  return (
    <div className={`card w-full max-w-sm  p-6 font-sans ${theme == 'dark' ? 'bg-gray-100/5' : 'shadow'}`}>
      <div className="flex items-center justify-between gap-6">

        <div className="relative flex-shrink-0" style={{ width: chartSize, height: chartSize }}>

          <div
            className="radial-progress text-base-200"
            style={{ "--value": 100, "--size": chartSize, "--thickness": chartThickness }}
            role="progressbar"
          ></div>


          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="radial-progress text-cyan-400"
              style={{
                "--value": easyPercent,
                "--size": chartSize,
                "--thickness": chartThickness,
              }}
              role="progressbar"
            ></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotate(${mediumRotation}deg)` }}>
            <div
              className="radial-progress text-amber-400"
              style={{
                "--value": mediumPercent,
                "--size": chartSize,
                "--thickness": chartThickness,
              }}
              role="progressbar"
            ></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotate(${hardRotation}deg)` }}>
            <div
              className="radial-progress text-rose-400"
              style={{
                "--value": hardPercent,
                "--size": chartSize,
                "--thickness": chartThickness,
              }}
              role="progressbar"
            ></div>
          </div>

          {/* Central Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-700">
              {totalSolved}
              <span className="text-xl font-medium text-slate-400">/{totalProblems}</span>
            </span>
            <span className="text-md text-slate-500 flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Solved
            </span>

          </div>
        </div>

        {/* Right Side: Difficulty Breakdown */}
        <div className="flex flex-col space-y-3">
          <div className=" text-[12px] badge badge-ghost flex-col px-8 py-5 gap-0 rounded  ">
            <p className="text-info text-xs font-semibold">Easy</p>
            <p className="font-semibold ">
              {solvedCounts.easy|| '-'}
              <span className="">/{problemsByDifficulty?.totalEasy}</span>
            </p>
          </div>
          <div className=" text-[12px] badge badge-ghost flex-col px-8 py-5 gap-0 rounded  ">
            <p className="text-warning text-xs font-semibold">Med</p>
            <p className="font-semibold ">
              {solvedCounts.medium || '-'}
              <span className="">/{problemsByDifficulty?.totalMedium}</span>
            </p>
          </div>
          <div className=" text-[12px] badge badge-ghost flex-col px-8 py-5 gap-0 rounded  ">
            <p className="text-error text-xs font-semibold">Hard</p>
            <p className="font-semibold ">
              {solvedCounts.hard || '-'}
              <span className="">/{problemsByDifficulty?.totalHard}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStatsCard;