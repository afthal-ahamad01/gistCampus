
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        programmes: 0,
        facultyDistribution: [],
        enrollmentTrends: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch basic counts
                const studentsSnap = await getDocs(collection(db, "students"));
                const coursesSnap = await getDocs(collection(db, "courses"));
                const programmesSnap = await getDocs(collection(db, "programmes"));

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

                // Calculate Real Enrollment Trends by Month
                const studentsWithDates = studentsSnap.docs
                    .map(doc => ({
                        ...doc.data(),
                        createdAt: doc.data().createdAt
                    }))
                    .filter(student => student.createdAt);

                // Group by month
                const monthCounts = {};
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                studentsWithDates.forEach(student => {
                    let date;
                    if (student.createdAt?.toDate) {
                        // Firestore Timestamp
                        date = student.createdAt.toDate();
                    } else if (student.createdAt) {
                        // Regular date
                        date = new Date(student.createdAt);
                    }

                    if (date && date.getFullYear() === 2025) {
                        const month = months[date.getMonth()];
                        monthCounts[month] = (monthCounts[month] || 0) + 1;
                    }
                });

                // Create enrollment trends data
                const enrollmentTrends = months.map(month => ({
                    name: month,
                    students: monthCounts[month] || 0
                }));

                setStats({
                    students: studentsSnap.size,
                    courses: coursesSnap.size,
                    programmes: programmesSnap.size,
                    facultyDistribution,
                    enrollmentTrends
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

    if (loading) {
        return <div className="p-6 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Cards - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <StatCard title="Total Students" value={stats.students} color="bg-blue-500" />
                <StatCard title="Active Courses" value={stats.courses} color="bg-green-500" />
                <StatCard title="Programmes" value={stats.programmes} color="bg-purple-500" />
            </div>

            {/* Charts - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Faculty Distribution Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Students by Faculty</h2>
                    <div className="h-64 md:h-80 min-h-[16rem]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.facultyDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={window.innerWidth < 768 ? 60 : 80}
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
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Enrollment Trends (2025)</h2>
                    <div className="h-64 md:h-80 min-h-[16rem]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.enrollmentTrends}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: -10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '14px' }} />
                                <Bar dataKey="students" fill="#3B82F6" name="New Enrollments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity - Mobile Responsive */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-sm md:text-base text-gray-500">System initialized. Waiting for new activities.</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border-l-4 border-primary">
        <h3 className="text-gray-500 text-xs md:text-sm font-medium">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

export default AdminDashboard;
