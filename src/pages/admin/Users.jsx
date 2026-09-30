import { initialUsers } from '../../data/mockData'

export default function AdminUsers() {
  return (
    <div className="stack">
      <h1>Users</h1>
      <div className="card" style={{ padding: 8 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Area</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {initialUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.area}</td>
                  <td>{u.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
