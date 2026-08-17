import React from 'react';

const RecordsTable = ({ records }) => {
  if (!records || records.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>No attendance records found.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Session</th>
            <th>Time Scanned</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.name}</td>
              <td>{record.rollNo}</td>
              <td>{record.email}</td>
              <td>{record.sessionTitle || (record.session && record.session.title) || 'Unknown'}</td>
              <td>{new Date(record.scannedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
