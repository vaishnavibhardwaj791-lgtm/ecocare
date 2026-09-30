export default function AdminSettings() {
  return (
    <div className="card" style={{ padding: 24, maxWidth: 640 }}>
      <h1>Settings</h1>
      <p style={{ margin: '8px 0 20px' }}>Prototype configuration for the municipal dashboard.</p>
      <div className="form-field">
        <label>City / campus name</label>
        <input defaultValue="Greenfield Municipal Corporation" />
      </div>
      <div className="form-field">
        <label>Default response SLA</label>
        <select defaultValue="24 hours">
          <option>12 hours</option>
          <option>24 hours</option>
          <option>48 hours</option>
        </select>
      </div>
      <div className="form-field">
        <label>Citizen notifications</label>
        <select defaultValue="Email + in-app">
          <option>In-app only</option>
          <option>Email + in-app</option>
        </select>
      </div>
      <button className="btn btn-primary">Save settings</button>
    </div>
  )
}
