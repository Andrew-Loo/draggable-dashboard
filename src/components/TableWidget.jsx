export default function TableWidget() {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr>
          <th className="border p-1">ID</th>
          <th className="border p-1">Name</th>
          <th className="border p-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i}>
            <td className="border p-1">#{1000 + i}</td>
            <td className="border p-1">Item {i + 1}</td>
            <td className="border p-1">OK</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
