import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, logout } from '@/lib/auth';
import { User } from '@/lib/users';
import { FiLogOut, FiBell, FiUser } from 'react-icons/fi';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (!u) {
      router.push('/'); // Redirect to login if not authenticated
    }
  }, [router]);

  if (!user) return null; // or a loading spinner

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to login after logout
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#8b0000',
          color: 'white',
          borderBottom: '1px solid #ddd',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/iztech-logo.png"
            alt="IYTE Logo"
            style={{
              height: '50px',
              width: 'auto',
              marginRight: '10px',
            }}
          />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>IZTECH</span>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Input
            type="text"
            placeholder="Search..."
            style={{
              width: '50%',
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* Notifications and User Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Notifications */}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            <FiBell />
          </button>

          {/* User Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <FiUser style={{ marginRight: '5px', fontSize: '20px' }} />
            <span>{user.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 10px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: 'white',
            }}
          >
            <FiLogOut style={{ marginRight: '5px' }} /> Logout
          </button>
        </div>
      </nav>

      {/* Default Home Page Content */}
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#8b0000', fontSize: '24px', fontWeight: 'bold' }}>
          Welcome, {user.name}
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>
          This is the Automated Graduation Management System (AGMS) home page.
        </p>

        {/* AGMS Rules Section */}
        <div
          style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ color: '#8b0000', marginBottom: '10px', fontSize: '20px' }}>
            AGMS Rules
          </h2>
          <ul style={{ lineHeight: '1.8', fontSize: '16px', color: '#555' }}>
        {/* Graduation Process Section */}
            <li>
              <strong>Tracking Graduation Status:</strong> Upon logging in, you will see a Graduation Status Panel on the main page. Your completed ECTS credits, courses, and GPA will be displayed automatically.
            </li>
            <li>
              <strong>Notification of Missing Requirements:</strong> If you do not meet a requirement for graduation (e.g., missing courses, insufficient credits), the system will notify you automatically. Details on how to resolve these deficiencies will also be provided in this panel.
            </li>
            <li>
              <strong>Advisor Approval:</strong> Your documents will be sent to your advisor for review through the system. Your advisor will check your transcript and eligibility for graduation. Once approved, you will receive a notification.
            </li>
            <li>
              <strong>Faculty and Administrative Approvals:</strong> After advisor approval, your documents will be forwarded to the department secretary and the faculty dean. You can monitor the progress of these approvals through the system.
            </li>
            <li>
              <strong>Severance Process:</strong> The system will guide you through the severance process, including requirements from the library, financial office, and SKS (Health, Culture, and Sports). You will see which clearances have been completed and which are still pending.
            </li>
            <li>
              <strong>Graduation Ceremony Preparations:</strong> Information about your graduation ceremony participation, including date, time, and gown collection details, will be provided through the system.
            </li>
            <li>
              <strong>Diploma Process:</strong> Once all graduation criteria are met, your diploma preparation will begin, and your diploma number will be assigned. You will be informed when and where to collect your diploma.
            </li>
            <li>
              <strong>Real-Time Notifications and Communication:</strong> You will receive real-time updates via SMS or email for each step of the process. Additionally, you can contact your advisor or relevant department through the messaging feature in the system.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
