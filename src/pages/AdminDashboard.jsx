import React, { useState, useEffect } from "react";

import {

  FaBus, FaUsers, FaClipboardList, FaSignOutAlt, FaChartPie,

  FaShieldAlt, FaTrash, FaEdit, FaTimes, FaCheck, FaHistory, FaSearch, FaEye ,FaEyeSlash,

} from "react-icons/fa";

// Chart Components Add Kiye

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import Swal from "sweetalert2";

import "../App.css";



const AdminDashboard = () => {

  const navigate = useNavigate();



  // --- 1. SECURITY & ACCESS CONTROL ---

  const role = localStorage.getItem("role");

  if (role !== "Admin") {

    return (

      <div className="main-bg min-vh-100 d-flex align-items-center justify-content-center text-white">

        <div className="glass-card p-5 text-center animate__animated animate__fadeIn">

          <FaShieldAlt size={50} className="text-danger mb-3" />

          <h1>Access Denied</h1>

          <p>You don't have permission to view this page.</p>

          <button className="btn glass-btn" onClick={() => navigate("/")}>

            Back to Login

          </button>

        </div>

      </div>

    );

  }



  // --- 2. STATES ---

  const [activeTab, setActiveTab] = useState("overview");

  const [vehicles, setVehicles] = useState([]);

  const [drivers, setDrivers] = useState([]);

  const [assignments, setAssignments] = useState([]);



  const [searchVehicle, setSearchVehicle] = useState("");

  const [searchDriver, setSearchDriver] = useState("");

  const [searchAssign, setSearchAssign] = useState("");



  const [showAddForm, setShowAddForm] = useState(false);

  const [showDriverForm, setShowDriverForm] = useState(false);



  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({});



  const [vehicleData, setVehicleData] = useState({ plateNumber: "", model: "" });

  const [driverData, setDriverData] = useState({ name: "", email: "", password: "", role: "Driver" });

  const [assignData, setAssignData] = useState({ vehicleId: "", driverId: "" });



  // --- 3. FETCH DATA ---

  const fetchData = async () => {

    try {

      const [vRes, dRes, aRes] = await Promise.all([

        API.get("/vehicles/all"),

        API.get("/auth/all-drivers"),

        API.get("/assignments/all"),

      ]);

      setVehicles(vRes.data);

      setDrivers(dRes.data);

      setAssignments(aRes.data);

    } catch (err) { console.error("Error fetching data", err); }

  };



  useEffect(() => { fetchData(); }, []);



  // Chart Logic

  const pieData = [

    { name: "Available", value: vehicles.filter(v => v.status === "Available").length },

    { name: "Assigned", value: vehicles.filter(v => v.status !== "Available").length },

  ];

  const COLORS = ["#00df9a", "#f39c12"];



  // --- 4. SEARCH FILTERS ---

  const filteredVehicles = vehicles.filter(v => v.plateNumber.toLowerCase().includes(searchVehicle.toLowerCase()) || v.model.toLowerCase().includes(searchVehicle.toLowerCase()));

  const filteredDrivers = drivers.filter(d => d.name.toLowerCase().includes(searchDriver.toLowerCase()) || d.email.toLowerCase().includes(searchDriver.toLowerCase()));

  const filteredAssignments = assignments.filter(a => a.plateNumber.toLowerCase().includes(searchAssign.toLowerCase()) || (a.assignedDriver?.name || "").toLowerCase().includes(searchAssign.toLowerCase()));



  // --- 5. ACTION HANDLERS ---

  const handleDelete = async (type, id) => {

    const url = type === "vehicle" ? `/vehicles/delete/${id}` : `/auth/delete-driver/${id}`;

    const result = await Swal.fire({

      title: "Warning!", text: "Are you sure?", icon: "warning",

      showCancelButton: true, confirmButtonColor: "#d33", background: "#1a1a1a", color: "#fff",

    });

    if (result.isConfirmed) {

      try { await API.delete(url); fetchData(); Swal.fire("Deleted!", "", "success"); }

      catch (err) { Swal.fire("Error", "Failed to delete", "error"); }

    }

  };



  const handleCancelAssignment = async (vehicleId) => {

    const result = await Swal.fire({ title: "Cancel?", icon: "warning", showCancelButton: true, background: "#1a1a1a", color: "#fff" });

    if (result.isConfirmed) {

      try { await API.put(`/assignments/cancel/${vehicleId}`); fetchData(); Swal.fire("Success", "Cancelled!", "success"); }

      catch (err) { Swal.fire("Error", "Failed", "error"); }

    }

  };



  const startEdit = (item) => { setEditingId(item._id); setEditData({ ...item }); };



  const handleUpdate = async (type) => {

    const url = type === "vehicle" ? `/vehicles/update/${editingId}` : `/auth/update-driver/${editingId}`;

    try {

      await API.put(url, editData);

      setEditingId(null);

      fetchData();

      Swal.fire("Updated!", "", "success");

    } catch (err) { Swal.fire("Error", "Update failed", "error"); }

  };



  const handleVehicleSubmit = async (e) => {

    e.preventDefault();

    try { await API.post("/vehicles/add", vehicleData); setVehicleData({ plateNumber: "", model: "" }); setShowAddForm(false); fetchData(); }

    catch (err) { Swal.fire("Error", "Failed", "error"); }

  };



  const handleDriverSubmit = async (e) => {

    e.preventDefault();

    try { await API.post("/auth/register", driverData); setDriverData({ name: "", email: "", password: "", role: "Driver" }); setShowDriverForm(false); fetchData(); }

    catch (err) { Swal.fire("Error", "Failed", "error"); }

  };



  const handleAssignSubmit = async (e) => {

    e.preventDefault();

    try { await API.post("/assignments/create", assignData); setAssignData({ vehicleId: "", driverId: "" }); fetchData(); Swal.fire("Success", "Assigned!", "success"); }

    catch (err) { Swal.fire("Error", "Failed", "error"); }

  };



  const handleLogout = () => { localStorage.clear(); navigate("/"); };



  return (

    <div className="main-bg d-flex">

      {/* Sidebar - Added Slide Animation */}

      <div className="glass-sidebar animate__animated animate__slideInLeft">

        <h3 className="brand-logo fs-4 mb-5 text-center"><b>Fleet Watch</b> ADMIN</h3>

        <nav className="nav flex-column gap-2">

          <button onClick={() => setActiveTab("overview")} className={`nav-link glass-nav-link ${activeTab === "overview" ? "active" : ""}`}><FaChartPie className="me-2" /> Overview</button>

          <button onClick={() => setActiveTab("vehicles")} className={`nav-link glass-nav-link ${activeTab === "vehicles" ? "active" : ""}`}><FaBus className="me-2" /> Vehicles</button>

          <button onClick={() => setActiveTab("drivers")} className={`nav-link glass-nav-link ${activeTab === "drivers" ? "active" : ""}`}><FaUsers className="me-2" /> Drivers</button>

          <button onClick={() => setActiveTab("assign")} className={`nav-link glass-nav-link ${activeTab === "assign" ? "active" : ""}`}><FaClipboardList className="me-2" /> Assignments</button>

          <button onClick={() => navigate("/admin/reports")} className="nav-link glass-nav-link"><FaHistory className="me-2" /> Usage History</button>

        </nav>

        <button onClick={handleLogout} className="btn glass-btn-outline mt-auto w-100"><FaSignOutAlt className="me-2" /> Logout</button>

      </div>



      {/* Main Content */}

      <div className="content-area p-4 w-100 overflow-auto">

        <div className="d-flex align-items-center mb-4 p-3 glass-card shadow-sm animate__animated animate__fadeInDown">

          <h5 className="mb-0 text-white fw-light">FleetWatch / <span className="fw-bold text-info" style={{ textTransform: "capitalize" }}>{activeTab}</span></h5>
          <h6 style={gray}>Login as an Admin</h6>
        </div>



        <div className="glass-container-wide text-white">

          {/* TAB: OVERVIEW - Added Charts and Zoom Animation */}

          {activeTab === "overview" && (

            <div className="animate__animated animate__fadeIn">

              <h2 className="mb-4"><b>System Overview</b></h2>

              <div className="row g-4 mb-5">

                <div className="col-md-4"><div className="stat-card"><h4>{vehicles.length}</h4><p>Total Vehicles</p></div></div>

                <div className="col-md-4"><div className="stat-card"><h4>{drivers.length}</h4><p>Total Drivers</p></div></div>

                <div className="col-md-4"><div className="stat-card"><h4>{assignments.length}</h4><p>Active Assignments</p></div></div>

              </div>

              <div className="row">

                <div className="col-md-6 mx-auto">

                    <div className="glass-card p-4 text-center">

                        <h5>Vehicle Availability Status</h5>

                        <div style={{ width: "100%", height: 180 }}>

                            <ResponsiveContainer>

                                <PieChart>

                                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">

                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}

                                    </Pie>

                                    <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '10px', color: '#fff'}} />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                        <div className="d-flex justify-content-center gap-3 mt-2">

                            <small><span style={{color: '#00df9a'}}>●</span> Available</small>

                            <small><span style={{color: '#f39c12'}}>●</span> Assigned</small>

                        </div>

                    </div>

                </div>

              </div>

            </div>

          )}



          {/* TAB: VEHICLES - Added FadeInRight Animation */}

          {activeTab === "vehicles" && (

            <div className="animate__animated animate__fadeIn">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h2><b>Vehicles</b></h2>

                <div className="d-flex gap-3 align-items-center">

                  <div className="position-relative">

                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50" />

                    <input type="text" className="form-control glass-input ps-5" style={{ width: "250px" }} placeholder="Search Plate/Model..." value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} />

                  </div>

                  <button className="btn glass-btn" onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Close" : "+ Add Vehicle"}</button>

                </div>

              </div>

              {showAddForm && (

                <div className="glass-card p-4 mb-4 animate__animated animate__fadeIn">

                  <form className="row g-3" onSubmit={handleVehicleSubmit}>

                    <div className="col-md-5"><input type="text" className="form-control glass-input" placeholder="Vehicle Number" value={vehicleData.plateNumber} onChange={(e) => setVehicleData({ ...vehicleData, plateNumber: e.target.value })} required /></div>

                    <div className="col-md-5"><input type="text" className="form-control glass-input" placeholder="Brand/Model" value={vehicleData.model} onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })} required /></div>

                    <div className="col-md-2"><button className="btn glass-btn w-100">Save</button></div>

                  </form>

                </div>

              )}

              <table className="table glass-table text-white">

                <thead><tr><th>Plate</th><th>Models</th><th>Status</th><th>Actions</th></tr></thead>

                <tbody>

                  {filteredVehicles.map((v) => (

                    <tr key={v._id}>

                      <td>{editingId === v._id ? <input className="form-control glass-input" value={editData.plateNumber} onChange={(e) => setEditData({ ...editData, plateNumber: e.target.value })} /> : v.plateNumber}</td>

                      <td>{editingId === v._id ? <input className="form-control glass-input" value={editData.model} onChange={(e) => setEditData({ ...editData, model: e.target.value })} /> : v.model}</td>

                      <td><span className={`badge ${v.status === "Available" ? "bg-success" : "bg-warning"}`}>{v.status}</span></td>

                      <td>

                        {editingId === v._id ? (

                          <><FaCheck className="text-success me-3 cursor-pointer" onClick={() => handleUpdate("vehicle")} /><FaTimes className="text-danger cursor-pointer" onClick={() => setEditingId(null)} /></>

                        ) : (

                          <><FaEdit className="text-info me-3 cursor-pointer" onClick={() => startEdit(v)} /><FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete("vehicle", v._id)} /></>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



          {/* TAB: DRIVERS - Added FadeInLeft Animation */}

          {activeTab === "drivers" && (

            <div className="animate__animated animate__fadeIn">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h2><b>Drivers</b></h2>

                <div className="d-flex gap-3 align-items-center">

                   <div className="position-relative">

                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50" />

                    <input type="text" className="form-control glass-input ps-5" style={{ width: "250px" }} placeholder="Search..." value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} />

                  </div>

                  <button className="btn glass-btn" onClick={() => setShowDriverForm(!showDriverForm)}>{showDriverForm ? "Close" : "+ Register"}</button>

                </div>

              </div>

              {showDriverForm && (

                <div className="glass-card mb-4 p-4 animate__animated animate__fadeInDown">

                  <form className="row g-3" onSubmit={handleDriverSubmit}>

                    <div className="col-md-3"><input type="text" className="form-control glass-input" placeholder="Name" value={driverData.name} onChange={(e) => setDriverData({ ...driverData, name: e.target.value })} required /></div>

                    <div className="col-md-3"><input type="email" className="form-control glass-input" placeholder="Email" value={driverData.email} onChange={(e) => setDriverData({ ...driverData, email: e.target.value })} required /></div>

                    <div className="col-md-3"><input type="password" className="form-control glass-input" placeholder="Pass" value={driverData.password} onChange={(e) => setDriverData({ ...driverData, password: e.target.value })} required /></div>

                    <div className="col-md-3"><button type="submit" className="btn glass-btn w-100">Register</button></div>

                  </form>

                </div>

              )}

              <table className="table glass-table text-white">

                <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>

                <tbody>

                  {filteredDrivers.map((d) => (

                    <tr key={d._id}>

                      <td>{editingId === d._id ? <input className="form-control glass-input" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /> : d.name}</td>

                      <td>{editingId === d._id ? <input className="form-control glass-input" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} /> : d.email}</td>

                      <td>

                        {editingId === d._id ? (

                          <><FaCheck className="text-success me-3 cursor-pointer" onClick={() => handleUpdate("driver")} /><FaTimes className="text-danger cursor-pointer" onClick={() => setEditingId(null)} /></>

                        ) : (

                          <><FaEdit className="text-info me-3 cursor-pointer" onClick={() => startEdit(d)} /><FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete("driver", d._id)} /></>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



          {/* TAB: ASSIGNMENTS - Added ZoomIn Animation */}

          {activeTab === "assign" && (

            <div className="animate__animated animate__fadeIn">

              <h2 className="mb-4"><b>Assignments</b></h2>

              <div className="glass-card p-4 mb-5">

                <form className="row g-3 align-items-end" onSubmit={handleAssignSubmit}>

                  <div className="col-md-5">

                    <select className="form-select glass-input text-white" value={assignData.vehicleId} onChange={(e) => setAssignData({ ...assignData, vehicleId: e.target.value })} required>

                      <option value="">Choose Vehicle...</option>

                      {vehicles.filter((v) => v.status === "Available").map((v) => (<option key={v._id} value={v._id}>{v.plateNumber} ({v.model})</option>))}

                    </select>

                  </div>

                  <div className="col-md-5">

                    <select className="form-select glass-input text-white" value={assignData.driverId} onChange={(e) => setAssignData({ ...assignData, driverId: e.target.value })} required>

                      <option value="">Choose Driver...</option>

                      {drivers.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}

                    </select>

                  </div>

                  <div className="col-md-2"><button className="btn glass-btn w-100 py-2">Assign</button></div>

                </form>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <h4 className="mb-0">Active Assignments</h4>

                <div className="position-relative">

                   <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50" />

                   <input type="text" className="form-control glass-input ps-5" placeholder="Search..." value={searchAssign} onChange={(e) => setSearchAssign(e.target.value)} />

                </div>

              </div>

              <table className="table glass-table text-white">

                <thead><tr><th>Vehicle</th><th>Driver</th><th>Status</th><th>Actions</th></tr></thead>

                <tbody>

                  {filteredAssignments.length > 0 ? filteredAssignments.map((a) => (

                    <tr key={a._id}>

                      <td>{a.plateNumber}</td>

                      <td>{a.assignedDriver?.name || "N/A"}</td>

                      <td><span className="badge bg-primary">Assigned</span></td>

                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelAssignment(a._id)}><FaTimes className="me-1" /> Cancel</button></td>

                    </tr>

                  )) : <tr><td colSpan="4" className="text-center py-3">No assignments found.</td></tr>}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};



export default AdminDashboard;