import React, { useState, useEffect } from 'react';
import { Activity, Heart, Footprints, Watch, BedIcon } from 'lucide-react';

const FitbitDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [steps, setSteps] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const API_BASE_URL = 'http://localhost:8080';

  // Check if user is authorized
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: 'include'
      });
      setIsAuthorized(response.ok);
      return response.ok;
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsAuthorized(false);
      return false;
    }
  };

  const handleAuthorize = () => {
    // Store the current window location to redirect back after auth
    localStorage.setItem('fitbit_redirect', window.location.href);
    window.location.href = `${API_BASE_URL}/authorize`;
  };

  const fetchFitbitData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authorized = await checkAuthStatus();
      if (!authorized) {
        setError('Please authorize first');
        setLoading(false);
        return;
      }

      const fetchWithErrorHandling = async (url) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthorized(false);
            throw new Error('Authorization expired. Please authorize again.');
          }
          throw new Error(`Failed to fetch ${url}`);
        }

        return response.json();
      };

      const [profileData, stepsData, heartRateData] = await Promise.all([
        fetchWithErrorHandling('/test/profile'),
        fetchWithErrorHandling('/test/steps'),
        fetchWithErrorHandling('/test/heartrate'),
      ]);

      setProfile(profileData.user);

      const stepsValue = stepsData['activities-steps'] && stepsData['activities-steps'][0] ? stepsData['activities-steps'][0].value : null;
      setSteps(stepsValue);
      setHeartRate(heartRateData['activities-heart'][0]);

    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authorization')) {
        setIsAuthorized(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      const authorized = await checkAuthStatus();
      if (authorized) {
        fetchFitbitData();
      }
    };

    initializeDashboard();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_success') === 'true') {
      fetchFitbitData();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const DashboardCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-4 border-b bg-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          {Icon && <Icon className="h-6 w-6 text-blue-500" />}
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Fitbit Dashboard</h1>
        <button 
          onClick={handleAuthorize}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isAuthorized ? 'Reauthorize Fitbit' : 'Authorize Fitbit'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          {error.includes('authorize') && (
            <button
              onClick={handleAuthorize}
              className="ml-4 underline text-red-600"
            >
              Authorize now
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading Fitbit data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Profile" icon={Activity}>
            {profile ? (
              <div className="space-y-3 text-gray-600">
                <p><strong>Name:</strong> {profile.fullName}</p>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Height:</strong> {profile.height}cm</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
              </div>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </DashboardCard>

          <DashboardCard title="Daily Steps" icon={Footprints}>
            {steps !== null ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">{parseInt(steps, 10)}</div>
                <div className="text-gray-500">Steps Count</div>
              </div>
            ) : (
              <p className="text-gray-500">No steps data available</p>
            )}
          </DashboardCard>

          <DashboardCard title="Heart Rate" icon={Heart}>
            {heartRate && heartRate.value ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500">{heartRate.value.restingHeartRate}</div>
                <div className="text-gray-500">Resting Heart Rate</div>
              </div>
            ) : (
              <p className="text-gray-500">No heart rate data available</p>
            )}
          </DashboardCard>

          <DashboardCard title="Sleep Tracking" icon={BedIcon}>
          {profile ? (
              <div className="space-y-2 text-center"> 
                <p className="text-gray-500"><strong>Sleep Tracking: </strong>{profile.sleepTracking}</p>
              </div>
            ) : (
              <p className="text-gray-500">No Sleep data available</p>
            )}
          </DashboardCard>
        </div>
      )}
    </div>
  );
};

export default FitbitDashboard;
