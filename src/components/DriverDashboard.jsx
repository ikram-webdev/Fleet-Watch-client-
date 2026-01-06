import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { FaBus, FaSignOutAlt, FaTools, FaCheckCircle, FaRoad, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DriverDashboard = () => {
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    // --- Security: Sirf Driver hi is page ko dekh sakay ---
    useEffect(() => {
        if (!userId || role !== 'Driver') {
            navigate('/');
        }
    }, [userId, role, navigate]);

    // --- Gari ka data mangwane ka function ---
    const fetchMyVehicle = async () => {
        try {
            setLoading(true);
            // Note: Agar aapka assignment logic alag hai to yahan check karein
            // Hum filhal vehicles list se is driver ki gari dhoond rahe hain
            const res = await API.get('/vehicles/all');
            const myAssignedVehicle = res.data.find(v => v.assignedDriver?._id === userId || v.assignedDriver === userId);
            
            if (myAssignedVehicle) {
                setVehicle(myAssignedVehicle);
            } else {
                setVehicle(null);
            }
        } catch (err) {
            console.error("Error fetching vehicle:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchMyVehicle();
    }, [userId]);

    // --- Button Actions (Status Update Logic) ---
    const updateStatus = async (action) => {
        try {
            let endpoint = '';
            let statusText = '';

            // Backend routes ke mutabiq endpoints select karna
            if (action === 'start') {
                endpoint = `/vehicles/start-trip/${vehicle._id}`;
                statusText = 'On Trip';
            } else if (action === 'end') {
                endpoint = `/vehicles/end-trip/${vehicle._id}`;
                statusText = 'Available';
            } else if (action === 'maintenance') {
                endpoint = `/vehicles/maintenance/${vehicle._id}`;
                statusText = 'Maintenance';
            }

            await API.patch(endpoint);
            
            Swal.fire({
                title: 'Updated!',
                text: `Vehicle status changed to ${statusText}`,
                icon: 'success',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#0dcaf0'
            });
            
            fetchMyVehicle(); // Data refresh karein
        } catch (err) {
            console.error("Update Error:", err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update status. Please try again.',
                icon: 'error',
                background: '#1a1a1a',
                color: '#fff'
            });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (role !== 'Driver') return null;

    return (
        <div className="main-bg min-vh-100 p-4">
            <div className="container animate__animated animate__fadeIn">
                
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 glass-card shadow-sm" style={{borderRadius: '15px'}}>
                    <div className="d-flex align-items-center">
                        <div className="bg-info rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}>
                            <span className="text-dark fw-bold">{userName?.charAt(0).toUpperCase()}</span>
                        </div>
                        <h5 className="text-white mb-0">Welcome, <span className="text-info">{userName}</span></h5>
                    </div>
                    <button onClick={handleLogout} className="btn glass-btn-outline btn-sm px-3">
                        <FaSignOutAlt className="me-2" /> Logout
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-white mt-5"><h5>Loading vehicle details...</h5></div>
                ) : vehicle ? (
                    <div className="row g-4">
                        {/* Left: Vehicle Details */}
                        <div className="col-md-6">
                            <div className="glass-card p-5 h-100 text-center text-white border-info border-opacity-25">
                                <div className="mb-4">
                                    <FaBus size={70} className={`text-info ${vehicle.status === 'On Trip' ? 'animate__animated animate__pulse animate__infinite' : ''}`} />
                                </div>
                                <h4 className="text-white-50">Assigned Vehicle</h4>
                                <h1 className="display-3 fw-bold my-3">{vehicle.plateNumber}</h1>
                                <p className="fs-5 mb-4">{vehicle.model}</p>
                                <div className={`badge p-3 px-5 fs-6 rounded-pill ${
                                    vehicle.status === 'On Trip' ? 'bg-primary shadow-primary' : 
                                    vehicle.status === 'Maintenance' ? 'bg-danger shadow-danger' : 'bg-success shadow-success'
                                }`}>
                                    {vehicle.status}
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick Actions */}
                        <div className="col-md-6">
                            <div className="glass-card p-5 h-100 text-white">
                                <h3 className="mb-4 text-center fw-light">Trip Control</h3>
                                <div className="d-grid gap-3">
                                    {/* Start Trip Button */}
                                    <button 
                                        onClick={() => updateStatus('start')} 
                                        className="btn glass-btn btn-lg py-3 d-flex align-items-center justify-content-center"
                                        // disabled={vehicle.status !== 'Available'}
                                    >
                                        <FaRoad className="me-2" /> Start Trip
                                    </button>
                                    
                                    {/* Complete Trip Button */}
                                    <button 
                                        onClick={() => updateStatus('end')} 
                                        className="btn btn-success btn-lg py-3 d-flex align-items-center justify-content-center border-0"
                                        // disabled={vehicle.status !== 'On Trip'}
                                    >
                                        <FaCheckCircle className="me-2" /> Complete Trip
                                    </button>
                                    
                                    {/* Maintenance Button */}
                                    <button 
                                        onClick={() => updateStatus('maintenance')} 
                                        className="btn btn-danger btn-lg py-3 d-flex align-items-center justify-content-center border-0"
                                        // disabled={vehicle.status === 'Maintenance'}
                                    >
                                        <FaTools className="me-2" /> Report Issue / Maintenance
                                    </button>
                                </div>
                                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-3 text-center">
                                    <small className="text-white-50">
                                        <FaExclamationTriangle className="me-1 text-warning" /> 
                                        Status changes are visible to Admin in real-time.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-5 text-center text-white mt-5 animate__animated animate__zoomIn">
                        <FaExclamationTriangle size={60} className="text-warning mb-4" />
                        <h2 className="mb-3">Vehicle Not Assigned</h2>
                        <p className="fs-5 text-white-50">Please contact the management to assign a vehicle to your account.</p>
                        <button className="btn glass-btn mt-3" onClick={fetchMyVehicle}>Refresh Status</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverDashboard;