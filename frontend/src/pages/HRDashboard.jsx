import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService, attendanceService } from "../services/api";
import { getUser, clearAuth } from "../utils/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Card, { CardHeader, CardContent, CardActions } from "../components/Card";
import Badge from "../components/Badge";
import Alert from "../components/Alert";

function HRDashboard() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    employeeCode: "",
    department: "",
    position: "",
    phone: "",
    hireDate: "",
  });

  useEffect(() => {
    if (activeTab === "employees") {
      fetchEmployees();
    } else {
      fetchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to fetch employees");
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await attendanceService.getAll();
      setAttendanceRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setError("Failed to fetch attendance records");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData);
        setSuccess("Employee updated successfully!");
      } else {
        await employeeService.create(formData);
        setSuccess("Employee created successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      email: employee.email || "",
      password: "",
      fullName: employee.fullName || "",
      employeeCode: employee.employeeCode || "",
      department: employee.department || "",
      position: employee.position || "",
      phone: employee.phone || "",
      hireDate: employee.hireDate?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await employeeService.delete(id);
      setSuccess("Employee deleted successfully!");
      fetchEmployees();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Failed to delete employee:", err);
      setError("Failed to delete employee");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      fullName: "",
      employeeCode: "",
      department: "",
      position: "",
      phone: "",
      hireDate: "",
    });
    setEditingEmployee(null);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">HR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  HR Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "employees"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              👥 Employees
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "attendance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              📊 Attendance Records
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            className="mb-4"
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" onClose={() => setError("")} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                elevation={2}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Total Employees
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        {employees.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                elevation={2}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        Active Today
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        {
                          attendanceRecords.filter(
                            (r) =>
                              new Date(r.attendanceDate).toDateString() ===
                              new Date().toDateString()
                          ).length
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                elevation={2}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">
                        This Month
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        {
                          attendanceRecords.filter(
                            (r) =>
                              new Date(r.attendanceDate).getMonth() ===
                              new Date().getMonth()
                          ).length
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employee Table Card */}
            <Card elevation={2}>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Employee Management
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage employee accounts and information
                  </p>
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  + Add Employee
                </Button>
              </CardHeader>

              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">
                      No employees yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Click "Add Employee" to create your first employee
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {employee.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {employee.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {employee.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge color="info">
                                {employee.employeeCode}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.department || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employee.position || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                color={
                                  employee.isActive ? "success" : "default"
                                }
                              >
                                {employee.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="text"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEdit(employee)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="text"
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <Card elevation={2}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Attendance Records
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View all employee attendance submissions
              </p>
            </CardHeader>

            <CardContent>
              {attendanceRecords.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">
                    No attendance records yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Records will appear here when employees submit attendance
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Photo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {record.employee?.fullName || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.employee?.employeeCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(record.attendanceDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge color="success">
                              {new Date(record.checkInTime).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {record.notes || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.photoUrl ? (
                              <a
                                href={record.photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Photo →
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No photo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            elevation={5}
          >
            <CardHeader className="sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />

                  <Input
                    label="Employee Code"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />

                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingEmployee}
                    fullWidth
                    helperText={
                      editingEmployee
                        ? "Leave blank to keep current password"
                        : ""
                    }
                  />

                  <Input
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <Input
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <Input
                    label="Hire Date"
                    name="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </div>
              </form>
            </CardContent>

            <CardActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingEmployee ? "Update Employee" : "Create Employee"}
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;
