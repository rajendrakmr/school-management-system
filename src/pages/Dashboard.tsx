import React from "react";
import {
  Users,
  Layers,
  Calendar,
  BookOpen,
  FileMinus,
  ClipboardList,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  Responsive as ResponsiveGridLayout,
  WidthProvider,
} from "react-grid-layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveLayout = WidthProvider(ResponsiveGridLayout);

// ✅ Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="card h-100">
    <div className="card-body text-md-start text-center">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="card-title">{title}</h6>
        <span>{icon}</span>
      </div>
      <h3>{value}</h3>
    </div>
  </div>
);
// Add monthly transaction data
const transactionData = [
  { month: "Jan", transactions: 120 },
  { month: "Feb", transactions: 150 },
  { month: "Mar", transactions: 180 },
  { month: "Apr", transactions: 200 },
  { month: "May", transactions: 170 },
  { month: "Jun", transactions: 220 },
  { month: "Jul", transactions: 250 },
  { month: "Aug", transactions: 210 },
  { month: "Sep", transactions: 190 },
  { month: "Oct", transactions: 230 },
  { month: "Nov", transactions: 240 },
  { month: "Dec", transactions: 260 },
];


// ✅ Demo Data
const attendanceData = [
  { day: "Mon", present: 420, absent: 30 },
  { day: "Tue", present: 415, absent: 35 },
  { day: "Wed", present: 430, absent: 20 },
  { day: "Thu", present: 400, absent: 50 },
  { day: "Fri", present: 425, absent: 25 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="_rkContentBorder">
      <div className="d-flex justify-content-between align-items-center grid-margin mb-4">
        <h4>Welcome to School Dashboard : Smart SAAS</h4>
      </div>

      {/* 🔥 Drag & Drop Grid */}
      <ResponsiveLayout
        className="layout"
        rowHeight={150}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {/* Stats Section */}
        <div key="stats" data-grid={{ x: 0, y: 0, w: 8, h: 2 }}>
          <div className="row">
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Total Classes" value={12} icon={<Layers size={32} color="#007bff" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Total Students" value={450} icon={<Users size={32} color="#28a745" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Total Teachers" value={35} icon={<BookOpen size={32} color="#ffc107" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="School Holidays" value={15} icon={<Calendar size={32} color="#17a2b8" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="On Leave Today" value={5} icon={<FileMinus size={32} color="#dc3545" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Pending Applications" value={3} icon={<ClipboardList size={32} color="#6f42c1" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Check In Today" value={420} icon={<LogIn size={32} color="#20c997" />} />
            </div>
            <div className="col-md-3 col-6 mb-3">
              <StatCard title="Check Out Today" value={400} icon={<LogOut size={32} color="#fd7e14" />} />
            </div>
          </div>
        </div>

        {/* Attendance Graph */}
        <div key="attendance" data-grid={{ x: 0, y: 2, w: 6, h: 3 }}>
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-3">Weekly Attendance</h5>
              <BarChart width={500} height={250} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#28a745" />
                <Bar dataKey="absent" fill="#dc3545" />
              </BarChart>
            </div>
          </div>
        </div>

        {/* Student Growth Chart */}
        <div key="growth" data-grid={{ x: 6, y: 2, w: 6, h: 3 }}>
          <div className="card h-100">
            <div className="card-body">
              <h5 className="mb-3">Student Growth</h5>
              <LineChart width={500} height={250} data={[
                { year: "2021", students: 350 },
                { year: "2022", students: 400 },
                { year: "2023", students: 420 },
                { year: "2024", students: 450 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#007bff" strokeWidth={3} />
              </LineChart>
            </div>
          </div>
        </div>
        {/* Monthly Transactions Chart */}
<div key="transactions" data-grid={{ x: 0, y: 5, w: 12, h: 3 }}>
  <div className="card h-100">
    <div className="card-body">
      <h5 className="mb-3">Monthly Transactions</h5>
      <LineChart width={1000} height={300} data={transactionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="transactions"
          stroke="#ffc107"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  </div>
</div>


        {/* Punch Section */}
        <div key="punch" data-grid={{ x: 8, y: 0, w: 4, h: 2 }}>
          <div className="card h-100">
            <div className="card-body text-center">
              <p className="text-primary fw-bold mb-2">Thursday 03/27/2025</p>
              <button className="btn btn-lg btn-danger mb-3">Punch Out</button>
              <div className="d-flex justify-content-around">
                <span>
                  Check In At
                  <p className="text-success fw-bold h5">08:15 AM</p>
                </span>
                <span>
                  Check Out At
                  <p className="text-danger fw-bold h5">-:-:-</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Dashboard;
