import React from "react";
import { Card } from "react-bootstrap";

const DashboardTable = ({ recentActivity, notifications }) => {
  return (
    <>
      {/* Recent Activity */}
      <Card className="shadow-sm mb-3 border-0">
        <Card.Header className="fw-semibold bg-light">
          Recent Activity
        </Card.Header>
        <Card.Body>
          {recentActivity.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {recentActivity.map((activity, idx) => (
                <li key={idx} className="mb-3">
                  <strong>{activity.type}</strong> - {activity.detail}
                  <br />
                  <small className="text-muted">{activity.time}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent activity</p>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardTable;
