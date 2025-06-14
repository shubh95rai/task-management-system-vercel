import momemt from "moment";

export default function TaskListTable({ tableData }) {
  function getStatusBadgeColor(status) {
    switch (status) {
      case "Pending":
        return "bg-purple-100 text-purple-500 border border-purple-200";
      case "In Progress":
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
      case "Completed":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  }

  function getPriorityBadgeColor(priority) {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";
      case "Medium":
        return "bg-orange-100 text-orange-500 border border-orange-200";
      case "High":
        return "bg-red-100 text-red-500 border border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg mt-3 p-0">
      <table className="min-w-full">
        <thead>
          <tr className="text-left *:py-3 *:px-4 *:text-gray-800 *:font-medium *:text-sm">
            <th>Name</th>
            <th>Status</th>
            <th className="hidden sm:table-cell">Priority</th>
            <th className="hidden md:table-cell">Created At</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="my-3 mt-5 mx-4 text-gray-700 text-sm line-clamp-1 overflow-hidden">
                {task.title}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs inline-block rounded-lg text-nowrap ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="p-4 hidden sm:table-cell">
                <span
                  className={`px-2 py-1 text-xs inline-block rounded-lg ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="p-4 text-gray-700 text-sm text-nowrap hidden md:table-cell">
                {task.createdAt
                  ? momemt(task.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
