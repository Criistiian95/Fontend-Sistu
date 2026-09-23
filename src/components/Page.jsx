import React from "react";
import Navbar from "./Navbar";
export default function Page({ title, subtitle, action, children }) {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">TU CONSULTORIO AL DÍA</span>
            <h1>{title}</h1>
            <p className="muted">{subtitle}</p>
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
