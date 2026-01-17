import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService, uploadService } from "../services/api";
import { getUser, clearAuth } from "../utils/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Card, { CardHeader, CardContent, CardActions } from "../components/Card";
import Badge from "../components/Badge";
import Alert from "../components/Alert";

function EmployeeDashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const response = await attendanceService.getMyAttendance();
      setAttendanceRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setUploadingPhoto(true);
    setError("");

    try {
      const response = await uploadService.upload(file);
      setPhotoUrl(response.data.url);
      setSuccess("Photo uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to upload photo:", err);
      setError(err.response?.data?.message || "Failed to upload photo");
      setPhoto(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await attendanceService.create({
        photoUrl: photoUrl,
        notes: notes,
      });
      setSuccess("Attendance submitted successfully!");
      setPhoto(null);
      setPhotoUrl("");
      setNotes("");
      fetchMyAttendance();

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Employee Dashboard
                </h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Attendance Form */}
          <Card elevation={2}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                📸 Submit Today's Attendance
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload your photo and add optional notes
              </p>
            </CardHeader>

            <CardContent>
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
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  className="mb-4"
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (Required)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={uploadingPhoto}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                  {uploadingPhoto && (
                    <p className="mt-2 text-sm text-blue-600">
                      ⏳ Uploading photo...
                    </p>
                  )}
                  {photo && !uploadingPhoto && photoUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-2">
                        ✓ {photo.name}
                      </p>
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border-2 border-green-500"
                      />
                    </div>
                  )}
                </div>

                <Input
                  label="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your work today..."
                  fullWidth
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || !photoUrl || uploadingPhoto}
                >
                  {loading ? "Submitting..." : "Submit Attendance"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card
            elevation={2}
            className="bg-gradient-to-br from-blue-600 to-purple-600 text-white"
          >
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Attendance Summary</h3>
                <svg
                  className="w-8 h-8 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-t border-white/20">
                  <span className="text-white/90">Total Records</span>
                  <span className="text-2xl font-bold">
                    {attendanceRecords.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-white/20">
                  <span className="text-white/90">This Month</span>
                  <span className="text-2xl font-bold">
                    {
                      attendanceRecords.filter(
                        (r) =>
                          new Date(r.attendanceDate).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-white/20">
                  <span className="text-white/90">Today's Status</span>
                  <Badge color="success" className="bg-green-500 text-white">
                    {attendanceRecords.some(
                      (r) =>
                        new Date(r.attendanceDate).toDateString() ===
                        new Date().toDateString()
                    )
                      ? "Submitted"
                      : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card elevation={2} className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              📋 Attendance History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Your past attendance records
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  No attendance records yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Submit your first attendance above
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
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
                            {formatDate(record.attendanceDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color="info">
                            {formatTime(record.checkInTime)}
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
      </main>
    </div>
  );
}

export default EmployeeDashboard;
