
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        campuses: 0,
        facultyDistribution: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch basic counts
                const studentsSnap = await getDocs(collection(db, "students"));
                const coursesSnap = await getDocs(collection(db, "courses"));
                const campusesSnap = await getDocs(collection(db, "campuses"));

                // Calculate Faculty Distribution
                const students = studentsSnap.docs.map(doc => doc.data());
                const facultyCounts = {};
                students.forEach(student => {
                    const faculty = student.faculty || "Unknown";
                    facultyCounts[faculty] = (facultyCounts[faculty] || 0) + 1;
                });

                const facultyDistribution = Object.keys(facultyCounts).map(key => ({
                    name: key,
                    value: facultyCounts[key]
                }));

                setStats({
                    students: studentsSnap.size,
                    courses: coursesSnap.size,
                    campuses: campusesSnap.size,
                    facultyDistribution
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Mock data for enrollments over time (since we don't have historical data easily accessible yet)
    const enrollmentData = [
        { name: 'Jan', students: 40 },
        { name: 'Feb', students: 30 },
        { name: 'Mar', students: 20 },
        { name: 'Apr', students: 27 },
        { name: 'May', students: 18 },
        { name: 'Jun', students: 23 },
        { name: 'Jul', students: 34 },
    ];

    if (loading) {
        return <div className="p-6 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Students" value={stats.students} color="bg-blue-500" />
                <StatCard title="Active Courses" value={stats.courses} color="bg-green-500" />
                <StatCard title="Campuses" value={stats.campuses} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Faculty Distribution Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Students by Faculty</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.facultyDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.facultyDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Enrollment Trends Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Enrollment Trends (2025)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={enrollmentData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#3B82F6" name="New Enrollments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">System initialized. Waiting for new activities.</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

export default AdminDashboard;
