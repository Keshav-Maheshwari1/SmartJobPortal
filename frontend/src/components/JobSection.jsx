import { Link } from "react-router-dom";
import { useFetchJobsByEmail } from "../customHooks/useJob";

const JobSection = ({ hrEmail, setSelectedJobId, onJobClick }) => {
  const { data: jobs = [], isLoading, error } = useFetchJobsByEmail(hrEmail);

  if (isLoading) return <p className="text-gray-400">Loading jobs...</p>;
  if (error)
    return <p className="text-red-500">Error loading jobs: {error.message}</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-xl text-white font-semibold mb-2 sm:mb-0">Jobs</h2>
        <Link to="/post-job">
          <button className="w-full sm:w-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Create a Job
          </button>
        </Link>
      </div>

      {jobs.length > 0 ? (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              onClick={() => {
                setSelectedJobId(job.id);
                onJobClick(job.id);
              }}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition cursor-pointer"
            >
              <h3 className="text-gray-100 font-medium text-base md:text-lg">
                {job.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {job.description}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No jobs posted yet.</p>
      )}
    </div>
  );
};

export default JobSection;
